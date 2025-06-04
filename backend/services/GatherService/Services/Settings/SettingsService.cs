using AutoMapper;
using Gather.Dtos;
using Gather.Models;

namespace Gather.Services;

internal class SettingsService : ISettingsService
{
    ISettingsConfig _settingsConfig;
    private readonly ILogger<SettingsService> _logger;
    private readonly IMapper _mapper;

    public SettingsService(ISettingsConfig settingsConfig, ILogger<SettingsService> logger, IMapper mapper)
    {
        _logger = logger;
        _mapper = mapper;
        _settingsConfig = settingsConfig;
    }

    public ServiceResponse<PobeditSettingsDto> GetSettings()
    {
        var response = new ServiceResponse<PobeditSettingsDto>();
        response.Data = _mapper.Map<PobeditSettingsDto>(_settingsConfig.PobeditSettings);
        return response;
    }

    public ServiceResponse<bool> SaveSettings(PobeditSettingsDto pobeditSettingsDto)
    {
        var response = new ServiceResponse<bool>();
        try
        {
            var pobeditSettings = _mapper.Map<PobeditSettings>(pobeditSettingsDto);
            _settingsConfig.PobeditSettings = pobeditSettings;
            response.Data = true;
        }
        catch (Exception exception)
        {
            _logger.LogError(exception, "SaveSettings");
            response.Success = false;
            response.Message = "An error has occurred while applying new settings." +
                Environment.NewLine +
                exception.Message;
            response.ErrorType = ErrorType.ServerError;
            response.Data = false;
        }
        return response;
    }
}
