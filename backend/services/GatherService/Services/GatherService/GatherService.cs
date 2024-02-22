﻿using GatherMicroservice.Collecting;
using GatherMicroservice.Dtos;
using GatherMicroservice.Models;
using GatherMicroservice.Utils;
using SharedCore.Extentions;
using Swashbuckle.AspNetCore.SwaggerGen;
using TL;
using TL.Methods;

namespace GatherMicroservice.Services
{
    public class GatherService : IGatherService
    {
        ILogger _logger;
        WTelegram.Client? _client;
        User? user;
        IConfigUtils _configUtils;
        private Dictionary<string, ICollector> _collectors;

        public GatherService(ILogger<GatherService> logger, IConfigUtils configUtils)
        {
            _collectors = new Dictionary<string, ICollector> { };
            _logger = logger;
            _configUtils = configUtils;
            _client = new WTelegram.Client(_configUtils.Config());
            Init();
        }


        private async void Init()
        {
            user = await _client.LoginUserIfNeeded();
        }

        public async Task<ServiceResponse<bool>> StartGatherAllAsync(string username)
        {
            var response = new ServiceResponse<bool>();
            try
            {
                // Получаем пользователя.
                // TODO Сделать позже для разных пользователей, когда их подвезу.
                // Пока работаем с одним полльзователем, который получается из конфига по умолчанию.

                if (_collectors.ContainsKey(username) && await _collectors[username].GetStatus())
                {
                    response.Data = false;
                    response.Success = false;
                    response.Message = $"The '{username}' user's chats are already being collected";
                    return response;
                }

                // Получаем все его чаты.
                var chats = new List<ChatBase>();
                var chatBases = await _client.Messages_GetAllChats();
                foreach (var (id, chat) in chatBases.chats)
                    chats.Add(chat);

                // Запускаем поток сбора.
                if (!_collectors.ContainsKey(username))
                { _collectors.Add(username, new Collector()); }

                _collectors[username].StartGather(chats).Forget();

                response.Data = true;
                response.Success = true;
            }
            catch (Exception exception)
            {
                _logger.LogError(exception.Message, exception);
                response.Data = false;
                response.Success = false;
            }

            return response;
        }

        public async Task<ServiceResponse<bool>> GetGatherStatusAsync(string username)
        {
            var response = new ServiceResponse<bool>();

            if (!_collectors.ContainsKey(username))
            {
                response.Success = false;
                response.Data = false;
                response.Message = "User does not exists";
                return response;
            }

            response.Success = true;
            response.Data = await _collectors[username].GetStatus();
            return response;
        }

        public async Task<ServiceResponse<bool>> StopGatherStatusAsync(string username)
        {
            var response = new ServiceResponse<bool>();

            if (!_collectors.ContainsKey(username))
            {
                response.Success = false;
                response.Data = false;
                response.Message = "User does not exists";
                return response;
            }

            if (await _collectors[username].GetStatus())
            {
                response.Success = false;
                response.Data = false;
                response.Message = "The '{username}' user's chats are not being collected now";
                return response;
            }

            response.Success = true;
            response.Data = await _collectors[username].StopGather();
            return response;
        }
    }
}
