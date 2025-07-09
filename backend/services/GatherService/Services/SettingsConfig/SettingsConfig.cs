using Gather.Models;
using System.Text.Json;

namespace Gather.Services;

public class SettingsConfig : ISettingsConfig
{
    private readonly ILogger<SettingsConfig> _logger;
    private readonly string _settingsFileName = "pobedit_settings.json";
    private PobeditSettings? _pobeditSettings;
    JsonSerializerOptions serializeOptions;

    public SettingsConfig(ILogger<SettingsConfig> logger)
    {
        _logger = logger;
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
                _logger.LogError($"Отсутствует файл настроек приложения '{_settingsFileName}'");
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
        catch (Exception exception)
        {
            _logger.LogError($"Ошибка чтения настроек: ${exception.Message}");
            PobeditSettings = new PobeditSettings();
        }
    }
}
