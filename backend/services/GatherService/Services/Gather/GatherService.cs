using AutoMapper;
using Gather.Client;
using Gather.Data;
using Gather.Dtos.Gather;
using Gather.Models;
using Gather.Models.Gather;
using Gather.Services.Gather;
using Gather.Utils.Gather;
using Gather.Utils.Gather.Notification;
using Microsoft.EntityFrameworkCore;
using Serilog;
using System;
using System.Threading.Channels;
using System.Threading.Tasks;
using TL;

namespace Gather.Services;

public class GatherService : IGatherService
{

    private readonly IServiceScopeFactory _scopeFactory;

    GatherClient _client;
    IMapper _mapper;
    PobeditSettings _pobeditSettings;
    readonly IGatherNotifierFabric _loadingHelperFabric;
    TL.User? _user;
    GatherState _gatherState;
    private readonly Channel<BackgroundTask> _queue;
    private bool _disposed;
    bool _needClose = false;
    DateTime _postLastUpdateTime = DateTime.MinValue;
    DateTime _commentsLastUpdateTime = DateTime.MinValue;
    IGatherNotifier _loadingHelper;
    private readonly Random _random = new();
    private readonly CancellationTokenSource _processingCts = new();
    private readonly object _stateLock = new(); // Блокировка для состояния

    public GatherService(
        GatherClient client,
        IMapper mapper,
        ISettingsService settingsService,
        IGatherNotifierFabric loadingHelperFabric,
        IServiceScopeFactory scopeFactory)
    {
        _client = client;
        _mapper = mapper;

        _pobeditSettings = settingsService.PobeditSettings;
        _loadingHelperFabric = loadingHelperFabric;
        _scopeFactory = scopeFactory;

        _gatherState = new GatherState { State = GatherProcessState.Stopped };
        var options = new BoundedChannelOptions(1)
        {
            FullMode = BoundedChannelFullMode.Wait
        };
        _queue = System.Threading.Channels.Channel.CreateBounded<BackgroundTask>(options);
        _loadingHelper = loadingHelperFabric.Create();
        //ThreadPool.QueueUserWorkItem(_ => StartGatherAsync());
        _ = Task.Run(StartProcessingAsync, _processingCts.Token);




        // Добавьте отладочную информацию
        var settingsFromService = settingsService.PobeditSettings;
        Console.WriteLine($"Settings hash: {settingsFromService.GetHashCode()}");

        _pobeditSettings = settingsFromService;
        Console.WriteLine($"Stored settings hash: {_pobeditSettings.GetHashCode()}");

        // Проверьте, тот же ли это объект
        Console.WriteLine($"Same object: {ReferenceEquals(settingsFromService, _pobeditSettings)}");
    }

