using Gather.Dtos;
using Gather.Models;

namespace Gather.Services;

public interface ISettingsService
{
    public ServiceResponse<PobeditSettingsDto> GetSettings();

    public ServiceResponse<bool> SaveSettings(PobeditSettingsDto pobeditSettingsDto);
}
