using Microsoft.AspNetCore.Mvc;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;
using System;
using System.Net.WebSockets;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using GatherMicroservice.Models;
using GatherMicroservice.Dtos;
using GatherMicroservice.Services;
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

        [HttpGet("/{username}/all_chats")]
        public async Task<ActionResult<ServiceResponse<List<ChatBase>>>> GetAllChats(string username)
        {
            var response = await _infoService.GetAllChats(username);
            if (!response.Success)
            {
                return BadRequest(response);
            }

            return Ok(response);
        }

        [HttpGet("/{username}/ChatInfo/{chatId}")]
        public async Task<ActionResult<ChatFullInfoDto>> GetChatInfo(int chatId)
        {
            var response = await _infoService.GetChatInfo(chatId);
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