    private async Task StartProcessingAsync_old()
    {
        try
        {
            while (true)
            {
                // Ждем команды от пользователя.
                if (_queue.Reader.TryRead(out var task))
                {
                    // Переключение обратно после предыдущего выключения задачи сбора.
                    _needClose = false;

                    // При первом запуске сбора по команде пользователя не смотрим на время последней обработки.
                    int cicleCounter = 0;

                    Log.Information("Processing task {taskId}: {taskDescription}",
                        task.Id,
                        task.Description,
                        new
                        {
                            method = "StartGatherAsync"
                        }
                    );
                    while (!_needClose)
                    {
                        _gatherState.State = GatherProcessState.Paused;

                        // Загружаем все посты.
                        // У постов, которые были загружены более, чем определенное время назад
                        // и у которых не качались комментарии закачиваем комментарии.
                        // Заходим в цикл, в котором ждем когда наступит момент нового опроса
                        // каналов и закачки постов и комментариев или установки флага прекращения опроса.

                        // Загружаем посты. Пока грузим - внутри проверяем флаг прекращения загрузки.
                        if (cicleCounter == 0 || _postLastUpdateTime.AddHours(_pobeditSettings.ChannelPollingFrequency) <= DateTime.UtcNow)
                        {
                            Log.Information("Channels processing started at {Time}",
                                DateTime.Now,
                                new
                                {
                                    method = "StartGatherAsync"
                                }
                                );

                            cicleCounter++;
                            _gatherState.State = GatherProcessState.Running;

                            #region Posts loading.

                            using (var scope = _scopeFactory.CreateScope())
                            {
                                var context = scope.ServiceProvider.GetRequiredService<DataContext>();
                                var channelsIds = context.Channels.Select(c => c.TlgId).ToList();
                                foreach (var channelId in channelsIds)
                                {
                                    await Gatherer.UpdateChannelPosts(channelId, _loadingHelper, _client, context, _mapper, _pobeditSettings);
                                    if (_needClose)
                                    {
                                        // Останавливаем foreach. Потом проверим еще раз и выйдем из вложенного while.
                                        break;
                                    }
                                }
                            }

                            if (_needClose)
                            {
                                _gatherState.State = GatherProcessState.Stopped;
                                _gatherState.ToPollingChannelsSecs = 0;
                                _gatherState.ToPollingCommentsSecs = 0;
                                break;
                            }

                            #endregion


                            _postLastUpdateTime = DateTime.UtcNow;
                            _gatherState.State = GatherProcessState.Paused;
                        }
                        else
                        {
                            _gatherState.ToPollingChannelsSecs =
                                (int)_postLastUpdateTime
                                .AddHours(_pobeditSettings.ChannelPollingFrequency)
                                .Subtract(DateTime.UtcNow).TotalSeconds;
                        }


                        // Загружаем очень нежно комментарии. Пока грузим - внутри проверяем флаг прекращения загрузки.
                        if (_commentsLastUpdateTime.AddHours(_pobeditSettings.CommentsPollingDelay) <= DateTime.UtcNow)
                        {
                            Log.Information("Comments processing started at {Time}",
                                DateTime.Now,
                                new
                                {
                                    method = "StartGatherAsync"
                                }
                            );
                            _gatherState.State = GatherProcessState.Running;

                            #region Comments loading.

                            using (var scope = _scopeFactory.CreateScope())
                            {
                                var context = scope.ServiceProvider.GetRequiredService<DataContext>();
                                var channels = context.Channels;
                                foreach (var channel in channels)
                                {
                                    var posts = channel.Posts.Where(p => !p.AreCommentsLoaded);

                                    foreach (var post in posts)
                                    {
                                        await Gatherer.UpdatePostComments(
                                            channel.TlgId,
                                            post.TlgId,
                                            _loadingHelper,
                                            _client,
                                            context,
                                            _mapper,
                                            _pobeditSettings);
                                        Thread.Sleep(new Random().Next(10000, 20000));
                                    }

                                    if (_needClose)
                                    {
                                        // Останавливаем foreach. Потом проверим еще раз и выйдем из вложенного while.
                                        break;
                                    }

                                    // Нежно качаем.
                                    Thread.Sleep(new Random().Next(10000, 20000));
                                }
                            }

                            if (_needClose)
                            {
                                _gatherState.State = GatherProcessState.Stopped;
                                _gatherState.ToPollingChannelsSecs = 0;
                                _gatherState.ToPollingCommentsSecs = 0;
                                break;
                            }

                            #endregion

                            _commentsLastUpdateTime = DateTime.UtcNow;
                            _gatherState.State = GatherProcessState.Paused;
                        }
                        else
                        {
                            _gatherState.ToPollingCommentsSecs =
                                (int)_commentsLastUpdateTime
                                .AddHours(_pobeditSettings.CommentsPollingDelay)
                                .Subtract(DateTime.UtcNow).TotalSeconds;
                        }

                        await Task.Delay(TimeSpan.FromSeconds(10));
                        if (_needClose)
                        {
                            Log.Information("Gathering is stopping at {Time}",
                                DateTime.Now,
                                new
                                {
                                    method = "StartGatherAsync"
                                }
                            );

                            _gatherState.State = GatherProcessState.Stopped;
                            _gatherState.ToPollingChannelsSecs = 0;
                            _gatherState.ToPollingCommentsSecs = 0;
                            break;
                        }
                    }
                }
                else
                {
                    Thread.Sleep(1000);
                }
            }

        }
        catch (OperationCanceledException)
        {
            Log.Warning("Task processing was canceled",
                new
                {
                    method = "StartGatherAsync"
                }
            );
        }
        catch (Exception ex)
        {
            Log.Error(ex, "Error occurred while gathering",
                new
                {
                    method = "StartGatherAsync"
                });
        }
    }

    private async Task StartProcessingAsync()
    {
        try
        {
            await foreach (var task in _queue.Reader.ReadAllAsync(_processingCts.Token))
            {
                await ProcessTaskAsync(task, _processingCts.Token);
            }
        }
        catch (OperationCanceledException)
        {
            Log.Warning("Processing was canceled");
        }
        catch (Exception ex)
        {
            Log.Error(ex, "Error in processing loop");
        }
    }

    private async Task ProcessTaskAsync(BackgroundTask task, CancellationToken ct)
    {
        Log.Information("Processing task {TaskId}: {Description}", task.Id, task.Description);

        int cycleCounter = 0;
        while (!ct.IsCancellationRequested)
        {
            try
            {
                // Обработка постов
                if (cycleCounter == 0 || ShouldUpdatePosts())
                {
                    await ProcessPostsAsync(ct);
                    if (ct.IsCancellationRequested) break;

                    _postLastUpdateTime = DateTime.UtcNow;
                    cycleCounter++;
                }

                // Обработка комментариев
                if (ShouldUpdateComments())
                {
                    await ProcessCommentsAsync(ct);
                    if (ct.IsCancellationRequested) break;

                    _commentsLastUpdateTime = DateTime.UtcNow;
                }

                UpdateStateTimers();
                await Task.Delay(TimeSpan.FromSeconds(10), ct);
            }
            catch (Exception ex)
            {
                Log.Error(ex, "Error in processing cycle");
                await Task.Delay(TimeSpan.FromSeconds(30), ct); // Задержка при ошибке
            }
        }

        UpdateState(GatherProcessState.Stopped, 0, 0);
    }


