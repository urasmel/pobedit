using AutoMapper;
using Gather.Client;
using Gather.Data;
using Gather.Dtos.Gather;
using Gather.Models;
using Gather.Models.Gather;
using Gather.Services.Gather;
using Gather.Utils.Gather;
using Gather.Utils.Gather.Notification;
using Serilog;
using System.Threading.Channels;
using System.Threading.Tasks;

namespace Gather.Services;

public class GatherService : IGatherService
{

    private readonly IServiceScopeFactory _scopeFactory;

    GatherClient _client;
    IMapper _mapper;
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
        ISettingsService settingsService,
        IGatherNotifierFabric loadingHelperFabric,
        IServiceScopeFactory scopeFactory)
    {
        _client = client;
        _mapper = mapper;

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

                    Log.Information($"Processing task {task.Id}: {task.Description}",
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
                            cicleCounter++;
                            Log.Information($"Channels processing started at {DateTime.Now}.");
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
                            Log.Information($"Comments processing started at {DateTime.Now}.",
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
                                        Thread.Sleep(new Random().Next(10000,20000));
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
                            Log.Information($"Gathering is stopping at {DateTime.Now}.",
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
            Log.Warning("Task processing was canceled.",
                new
                {
                    method = "StartGatherAsync"
                }
            );
        }
        catch (Exception ex)
        {
            Log.Error(ex, "Error occurred while gathering.",
                new
                {
                    method = "StartGatherAsync"
                });
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

    public async Task<ServiceResponse<bool>> StartGatherAsync(BackgroundTask task)
    {
        var response = new ServiceResponse<bool>();

        if (task == null)
        {
            response.Success = false;
            response.Data = false;
            response.ErrorType = ErrorType.ServerError;
            return response;
        }

        Init();

        if (_gatherState.State == GatherProcessState.Running || _gatherState.State == GatherProcessState.Paused)
        {
            response.Success = false;
            response.Data = false;
            response.ErrorType = ErrorType.TooManyRequests;
            return response;
        }

        await _queue.Writer.WriteAsync(task);
        response.Success = true;
        response.Data = true;
        return response;
    }

    private async void Init()
    {
        if (_client == null)
        {
            Log.Error("Error to init telegram client. Client is not initialized.",
                new
                {
                    method = "Init"
                }
            );
            return;
        }

        try
        {
            user = await _client.LoginUserIfNeeded();
        }
        catch (Exception)
        {
            Log.Error("Error to login user.",
                new
                {
                    method = "Init"
                }
            );
            System.Environment.Exit(1);
        }
    }

}
