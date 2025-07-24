using AutoMapper;
using Gather.Client;
using Gather.Data;
using Gather.Dtos.Gather;
using Gather.Models;
using Gather.Models.Gather;
using Gather.Services.Gather;
using Gather.Utils.Gather;
using Gather.Utils.Gather.Notification;
using System.Threading.Channels;

namespace Gather.Services;

public class GatherService : IGatherService
{

    private readonly IServiceScopeFactory _scopeFactory;

    GatherClient _client;
    IMapper _mapper;
    ILogger _logger;
    PobeditSettings _pobeditSettings;
    readonly IGatherNotifierFabric _loadingHelperFabric;
    TL.User? user;
    GatherState _gatherState;
    private readonly Channel<BackgroundTask> _queue;
    bool _needClose = false;
    DateTime _postLastUpdateTime = DateTime.MinValue;
    DateTime _commentsLastUpdateTime = DateTime.MinValue;
    IGatherNotifier _loadingHelper;

    public GatherService(
        GatherClient client,
        IMapper mapper,
        ILogger<GatherService> logger,
        ISettingsService settingsService,
        IGatherNotifierFabric loadingHelperFabric,
        IServiceScopeFactory scopeFactory)
    {
        _client = client;
        _mapper = mapper;
        _logger = logger;

        _pobeditSettings = settingsService.PobeditSettings;
        _loadingHelperFabric = loadingHelperFabric;
        _gatherState = new GatherState();
        var options = new BoundedChannelOptions(1)
        {
            FullMode = BoundedChannelFullMode.Wait
        };
        _queue = System.Threading.Channels.Channel.CreateBounded<BackgroundTask>(options);
        ThreadPool.QueueUserWorkItem(_ => StartGatherAsync());
        _loadingHelper = loadingHelperFabric.Create();
        _scopeFactory = scopeFactory;
    }

    private async void StartGatherAsync()
    {
        _logger.LogInformation("LongRunningTaskService is starting.");

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

                    _logger.LogInformation("Processing task {TaskId}: {Description}", task.Id, task.Description);
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
                            cicleCounter++;
                            _logger.LogInformation($"Channels processing started at {DateTime.Now}.");
                            _gatherState.State = GatherProcessState.Running;

                            #region Posts loading.

                            using (var scope = _scopeFactory.CreateScope())
                            {
                                var context = scope.ServiceProvider.GetRequiredService<DataContext>();
                                var channelsIds = context.Channels.Select(c => c.TlgId).ToList();
                                foreach (var channelId in channelsIds)
                                {
                                    await Gatherer.UpdateChannelPosts(channelId, _loadingHelper, _client, context, _mapper, _pobeditSettings, _logger);
                                    if (_needClose)
                                    {
                                        _gatherState.State = GatherProcessState.Stopped;

                                        // Останавливаем foreach. Потом проверим еще раз и выйдем из вложенного while.
                                        break;
                                    }
                                }
                            }

                            if (_needClose)
                            {
                                _gatherState.State = GatherProcessState.Stopped;
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
                            _logger.LogInformation($"Comments processing started at {DateTime.Now}.");
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
                                        await Gatherer.UpdatePostComments(channel.TlgId, post.TlgId, _loadingHelper, _client, context, _mapper, _pobeditSettings, _logger);
                                    }

                                    if (_needClose)
                                    {
                                        _gatherState.State = GatherProcessState.Stopped;

                                        // Останавливаем foreach. Потом проверим еще раз и выйдем из вложенного while.
                                        break;
                                    }

                                    // Нежно качаем.
                                    Thread.Sleep(10000);
                                }
                            }

                            if (_needClose)
                            {
                                _gatherState.State = GatherProcessState.Stopped;
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
                            _logger.LogInformation("LongRunningTaskService is stopped.");
                            _gatherState.State = GatherProcessState.Stopped;
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
            _logger.LogWarning("Task processing was canceled.");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error occurred while processing task.");
        }
    }

    public ServiceResponse<bool> StopGatherAsync()
    {
        _needClose = true;
        var response = new ServiceResponse<bool>();
        int counter = 0;
        while (_gatherState.State != GatherProcessState.Stopped)
        {
            if (counter == 10)
            {
                response.Data = false;
                response.Success = false;
                response.Message = "The service did not stop in the expected time";
                return response;
            }
            Thread.Sleep(1000);
            counter++;
        }
        response.Data = true;
        response.Success = true;
        return response;
    }

    public ServiceResponse<GatherStateDto> GetGatherState()
    {
        var response = new ServiceResponse<GatherStateDto>();
        response.Data = _mapper.Map<GatherStateDto>(_gatherState);
        return response;
    }

    public async Task<bool> StartGatherAsync(BackgroundTask task)
    {
        if (task == null)
            throw new ArgumentNullException(nameof(task));

        Init();

        if (_gatherState.State == GatherProcessState.Running || _gatherState.State == GatherProcessState.Paused)
        {
            return false;
        }

        await _queue.Writer.WriteAsync(task);
        return true;
    }

    private async void Init()
    {
        if (_client == null)
        {
            _logger.LogError("Error to init telegram client. Client is not initialized.");
            return;
        }

        try
        {
            user = await _client.LoginUserIfNeeded();
        }
        catch (Exception)
        {
            _logger.LogError("Error to login user.");
            System.Environment.Exit(1);
        }
    }

}