    private async Task ProcessPostsAsync(CancellationToken ct)
    {
        UpdateState(GatherProcessState.Running, null, null);

        using var scope = _scopeFactory.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<DataContext>();

        var channelIds = await context.Channels
            .Select(c => c.TlgId)
            .ToListAsync(ct);

        foreach (var channelId in channelIds)
        {
            ct.ThrowIfCancellationRequested();
            await Gatherer.UpdateChannelPosts(
                channelId,
                _loadingHelper,
                _client,
                context,
                _mapper,
                _pobeditSettings
            );
        }
    }

    private async Task ProcessCommentsAsync(CancellationToken ct)
    {
        UpdateState(GatherProcessState.Running, null, null);

        using var scope = _scopeFactory.CreateScope();
        var context = scope.ServiceProvider.GetRequiredService<DataContext>();

        var channels = await context.Channels
            .Include(c => c.Posts)
            .ToListAsync(ct);

        foreach (var channel in channels)
        {
            ct.ThrowIfCancellationRequested();

            foreach (var post in channel.Posts.Where(p => !p.AreCommentsLoaded))
            {
                ct.ThrowIfCancellationRequested();

                await Gatherer.UpdatePostComments(
                    channel.TlgId,
                    post.TlgId,
                    _loadingHelper,
                    _client,
                    context,
                    _mapper,
                    _pobeditSettings
                );

                await Task.Delay(TimeSpan.FromMilliseconds(_random.Next(10000, 20000)), ct);
            }
        }
    }

    private bool ShouldUpdatePosts() =>
    _postLastUpdateTime.AddHours(_pobeditSettings.ChannelPollingFrequency) <= DateTime.UtcNow;

    private bool ShouldUpdateComments() =>
        _commentsLastUpdateTime.AddHours(_pobeditSettings.CommentsPollingDelay) <= DateTime.UtcNow;

    private void UpdateStateTimers()
    {
        lock (_stateLock)
        {
            _gatherState.ToPollingChannelsSecs = ShouldUpdatePosts() ? 0 :
                (int)_postLastUpdateTime.AddHours(_pobeditSettings.ChannelPollingFrequency)
                    .Subtract(DateTime.UtcNow).TotalSeconds;

            _gatherState.ToPollingCommentsSecs = ShouldUpdateComments() ? 0 :
                (int)_commentsLastUpdateTime.AddHours(_pobeditSettings.CommentsPollingDelay)
                    .Subtract(DateTime.UtcNow).TotalSeconds;

            _gatherState.State = GatherProcessState.Paused;
        }
    }

    private void UpdateState(GatherProcessState state, int? channelsSecs, int? commentsSecs)
    {
        lock (_stateLock)
        {
            _gatherState.State = state;
            if (channelsSecs.HasValue) _gatherState.ToPollingChannelsSecs = channelsSecs.Value;
            if (commentsSecs.HasValue) _gatherState.ToPollingCommentsSecs = commentsSecs.Value;
        }
    }

    public async Task<ServiceResponse<bool>> StopGatherAsync()
    {
        await Task.Delay(1);
        _processingCts.Cancel();
        UpdateState(GatherProcessState.Stopped, 0, 0);

        return new ServiceResponse<bool>
        {
            Data = true,
            Success = true
        };
    }

    public ServiceResponse<GatherStateDto> GetGatherState()
    {
        lock (_stateLock)
        {
            return new ServiceResponse<GatherStateDto>
            {
                Data = _mapper.Map<GatherStateDto>(_gatherState),
                Success = true
            };
        }
    }

    public async Task<ServiceResponse<bool>> StartGatherAsync(BackgroundTask task)
    {
        if (task == null)
        {
            return new ServiceResponse<bool>
            {
                Success = false,
                Data = false,
                ErrorType = ErrorType.ServerError
            };
        }

        if (!await InitializeClientAsync())
        {
            return new ServiceResponse<bool>
            {
                Success = false,
                Data = false,
                ErrorType = ErrorType.ServerError
            };
        }

        var state = GetGatherState().Data;
        if (state?.State == GatherProcessState.Running || state?.State == GatherProcessState.Paused)
        {
            return new ServiceResponse<bool>
            {
                Success = false,
                Data = false,
                ErrorType = ErrorType.TooManyRequests
            };
        }

        await _queue.Writer.WriteAsync(task);
        return new ServiceResponse<bool>
        {
            Success = true,
            Data = true
        };
    }

    private async Task<bool> InitializeClientAsync()
    {
        try
        {
            if (_client == null) return false;
            _user ??= await _client.LoginUserIfNeeded();
            return true;
        }
        catch (Exception ex)
        {
            Log.Error(ex, "Failed to initialize client");
            return false;
        }
    }

    public async ValueTask DisposeAsync()
    {
        if (_disposed) return;

        _disposed = true;
        _processingCts.Cancel();
        _processingCts.Dispose();

        if (_client is IAsyncDisposable asyncDisposable)
            await asyncDisposable.DisposeAsync();
        else
            _client?.Dispose();
    }

}
