using Microsoft.AspNetCore.Mvc;
using GatherMicroservice.Services;

namespace GatherMicroservice.Controllers
{
    [ApiController]
    [Route("gather")]
    public class GatherController : ControllerBase
    {
        private readonly IGatherService _gatherService;
        private readonly ILogger _logger;

        public GatherController(IGatherService gatherService, ILogger<GatherController> logger)
        {
            _gatherService = gatherService;
            _logger = logger;
        }

        /// <summary>
        /// Запускает процесс сбора информации в БД.
        /// </summary>
        /// <param name="username">username пользователя, посты с подписок которого будут собираться.</param>
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