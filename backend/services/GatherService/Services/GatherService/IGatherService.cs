﻿using GatherMicroservice.Models;
using SharedCore.Models;

namespace GatherMicroservice.Services
{
    public interface IGatherService
    {
        Task<ServiceResponse<bool>> StartGatherAllAsync(string username);
        Task<ServiceResponse<bool>> GetGatherStatusAsync(string username);
        Task<ServiceResponse<bool>> StopGatherStatusAsync(string username);
    }
}
