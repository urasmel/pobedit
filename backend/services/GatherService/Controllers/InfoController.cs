using GatherMicroservice.Dtos;
using GatherMicroservice.Models;
using GatherMicroservice.Services;
using Microsoft.AspNetCore.Mvc;
using SharedCore.Dtos;
using TL;

namespace GatherMicroservice.Controllers
{
    [ApiController]
    [Route("gather")]
    public class InfoController : ControllerBase
    {
        private readonly IInfoService _infoService;

        public InfoController(IInfoService infoService)
        {
            _infoService = infoService;
        }

        [HttpGet("/users/{username}/chats")]
        public async Task<ActionResult<ServiceResponse<List<ChatBase>>>> GetAllChats(string username)
        {
            var response = await _infoService.GetAllChats(username);
            if (!response.Success)
            {
                return BadRequest(response);
            }

            return Ok(response);
        }

        [HttpGet("/users/{username}/chats/{chatId}/ChatInfo")]
        public async Task<ActionResult<ChatFullInfoDto>> GetChatInfo(int chatId)
        {
            var response = await _infoService.GetChatInfo(chatId);
            if (!response.Success)
            {
                return BadRequest(response);
            }

            return Ok(response);
        }


        [HttpGet("/users/{username}/chats/{chatId}/messages")]
        public async Task<ActionResult<ChatFullInfoDto>> GetChatMessages(int chatId)
        {
            var response = await _infoService.GetChatMessages(chatId);
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