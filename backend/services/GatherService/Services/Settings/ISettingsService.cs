using Gather.Dtos;
using Gather.Models;

namespace Gather.Services.Settings
{
    public interface ISettingsService
    {
        public ServiceResponse<PobeditSettingsDto> GetSettings();

        public Task<ServiceResponse<bool>> SaveSettings(PobeditSettingsDto pobeditSettingsDto);
    }
}
