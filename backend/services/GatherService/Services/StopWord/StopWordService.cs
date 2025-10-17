using AutoMapper;
using Gather.Data;
using Gather.Dtos;
using Gather.Models;
using Microsoft.EntityFrameworkCore;
using Serilog;
using System.Net.WebSockets;
using TL;

namespace Gather.Services;

public class StopWordService(DataContext context, IMapper mapper) : IStopWordService
{
    private readonly IMapper _mapper = mapper;

    private DataContext _context { get; } = context;

    public async Task<ServiceResponse<StopWordDto>> CreateStopWord(CreateStopWordDto stopWordDto)
    {
        var response = new ServiceResponse<StopWordDto>();

        try
        {
            if (_context.StopWords == null)
            {
                Log.Error("DB context with stopwords is null",
                    new
                    {
                        method = "CreateStopWord"
                    }
                );
                response.Success = false;
                response.Message = "Error fetching data from DB";
                response.ErrorType = ErrorType.ServerError;
                response.Data = null;
                return response;
            }

            if (_context.StopWords.Any(item => item.Word.ToLower() == stopWordDto.Word.ToLower()))
            {
                Log.Error("This stopword already exists",
                    new
                    {
                        method = "CreateStopWord"
                    }
                );
                response.Success = false;
                response.Message = "StopWord already exists";
                response.ErrorType = ErrorType.AlreadyExists;
                response.Data = null;
                return response;
            }

            var stopWord = new StopWord
            {
                Word = stopWordDto.Word,
                CreatedAt = DateTime.UtcNow
            };

            // 4. Сохранение в БД
            _context.StopWords.Add(stopWord);
            await _context.SaveChangesAsync();

            // 5. Возврат результата
            var resultDto = _mapper.Map<StopWordDto>(stopWord);
            response.Success = true;
            response.Data = resultDto;
            return response;
        }
        catch (DbUpdateException ex)
        {
            Log.Error(ex, "Database error while creating stopword",
                new
                {
                    method = "CreateStopWord"
                }
            );
            response.Success = false;
            response.ErrorType = ErrorType.ServerError;
            response.Message = "Database error occurred";
            return response;
        }
        catch (Exception ex)
        {
            Log.Error(ex, "An error ocurred while creating stopword",
                new
                {
                    method = "CreateStopWord"
                }
            );
            response.ErrorType = ErrorType.ServerError;
            response.Message = "An error ocurred while creating stopword";
            response.Success = false;
            return response;
        }
    }

    public async Task<ServiceResponse<StopWordDto>> GetStopWord(long id)
    {
        var response = new ServiceResponse<StopWordDto>();

        if (_context.StopWords == null)
        {
            Log.Error("DB context with stopwords is null",
                new
                {
                    method = "GetStopWord"
                }
            );
            response.Success = false;
            response.Data = null;
            response.ErrorType = ErrorType.ServerError;
            response.Message = "Error fetching data from DB";
            return response;
        }

        if (!_context.StopWords.Any(item => item.Id == id))
        {
            response.Success = false;
            response.Data = null;
            response.ErrorType = ErrorType.NotFound;
            response.Message = $"Stopword with id {id} not found";
            return response;
        }

        try
        {
            var stopWord = await _context.StopWords.FirstAsync(item => item.Id == id);
            var stopWordDto = _mapper.Map<StopWordDto>(stopWord);
            response.Success = true;
            response.Data = stopWordDto;
            return response;
        }
        catch (Exception ex)
        {
            Log.Error(ex, "An error ocurred while getting stopword",
                new
                {
                    method = "GetStopWord"
                }
            );
            response.ErrorType = ErrorType.ServerError;
            response.Message = "An error ocurred while getting stopword";
            response.Success = false;
            return response;
        }
    }

    public ServiceResponse<IEnumerable<StopWordDto>> GetStopWords()
    {
        var response = new ServiceResponse<IEnumerable<StopWordDto>>();

        if (_context.StopWords == null)
        {
            Log.Error("DB context with stopwords is null",
                new
                {
                    method = "GetStopWords"
                }
            );
            response.Success = false;
            response.Data = null;
            response.ErrorType = ErrorType.ServerError;
            response.Message = "Error fetching data from DB";
            return response;
        }

        try
        {
            var stopWords = _context.StopWords;
            var stopWordDtos = _mapper.Map<IEnumerable<StopWordDto>>(stopWords);
            response.Success = true;
            response.Data = stopWordDtos;
            return response;
        }
        catch (Exception ex)
        {
            Log.Error(ex, "An error ocurred while getting stopwords",
                new
                {
                    method = "GetStopWords"
                }
            );
            response.ErrorType = ErrorType.ServerError;
            response.Message = "An error ocurred while getting stopwords";
            response.Success = false;
            return response;
        }
    }

