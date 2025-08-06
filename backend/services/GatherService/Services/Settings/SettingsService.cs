using AutoMapper;
using Gather.Dtos;
using Gather.Models;
using Serilog;
using System.Text.Json;

namespace Gather.Services;

internal class SettingsService : ISettingsService
{
    private readonly IMapper _mapper;
    private readonly string _settingsFileName = "pobedit_settings.json";
    private PobeditSettings? _pobeditSettings;
    JsonSerializerOptions serializeOptions;

    public SettingsService(IMapper mapper)
    {
        _mapper = mapper;
        serializeOptions = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            WriteIndented = true
        };
        InitializeAsync();
    }

    public PobeditSettings PobeditSettings
    {
        get
        {
            if (_pobeditSettings == null)
            {
                _pobeditSettings = new PobeditSettings();
            }
            return _pobeditSettings;
        }
        set
        {
            _pobeditSettings = value;
            var json = JsonSerializer.Serialize<PobeditSettings>(_pobeditSettings, serializeOptions);
            File.WriteAllText(_settingsFileName, json);
        }
    }

    private void InitializeAsync()
    {
        try
        {
            if (!File.Exists("pobedit_settings.json"))
            {
                Log.Error("Отсутствует файл настроек приложения: {file}",
                    _settingsFileName,
                    new
                    {
                        method = "InitializeAsync"
                    }
                );

                File.Create(_settingsFileName);
                _pobeditSettings = new PobeditSettings();
                var json = JsonSerializer.Serialize<PobeditSettings>(_pobeditSettings, serializeOptions);
                File.WriteAllTextAsync(_settingsFileName, json);
            }
            else
            {
                var fileText = File.ReadAllText(_settingsFileName);
                _pobeditSettings = JsonSerializer.Deserialize<PobeditSettings>(fileText, serializeOptions);
                if (_pobeditSettings == null)
                {
                    PobeditSettings = new PobeditSettings();
                }
            }
        }
        catch (Exception ex)
        {
            Log.Error(ex, "Ошибка чтения настроек",
                new
                {
                    method = "InitializeAsync"
                }
            );
            PobeditSettings = new PobeditSettings();
        }
    }

    public ServiceResponse<PobeditSettingsDto> GetSettings()
    {
        var response = new ServiceResponse<PobeditSettingsDto>();
        response.Data = _mapper.Map<PobeditSettingsDto>(PobeditSettings);
        return response;
    }

    public ServiceResponse<bool> SaveSettings(PobeditSettingsDto pobeditSettingsDto)
    {
        var response = new ServiceResponse<bool>();
        try
        {
            var pobeditSettings = _mapper.Map<PobeditSettings>(pobeditSettingsDto);
            PobeditSettings = pobeditSettings;
            response.Data = true;
        }
        catch (Exception ex)
        {
            Log.Error(ex, "Error saving settings",
                new
                {
                    method = "SaveSettings"
                }
            );
            response.Success = false;
            response.Message = "An error has occurred while applying new settings" +
                Environment.NewLine +
                ex.Message;
            response.ErrorType = ErrorType.ServerError;
            response.Data = false;
        }
        return response;
    }
}
