using Microsoft.AspNetCore.Mvc;
using Gather.Services;
using Asp.Versioning;

namespace Gather.Controllers
{
    [ApiVersion(1)]
    [ApiController]
    [Produces("application/json")]
    [Route("api/v{v:apiVersion}/[controller]")]
    public class GatherController : ControllerBase
    {
        private readonly IGatherService _gatherService;

        public GatherController(IGatherService gatherService)
        {
            _gatherService = gatherService;
        }

        /// <summary>
        /// Запускает процесс сбора информации в БД.
        /// </summary>
        /// <param name="username">username пользователя, посты с подписок которого будут собираться.</param>
        [MapToApiVersion(1)]
        [HttpPut("/users/{username}/gatherall")]
        public async Task<ActionResult<bool>> StartGatherAll(string username)
        {
            var response = await _gatherService.StartGatherAllAsync(username);
            if (!response.Success)
            {
                return BadRequest(response);
            }

            return Ok(response);
        }


        /// <summary>
        /// Возвращает статус процесса сбора информации в БД.
        /// </summary>
        /// <param name="username">username пользователя, посты с подписок которого собираются.</param>
        [MapToApiVersion(1)]
        [HttpGet("/users/{username}/gather_status")]
        public async Task<ActionResult<bool>> GetGatherStatus(string username)
        {
            var response = await _gatherService.StartGatherAllAsync(username);
            if (!response.Success)
            {
                return BadRequest(response);
            }

            return Ok(response);
        }
    }

}
// TODO общие модели и дтошки в проект библиотеки классов
// apiid and apihash хранить в конфиге