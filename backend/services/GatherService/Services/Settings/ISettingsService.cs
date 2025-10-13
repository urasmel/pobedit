using Gather.Dtos;
using Gather.Models;

namespace Gather.Services;

public interface ISettingsService
{
    public PobeditSettings PobeditSettings { get; }

    public ServiceResponse<PobeditSettingsDto> GetSettings();

    public ServiceResponse<bool> SaveSettings(PobeditSettingsDto pobeditSettingsDto);
}
