using GatherMicroservice.Dtos;
using GatherMicroservice.Models;
using GatherMicroservice.Utils;
using TL;
using TL.Methods;

namespace GatherMicroservice.Services.InfoService
{
    public class InfoService : IInfoService
    {
        ILogger _logger;
        WTelegram.Client? _client;
        User? user;
        IConfigUtils _configUtils;

        public InfoService(ILogger<GatherService> logger, IConfigUtils configUtils)
        {
            _logger = logger;
            _configUtils = configUtils;
            _client = new WTelegram.Client(_configUtils.Config());
            Init();
        }

        private async void Init()
        {
            user = await _client.LoginUserIfNeeded();
        }

        public async Task<ServiceResponse<List<ChatBase>>> GetAllChats(string username)
        {
            var response = new ServiceResponse<List<ChatBase>>();

            if (user == null)
            {
                response.Success = false;
                response.Message = "User is not defined";
            }
            else
            {
                var result = new List<ChatBase>();
                _logger.LogDebug($"We are logged-in as {user.username ?? user.first_name + " " + user.last_name} (id {user.id})");

                var chats = await _client.Messages_GetAllChats(); // chats = groups/channels (does not include users dialogs)
                _logger.LogDebug("This user has joined the following:");
                foreach (var (id, chat) in chats.chats)
                    result.Add(chat);
                response.Data = result;
                //switch (chat)
                //{
                //case Chat smallgroup when smallgroup.IsActive:
                //    _logger.LogDebug($"{id}:  Small group: {smallgroup.title} with {smallgroup.participants_count} members");
                //    break;
                //case Channel channel when channel.IsChannel:
                //    _logger.LogDebug($"{id}: Channel {channel.username}: {channel.title}");
                //    break;
                //case Channel group: // no broadcast flag => it's a big group, also called supergroup or megagroup
                //    _logger.LogDebug($"{id}: Group {group.username}: {group.title}");
                //    break;
                //}
            }

            return response;
        }

        public async Task<ServiceResponse<ChatFullInfoDto>> GetChatInfo(long chatId)
        {
            var response = new ServiceResponse<ChatFullInfoDto>();
            if (user == null)
            {
                response.Success = false;
                response.Message = "User is not defined";
            }
            else
            {
                var chats = await _client.Messages_GetAllChats();
                var chat = chats.chats.Where(chat => chat.Key == chatId).FirstOrDefault().Value;

                var chatPeer = chat.ToInputPeer();
                var chatInfo = await _client.GetFullChat(chatPeer);

                ChatFullInfoDto chatFullInfoDto = new ChatFullInfoDto();
                chatFullInfoDto.ParticipantsCount = chatInfo.full_chat.ParticipantsCount;
                chatFullInfoDto.About = chatInfo.full_chat.About;
                
                MemoryStream ms = new MemoryStream(1000000);
                Storage_FileType storage = await _client.DownloadProfilePhotoAsync(chat, ms);
                chatFullInfoDto.ChatPhoto = Convert.ToBase64String(ms.ToArray());
                response.Data = chatFullInfoDto;
            }
            return response;
        }
    }
}
