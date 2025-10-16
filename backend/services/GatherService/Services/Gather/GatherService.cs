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
using System.Threading.Channels;

namespace Gather.Services;

public class GatherService : IGatherService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private GatherClient _client;
    private IMapper _mapper;
    private PobeditSettings _pobeditSettings;
    private readonly IGatherNotifierFabric _loadingHelperFabric;
    private TL.User? _user;
    private GatherState _gatherState;
    private readonly Channel<BackgroundTask> _queue;
    private bool _disposed;
    private bool _needClose = false;
    private DateTime _postLastUpdateTime = DateTime.MinValue;
    private DateTime _commentsLastUpdateTime = DateTime.MinValue;
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

        if (context == null || context.Channels == null)
        {
            Log.Error("DB context or one of it source is null",
                new
                {
                    method = "ProcessPostsAsync"
                }
            );
            throw new Exception("DB context or one of it source is null");
        }

        // Fix for CS8604: Ensure context.Channels is not null before using it
        var channelIds = await (context.Channels ?? Enumerable.Empty<Models.Channel>().AsQueryable())
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

        if (context == null || context.Channels == null)
        {
            throw new Exception("DB context or one of it source is null");
        }

        var channels = await context.Channels
            .Include(c => c.Posts)
            .ToListAsync(ct);

        foreach (var channel in channels)
        {
            ct.ThrowIfCancellationRequested();

            foreach (var post in channel.Posts.Where(p => !p.AreCommentsLoaded && _pobeditSettings.StartGatherDate < p.Date))
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

                // Пауза, эмулирующая переключение на комментарии другого поста.
                await Task.Delay(TimeSpan.FromMilliseconds(_random.Next(10000, 20000)), ct);
            }
            // Пауза, эмулирующая переключение на другой пост.
            await Task.Delay(TimeSpan.FromMilliseconds(_random.Next(20000, 30000)), ct);
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
