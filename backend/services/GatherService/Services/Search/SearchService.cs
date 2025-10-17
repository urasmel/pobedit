using AutoMapper;
using Gather.Data;
using Gather.Dtos;
using Gather.Dtos.Comments;
using Gather.Dtos.Posts;
using Gather.Models;
using Microsoft.EntityFrameworkCore;
using Serilog;

namespace Gather.Services.Search;

public class SearchService : ISearchService
{
    private readonly IMapper _mapper;
    private readonly DataContext _context;

    public SearchService(IMapper mapper, DataContext context)
    {
        _mapper = mapper;
        _context = context;
    }

    public async Task<ServiceResponse<object>> Search(SearchQuery query)
    {
        var response = new ServiceResponse<object>();

        if (_context == null || _context.Posts == null || _context.Comments == null)
        {
            Log.Error("DB context or one of it source is null",
                new
                {
                    method = "Search"
                }
            );
            response.Success = false;
            response.Message = "Server error";
            response.ErrorType = ErrorType.ServerError;
            return response;
        }

        try
        {
            if (query.SearchType == SearchType.Posts)
            {
                IQueryable<Post> dbQuery = _context.Posts.AsNoTracking();
                if (query.StartDate != null)
                {
                    dbQuery = dbQuery.Where(p => p.Date >= query.StartDate);
                }
                if (query.EndDate != null)
                {
                    dbQuery = dbQuery.Where(p => p.Date <= query.EndDate);
                }

                dbQuery = dbQuery.Where(p => p.Message.Contains(query.Query));
                int totalCount = dbQuery.Count();

                var ids = await dbQuery
                    .Skip(query.Offset)
                    .Take(query.Limit)
                    .ToListAsync();

                response.Data = new SearchResultPostsDto()
                {
                    TotalCount = totalCount,
                    Data = _mapper.Map<List<PostDto>>(ids)
                };
            }
            else if (query.SearchType == SearchType.Comments)
            {

                IQueryable<Comment> dbQuery = _context.Comments.AsNoTracking();
                if (query.StartDate != null)
                {
                    dbQuery = dbQuery.Where(p => p.Date >= query.StartDate);
                }
                if (query.EndDate != null)
                {
                    dbQuery = dbQuery.Where(p => p.Date <= query.EndDate);
                }

                dbQuery = dbQuery.Where(c => c.Message.Contains(query.Query));
                int totalCount = dbQuery.Count();

                var comments = await dbQuery
                    .Skip(query.Offset)
                    .Take(query.Limit)
                    .Include(c => c.Post)
                    .Include(comment => comment.From)
                    .ToListAsync();
                var commentsDtos = _mapper.Map<List<CommentDto>>(comments);
                response.Data = new SearchResultCommentsDto()
                {
                    TotalCount = totalCount,
                    Data = commentsDtos
                };
            }
            response.Success = true;
            return response;
        }
        catch (Exception ex)
        {
            Log.Error(ex.Message);
            Log.Error(ex, "Error searching",
                new
                {
                    method = "Search"
                }
            );
            response.Success = false;
            response.Message = "Server error";
            response.ErrorType = ErrorType.ServerError;
            return response;
        }
    }

    //private async Task<PostDto?> GetPostByIdAsync(long postId)
    //{
    //    if (_context == null || _context.Posts == null)
    //    {
    //        Log.Error("DB context or one of it source is null",
    //            new
    //            {
    //                method = "GetPostById"
    //            }
    //        );
    //        throw new Exception("DB context or one of it source is null");
    //    }

    //    var post = await _context.Posts.FirstOrDefaultAsync(p => p.PostId == postId);
    //    if (post == null)
    //    {
    //        return null;
    //    }
    //    return _mapper.Map<PostDto>(post);
    //}

    //private CommentDto GetCommentById(long commentId)
    //{
    //    var comment = _context.Comments.FirstOrDefault(c => c.Id == commentId);
    //    if (comment == null)
    //    {
    //        return null;
    //    }
    //    return _mapper.Map<CommentDto>(comment);
    //}
}
