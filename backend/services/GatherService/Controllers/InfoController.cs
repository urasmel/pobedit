using GatherMicroservice.Dtos;
using GatherMicroservice.Models;
using GatherMicroservice.Services;
using Microsoft.AspNetCore.Mvc;
using SharedCore.Dtos;
using SharedCore.Dtos.Channel;
using SharedCore.Models;
using TL;

namespace GatherMicroservice.Controllers
{
    [ApiController]
    [Route("info")]
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
            var response = await _infoService.UpdateChannels(username);
            if (!response.Success)
            {
                return BadRequest(response);
            }

            return Ok(response);
        }

        /// <summary>
        /// Возвращает информацию о канале пользователя.
        /// </summary>
        /// <param name="username">Имя пользователя, от имени которого работает сессия данного запроса и который подписан на канал</param>
        /// <param name="channelId">ID канала</param>
        [HttpGet("/users/{username}/channels/{channelId}/info")]
        public async Task<ActionResult<ChannelInfoDto>> GetChannelInfo(string username, int channelId)
        {
            var response = await _infoService.GetChannelInfo(username, channelId);
            if (!response.Success)
            {
                return BadRequest(response);
            }

            return Ok(response);
        }

        /// <summary>
        /// Возвращает посты канала, которые есть в БД, по его id.
        /// </summary>
        /// <param name="username">Имя пользователя, от имени которого работает сессия данного запроса и который подписан на канал</param>
        /// <param name="channelId">Идентификатор канала</param>
        /// <param name="offset">Смещение относительно последнего сообщения данного канала, находящегося в базе</param>
        /// <param name="count">Количество записей, которые необходимо вернуть</param>
        //[HttpGet("/users/{username}/channels/{channelId}/messages?offset={offset}&count={count}")]
        [HttpGet("/users/{username}/channels/{channelId}/messages")]
        public async Task<ActionResult<List<PostDto>>> GetAllChannelMessages(string username, int channelId, int offset = 0, int count = 20)
        {
            var response = await _infoService.GetChannelPosts(username, channelId, offset, count);
            if (!response.Success)
            {
                return BadRequest(response);
            }

            return Ok(response);
        }

        /// <summary>
        /// Скачивает в базу данных новые сообщения канала, которые появились после последнего сообщения канала, содержащегося в базе данных.
        /// </summary>
        /// <param name="username">Имя пользователя, от имени которого работает сессия данного запроса и который подписан на канал</param>
        /// <param name="channelId">Идентификатор канала</param>
        [HttpGet("/users/{username}/channels/{channelId}/updated_messages")]
        public async Task<ActionResult<List<PostDto>>> UpdateAndFetchChannelPosts(string username, int channelId)
        {
            var response = await _infoService.DownloadChannelUpdates(username, channelId);
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