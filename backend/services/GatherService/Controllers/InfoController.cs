using GatherMicroservice.Dtos;
using GatherMicroservice.Models;
using GatherMicroservice.Services;
using Microsoft.AspNetCore.Mvc;
using SharedCore.Dtos.Channel;
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

        /// <summary>
        /// Возвращает каналы пользователя по его username, которые есть в БД.
        /// </summary>
        /// <param name="username">username пользователя</param>
        [HttpGet("/users/{username}/channels")]
        public async Task<ActionResult<ServiceResponse<List<ChatBase>>>> GetAllChannels(string username)
        {
            var response = await _infoService.GetAllChannels(username);
            if (!response.Success)
            {
                return BadRequest(response);
            }

            return Ok(response);
        }

        /// <summary>
        /// Возвращает каналы пользователя по его username, запрашивая API телеграмма, одновляет их в БД и возвращает в ответе запроса.
        /// </summary>
        /// <param name="username">username пользователя</param>
        [HttpGet("/users/{username}/updated_channels")]
        public async Task<ActionResult<ServiceResponse<List<ChatBase>>>> GetAllUpdatedChannels(string username)
        {
            var response = await _infoService.GetAllUpdatedChannels(username);
            if (!response.Success)
            {
                return BadRequest(response);
            }

            return Ok(response);
        }

        /// <summary>
        /// Возвращает информацию о канале пользователя.
        /// </summary>
        /// <param name="channelId">ID канала</param>
        [HttpGet("/users/{username}/channels/{channelId}/ChannelInfo")]
        public async Task<ActionResult<ChannelFullInfoDto>> GetChannelInfo(int channelId)
        {
            var response = await _infoService.GetChannelInfo(channelId);
            if (!response.Success)
            {
                return BadRequest(response);
            }

            return Ok(response);
        }

        [HttpGet("/users/{username}/channels/{channelId}/messages")]
        public async Task<ActionResult<ChannelFullInfoDto>> GetChannelMessages(int channelId)
        {
            var response = await _infoService.GetChannelPosts(channelId);
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