    // Присылается стопслово с существующим идентификатором, но уже другим значением слова.
    public async Task<ServiceResponse<StopWordDto>> UpdateStopWord(StopWordDto stopWordDto)
    {
        var response = new ServiceResponse<StopWordDto>();

        try
        {
            if (_context.StopWords == null)
            {
                Log.Error("DB context with stopwords is null",
                    new
                    {
                        method = "UpdateStopWord"
                    }
                );
                response.Success = false;
                response.Message = "Error fetching data from DB";
                response.ErrorType = ErrorType.ServerError;
                response.Data = null;
                return response;
            }

            if (_context.StopWords.Any(item => item.Word.ToLower() == stopWordDto.Word.ToLower()))
            {
                Log.Error("This stopword already exists",
                    new
                    {
                        method = "UpdateStopWord"
                    }
                );
                response.Success = false;
                response.Message = "StopWord already exists";
                response.ErrorType = ErrorType.AlreadyExists;
                response.Data = null;
                return response;
            }

            var stopWord = await _context.StopWords.FirstAsync(item => item.Id == stopWordDto.Id);
            stopWord.Word = stopWordDto.Word;
            stopWord.CreatedAt = DateTime.UtcNow;

            // 4. Сохранение в БД
            await _context.SaveChangesAsync();

            // 5. Возврат результата
            var resultDto = _mapper.Map<StopWordDto>(stopWord);
            response.Success = true;
            response.Data = resultDto;
            return response;
        }
        catch (DbUpdateException ex)
        {
            Log.Error(ex, "Database error while updating stopword",
                new
                {
                    method = "UpdateStopWord"
                }
            );
            response.Success = false;
            response.ErrorType = ErrorType.ServerError;
            response.Message = "Database error occurred";
            return response;
        }
        catch (Exception ex)
        {
            Log.Error(ex, "An error ocurred while updating stopword",
                new
                {
                    method = "UpdateStopWord"
                }
            );
            response.ErrorType = ErrorType.ServerError;
            response.Message = "An error ocurred while updating stopword";
            response.Success = false;
            return response;
        }
    }
    
    public async Task<ServiceResponse<bool>> DeleteStopWord(long id)
    {
        var response = new ServiceResponse<bool>();

        try
        {
            if (_context.StopWords == null)
            {
                Log.Error("DB context with stopwords is null",
                    new
                    {
                        method = "DeleteStopWord"
                    }
                );
                response.Success = false;
                response.Message = "Error fetching data from DB";
                response.ErrorType = ErrorType.ServerError;
                return response;
            }

            var stopWord = await _context.StopWords.FirstOrDefaultAsync(item => item.Id == id);

            if( stopWord == null)
            {
                Log.Error("Deleting stopword not found",
                    new
                    {
                        method = "DeleteStopWord"
                    }
                );
                response.Success = false;
                response.Message = "Stopword not found";
                response.ErrorType = ErrorType.NotFound;
                return response;
            }

            _context.StopWords.Remove(stopWord);

            // 4. Сохранение в БД
            await _context.SaveChangesAsync();

            // 5. Возврат результата
            response.Success = true;
            response.Data = true;
            return response;
        }
        catch (DbUpdateException ex)
        {
            Log.Error(ex, "Database error while deleting stopword",
                new
                {
                    method = "DeleteStopWord"
                }
            );
            response.Success = false;
            response.ErrorType = ErrorType.ServerError;
            response.Message = "Database error occurred";
            return response;
        }
        catch (Exception ex)
        {
            Log.Error(ex, "An error ocurred while deleting stopword",
                new
                {
                    method = "DeleteStopWord"
                }
            );
            response.ErrorType = ErrorType.ServerError;
            response.Message = "An error ocurred while deleting stopword";
            response.Success = false;
            return response;
        }
    }

}
