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
    public class GatherController : ControllerBase
    {
        private readonly IGatherService _gatherService;

        public GatherController(IGatherService gatherService)
        {
            _gatherService = gatherService;
        }
    }
}
// TODO общие модели и дтошки в проект библиотеки классов
// apiid and apihash хранить в конфиге