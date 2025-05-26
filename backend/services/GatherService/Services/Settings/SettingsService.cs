using AutoMapper;
using Gather.Dtos;
using Gather.Models;
using System;
using System.Text.Json;

namespace Gather.Services.Settings
{
    internal class SettingsService : ISettingsService
    {
        private readonly ILogger<SettingsService> _logger;
        private readonly IMapper _mapper;
        private readonly string _settingsFileName = "pobedit_settings.json";
        private PobeditSettings? _pobeditSettings;
        JsonSerializerOptions serializeOptions;

        public SettingsService(ILogger<SettingsService> logger, IMapper mapper)
        {
            _logger = logger;
            _mapper = mapper;
            serializeOptions = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                WriteIndented = true
            };
            InitializeAsync();
        }


        private void InitializeAsync()
        {
            try
            {
                if (!File.Exists("pobedit_settings.json"))
                {
                    _logger.LogError($"Отсутствует файл настроек приложения '{_settingsFileName}'");
                    File.Create(_settingsFileName);
                }
                var fileText = File.ReadAllText(_settingsFileName);
                _pobeditSettings = JsonSerializer.Deserialize<PobeditSettings>(fileText, serializeOptions);
            }
            catch (Exception exception)
            {
                _logger.LogError($"Ошибка чтения настроек: ${exception.Message}");
                _pobeditSettings = new PobeditSettings();
            }
        }

        public ServiceResponse<PobeditSettingsDto> GetSettings()
        {
            var response = new ServiceResponse<PobeditSettingsDto>();
            response.Data = _mapper.Map<PobeditSettingsDto>(_pobeditSettings);
            return response;
        }

        public async Task<ServiceResponse<bool>> SaveSettings(PobeditSettingsDto pobeditSettingsDto)
        {
            var response = new ServiceResponse<bool>();
            try
            {
                _pobeditSettings = _mapper.Map<PobeditSettings>(pobeditSettingsDto);
                var json = JsonSerializer.Serialize<PobeditSettings>(_pobeditSettings, serializeOptions);
                await File.WriteAllTextAsync(_settingsFileName, json);
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
}
