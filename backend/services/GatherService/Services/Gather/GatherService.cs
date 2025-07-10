using AutoMapper;
using Gather.Dtos.Gather;
using Gather.Models;
using Gather.Models.Gather;
using Gather.Services.Gather;
using Gather.Utils.ConfigService;
using System.Threading.Channels;
using TL;

namespace Gather.Services;

//?public class GatherService : BackgroundService
public class GatherService : IGatherService
{
    ILogger _logger;
    WTelegram.Client? _client;
    TL.User? user;
    IConfigUtils _configUtils;
    IMapper _mapper;
    GatherState _gatherState;
    private readonly Channel<BackgroundTask> _queue;
    bool _needClose = false;
    ISettingsService _settingsService;
    DateTime _postLastUpdateTime = DateTime.MinValue;
    DateTime _commentsLastUpdateTime = DateTime.MinValue;

    public GatherService(ISettingsService settingsService, ILogger<GatherService> logger, IMapper mapper, IConfigUtils configUtils)
    {
        _settingsService = settingsService;
        _logger = logger;
        _mapper = mapper;
        _configUtils = configUtils;
        //_client = new WTelegram.Client(_configUtils.Config());
        _gatherState = new GatherState();
        var options = new BoundedChannelOptions(1)
        {
            FullMode = BoundedChannelFullMode.Wait
        };
        _queue = System.Threading.Channels.Channel.CreateBounded<BackgroundTask>(options);
        Init();
        ThreadPool.QueueUserWorkItem(_ => StartGatherAsync());
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

    private async void StartGatherAsync()
    {
        _logger.LogInformation("LongRunningTaskService is starting.");

        try
        {
            while (true)
            {
                if (_queue.Reader.TryRead(out var task))
                {
                    // Переключение обратно после предыдущего выключения задачи сбора.
                    _needClose = false;

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
                        if (_postLastUpdateTime.AddHours(_settingsService.PobeditSettings.ChannelPollingFrequency) <= DateTime.UtcNow)
                        {
                            _logger.LogInformation($"Channels processing started at {DateTime.Now}.");
                            _gatherState.State = GatherProcessState.Running;
                            _postLastUpdateTime = DateTime.UtcNow;
                            // ...
                            _gatherState.State = GatherProcessState.Paused;
                        }
                        else
                        {
                            _gatherState.ToPollingChannelsSecs =
                                (int)_postLastUpdateTime
                                .AddHours(_settingsService.PobeditSettings.ChannelPollingFrequency)
                                .Subtract(DateTime.UtcNow).TotalSeconds;
                        }


                        // Загружаем очень нежно комментарии. Пока грузим - внутри проверяем флаг прекращения загрузки.
                        if (_commentsLastUpdateTime.AddHours(_settingsService.PobeditSettings.CommentsPollingDelay) <= DateTime.UtcNow)
                        {
                            _logger.LogInformation($"Comments processing started at {DateTime.Now}.");
                            _gatherState.State = GatherProcessState.Running;
                            _commentsLastUpdateTime = DateTime.UtcNow;
                            // ...
                            _gatherState.State = GatherProcessState.Paused;
                        }
                        else
                        {
                            _gatherState.ToPollingCommentsSecs =
                                (int)_commentsLastUpdateTime
                                .AddHours(_settingsService.PobeditSettings.CommentsPollingDelay)
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

        if (_gatherState.State == GatherProcessState.Running || _gatherState.State == GatherProcessState.Paused)
        {
            return false;
        }

        await _queue.Writer.WriteAsync(task);
        return true;
    }

}
