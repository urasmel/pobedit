using AutoMapper;
using Gather.Collecting;
using Gather.Dtos.Gather;
using Gather.Models;
using Gather.Models.Gather;
using Gather.Utils.ConfigService;
using TL;

namespace Gather.Services;

public class GatherService : IGatherService
{
    ILogger _logger;

    WTelegram.Client? _client;

    TL.User? user;

    IConfigUtils _configUtils;

    IMapper _mapper;

    GatherState _gatherState;

    private Dictionary<string, ICollector> _collectors;

    public GatherService(ILogger<GatherService> logger, IMapper mapper, IConfigUtils configUtils)
    {
        _logger = logger;
        _mapper = mapper;
        _configUtils = configUtils;
        _collectors = new Dictionary<string, ICollector> { };
        //_client = new WTelegram.Client(_configUtils.Config());
        _gatherState = new GatherState();
        Init();
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

    public async Task<ServiceResponse<bool>> StartGatherAllAsync()
    {
        var response = new ServiceResponse<bool>();
        try
        {
            // Получаем пользователя.
            // TODO Сделать позже для разных пользователей, когда их подвезу.
            // Пока работаем с одним полльзователем, который получается из конфига по умолчанию.

            if (_client == null)
            {
                response.Data = false;
                response.Success = false;
                response.Message = "Server error";
                response.ErrorType = ErrorType.ServerError;
                return response;
            }

            // Получаем все его чаты.
            var chats = new List<ChatBase>();
            var chatBases = await _client.Messages_GetAllChats();
            foreach (var (id, chat) in chatBases.chats)
                chats.Add(chat);

            // Запускаем поток сбора.
            //if (!_collectors.ContainsKey(username))
            //{ _collectors.Add(username, new Collector()); }

            //_collectors[username].StartGather(chats).Forget();

            response.Data = true;
            response.Success = true;
        }
        catch (Exception exception)
        {
            _logger.LogError(exception.Message, exception);
            response.Data = false;
            response.Success = false;
        }

        return response;
    }

    public async Task<ServiceResponse<bool>> StopGatherStatusAsync()
    {
        var response = new ServiceResponse<bool>();

        response.Success = true;
        response.Data = await _collectors[""].StopGather();
        return response;
    }

    public ServiceResponse<GatherStateDto> GetGatherState()
    {
        var response = new ServiceResponse<GatherStateDto>();
        response.Data = _mapper.Map<GatherStateDto>(_gatherState);
        return response;
    }
}
