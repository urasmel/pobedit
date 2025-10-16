using Asp.Versioning;
using Gather.Dtos;
using Gather.Models;
using Gather.Services;
using Microsoft.AspNetCore.Mvc;
using Serilog;

namespace Gather.Controllers
{
    [ApiController]
    [Produces("application/json")]
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiVersion("1.0")]
    public class StopWordsController(IStopWordService stopWordService, RequestMetrics metrics) : ControllerBase
    {
        private readonly IStopWordService _stopWordService = stopWordService;

        private readonly RequestMetrics _metrics = metrics;

        [HttpPost]
        [MapToApiVersion(1.0)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        public async Task<ActionResult<ServiceResponse<StopWordDto>>> Create([FromBody] string word)
        {
            var stopwatch = System.Diagnostics.Stopwatch.StartNew();

            try
            {
                Log.Information("Create stopWord requested at {Time}",
                    DateTime.Now,
                    new
                    {
                        method = "Create"
                    }
                );

                var response = await _stopWordService.CreateStopWord(word);

                if (response.ErrorType == ErrorType.AlreadyExists)
                {
                    return StatusCode(StatusCodes.Status409Conflict, response);
                }
                else if (response.ErrorType == ErrorType.ServerError)
                {
                    return StatusCode(StatusCodes.Status500InternalServerError, response);
                }
                else if (!response.Success)
                {
                    Log.Information($"Unsupported stopWordService error type {response.ErrorType}",
                        DateTime.Now,
                        new
                        {
                            method = "Create"
                        }
                    );
                    throw new Exception("Unknown type of stopWordService error type");
                }
                return Ok(response);
            }
            finally
            {
                stopwatch.Stop();
                _metrics.RecordRequest(Request.Path, stopwatch.Elapsed.TotalSeconds);
            }
        }

        [HttpPut]
        [MapToApiVersion(1.0)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        public async Task<ActionResult<ServiceResponse<StopWordDto>>> Update([FromBody] StopWordDto stopWordDto)
        {
            var stopwatch = System.Diagnostics.Stopwatch.StartNew();

            try
            {
                Log.Information("Create stopWord requested at {Time}",
                    DateTime.Now,
                    new
                    {
                        method = "Update"
                    }
                );

                var response = await _stopWordService.UpdateStopWord(stopWordDto);
                if (response.ErrorType == ErrorType.AlreadyExists)
                {
                    return StatusCode(StatusCodes.Status409Conflict, response);
                }
                else if (response.ErrorType == ErrorType.ServerError)
                {
                    return StatusCode(StatusCodes.Status500InternalServerError, response);
                }
                else if (!response.Success)
                {
                    Log.Information($"Unsupported stopWordService error type {response.ErrorType}",
                        DateTime.Now,
                        new
                        {
                            method = "Update"
                        }
                    );
                    throw new Exception("Unknown type of stopWordService error type");
                }
                return Ok(response);
            }
            finally
            {
                stopwatch.Stop();
                _metrics.RecordRequest(Request.Path, stopwatch.Elapsed.TotalSeconds);
            }
        }

        [HttpDelete]
        [MapToApiVersion(1.0)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ServiceResponse<bool>>> Delete([FromBody] long id)
        {
            var stopwatch = System.Diagnostics.Stopwatch.StartNew();

            try
            {
                Log.Information("Create stopWord requested at {Time}",
                    DateTime.Now,
                    new
                    {
                        method = "Delete"
                    }
                );

                var response = await _stopWordService.DeleteStopWord(id);

                if (response.ErrorType == ErrorType.NotFound)
                {
                    return StatusCode(StatusCodes.Status404NotFound, response);
                }
                else if (response.ErrorType == ErrorType.ServerError)
                {
                    return StatusCode(StatusCodes.Status500InternalServerError, response);
                }
                else if (!response.Success)
                {
                    Log.Information($"Unsupported stopWordService error type {response.ErrorType}",
                        DateTime.Now,
                        new
                        {
                            method = "Delete"
                        }
                    );
                    throw new Exception("Unknown type of stopWordService error type");
                }
                return Ok(response);
            }
            finally
            {
                stopwatch.Stop();
                _metrics.RecordRequest(Request.Path, stopwatch.Elapsed.TotalSeconds);
            }
        }

        [HttpGet("{id}")]
        [MapToApiVersion(1.0)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<ServiceResponse<StopWordDto>>> GetSingle([FromRoute] long id)
        {
            var stopwatch = System.Diagnostics.Stopwatch.StartNew();

            try
            {
                Log.Information("Single stopWord requested at {Time}",
                    DateTime.Now,
                    new
                    {
                        method = "GetSingle"
                    }
                );

                var response = await _stopWordService.GetStopWord(id);
                if (response.ErrorType == ErrorType.NotFound)
                {
                    return NotFound(response);
                }
                else if (!response.Success)
                {
                    return StatusCode(StatusCodes.Status500InternalServerError, response);
                }
                return Ok(response);
            }
            finally
            {
                stopwatch.Stop();
                _metrics.RecordRequest(Request.Path, stopwatch.Elapsed.TotalSeconds);
            }
        }


        [HttpGet]
        [MapToApiVersion(1.0)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public ActionResult<ServiceResponse<StopWordDto>> GetAll()
        {
            var stopwatch = System.Diagnostics.Stopwatch.StartNew();

            try
            {
                Log.Information("All stopWords requested at {Time}",
                    DateTime.Now,
                    new
                    {
                        method = "GetAll"
                    }
                );

                var response = _stopWordService.GetStopWords();
                if (!response.Success)
                {
                    return StatusCode(StatusCodes.Status500InternalServerError, response);
                }
                return Ok(response);
            }
            finally
            {
                stopwatch.Stop();
                _metrics.RecordRequest(Request.Path, stopwatch.Elapsed.TotalSeconds);
            }
        }
    }
}
