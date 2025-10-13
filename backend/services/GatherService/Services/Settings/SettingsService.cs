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
    private readonly JsonSerializerOptions _serializeOptions;
    private readonly object _lockObject = new object();
    private bool _isInitialized = false;

    public SettingsService(IMapper mapper)
    {
        _mapper = mapper;
        _serializeOptions = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            WriteIndented = true
        };
        Initialize();
    }

    public PobeditSettings PobeditSettings
    {
        get
        {
            if (!_isInitialized)
                throw new InvalidOperationException("Settings not initialized");

            return _pobeditSettings;
        }
    }

    private void Initialize()
    {
        lock (_lockObject)
        {
            try
            {
                if (!File.Exists(_settingsFileName))
                {
                    Log.Warning("Settings file not found, creating default: {File}", _settingsFileName);
                    _pobeditSettings = new PobeditSettings();
                    SaveToFile();
                }
                else
                {
                    var fileText = File.ReadAllText(_settingsFileName);
                    _pobeditSettings = JsonSerializer.Deserialize<PobeditSettings>(fileText, _serializeOptions)
                                     ?? new PobeditSettings();
                }
                _isInitialized = true;
            }
            catch (Exception ex)
            {
                Log.Error(ex, "Error reading settings");
                _pobeditSettings = new PobeditSettings();
                _isInitialized = true;
            }
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
        lock (_lockObject)
        {
            var response = new ServiceResponse<bool>();
            try
            {
                _mapper.Map(pobeditSettingsDto, _pobeditSettings);
                SaveToFile();
                return new ServiceResponse<bool> { Data = true };
            }
            catch (Exception ex)
            {
                Log.Error(ex, "Error saving settings");
                return new ServiceResponse<bool>
                {
                    Success = false,
                    Message = ex.Message,
                    Data = false
                };
            }
        }
    }

    private void SaveToFile()
    {
        var json = JsonSerializer.Serialize(_pobeditSettings, _serializeOptions);
        File.WriteAllText(_settingsFileName, json);
    }
}
