using AutoMapper;
using Gather.Data;
using Gather.Dtos;
using Gather.Models;
using Microsoft.EntityFrameworkCore;
using Serilog;
using System.Text.RegularExpressions;
using System.Threading;

namespace Gather.Services;

public class StopWordService(DataContext context, IMapper mapper) : IStopWordService
{
    private readonly IMapper _mapper = mapper;

    private DataContext _context { get; } = context;

    // Simple in-memory cache of stop-word texts (lowercased). Kept in sync after add/update/delete.
    // Access guarded by _cacheLock to avoid concurrent DB loads.
    private List<string>? _cachedStopWords;
    private readonly SemaphoreSlim _cacheLock = new(initialCount: 1, maxCount: 1);

    private async Task EnsureStopWordsCacheLoadedAsync()
    {
        if (_cachedStopWords != null) return;

        await _cacheLock.WaitAsync();
        try
        {
            if (_cachedStopWords == null)
            {
                if (_context.StopWords == null)
                {
                    _cachedStopWords = new List<string>();
                }
                else
                {
                    _cachedStopWords = await _context.StopWords
                        .Where(sw => !string.IsNullOrWhiteSpace(sw.Word))
                        .Select(sw => sw.Word.Trim().ToLowerInvariant())
                        .ToListAsync();
                }
            }
        }
        finally
        {
            _cacheLock.Release();
        }
    }

    private async Task RefreshStopWordsCacheAsync()
    {
        await _cacheLock.WaitAsync();
        try
        {
            if (_context.StopWords == null)
            {
                _cachedStopWords = new List<string>();
            }
            else
            {
                _cachedStopWords = await _context.StopWords
                    .Where(sw => !string.IsNullOrWhiteSpace(sw.Word))
                    .Select(sw => sw.Word.Trim().ToLowerInvariant())
                    .ToListAsync();
            }
        }
        finally
        {
            _cacheLock.Release();
        }
    }

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

            // Refresh cache so subsequent checks see the new stopword
            await RefreshStopWordsCacheAsync();

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

            if (_context.StopWords.Any(item => item.Word.ToLower() == stopWordDto.Word.ToLower() && item.Id != stopWordDto.Id))
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

            // Refresh cache so subsequent checks use updated data
            await RefreshStopWordsCacheAsync();

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

            if (stopWord == null)
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

            // Refresh cache so subsequent checks don't see deleted word
            await RefreshStopWordsCacheAsync();

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

    /// <summary>
    /// Returns the list of stop words (as stored) that were found in the provided text.
    /// The method uses an in-memory cache of stop words (kept updated on add/update/delete).
    /// Single-word stop words are matched using Unicode-aware tokenization (\p{L}+).
    /// Multi-word stopwords (phrases) are matched using whole-word-ish regex checks to avoid accidental substring matches.
    /// </summary>
    public async Task<ServiceResponse<IEnumerable<string>>> GetStopWordsInText(string text)
    {
        var response = new ServiceResponse<IEnumerable<string>>();

        try
        {
            if (string.IsNullOrWhiteSpace(text))
            {
                response.Success = true;
                response.Data = Array.Empty<string>();
                return response;
            }

            // Ensure cache is loaded
            await EnsureStopWordsCacheLoadedAsync();

            var cached = _cachedStopWords;
            if (cached == null || cached.Count == 0)
            {
                response.Success = true;
                response.Data = Array.Empty<string>();
                return response;
            }

            var found = new HashSet<string>(StringComparer.InvariantCultureIgnoreCase);

            // Partition stopwords into single-token and phrases
            var singleTokens = cached.Where(w => !w.Any(char.IsWhiteSpace)).ToHashSet(StringComparer.InvariantCultureIgnoreCase);
            var phrases = cached.Where(w => w.Any(char.IsWhiteSpace)).ToList();

            // Tokenize input text (Unicode letters)
            var tokenMatches = Regex.Matches(text, @"\p{L}+", RegexOptions.Compiled);
            var tokens = new HashSet<string>(StringComparer.InvariantCultureIgnoreCase);
            foreach (Match m in tokenMatches)
            {
                tokens.Add(m.Value.ToLowerInvariant());
            }

            // Check single-token stopwords via token membership
            foreach (var tok in singleTokens)
            {
                if (tokens.Contains(tok))
                    found.Add(tok);
            }

            // Check phrase stopwords using regex boundaries to avoid substring matches.
            // Use lookarounds to ensure phrase isn't adjacent to letter characters.
            foreach (var phrase in phrases)
            {
                if (string.IsNullOrWhiteSpace(phrase)) continue;

                // Escape phrase for regex, but keep spaces as-is (Regex.Escape will escape them to '\ ')
                var escaped = Regex.Escape(phrase);
                // Use Unicode letter boundaries via lookarounds
                var pattern = $@"(?i)(?<!\p{{L}}){escaped}(?!\p{{L}})";
                var regex = new Regex(pattern, RegexOptions.Compiled | RegexOptions.CultureInvariant);
                if (regex.IsMatch(text))
                {
                    found.Add(phrase);
                }
            }

            response.Success = true;
            response.Data = found;
            return response;
        }
        catch (Exception ex)
        {
            Log.Error(ex, "An error ocurred while checking text for stopwords",
                new
                {
                    method = "TextContainsStopWord"
                }
            );
            response.ErrorType = ErrorType.ServerError;
            response.Message = "An error ocurred while checking stopwords";
            response.Success = false;
            response.Data = Array.Empty<string>();
            return response;
        }
    }

}
