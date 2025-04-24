using AutoMapper;
using Gather.Data;
using Gather.Dtos;
using Gather.Models;
using Microsoft.EntityFrameworkCore;
using System.Xml.Linq;

namespace Gather.Services.SearchService
{
    public class SearchService : ISearchService
    {
        private readonly IMapper _mapper;
        private readonly DataContext _context;
        private readonly ILogger<SearchService> _logger;

        public SearchService(IMapper mapper, DataContext context, ILogger<SearchService> logger)
        {
            _mapper = mapper;
            _context = context;
            _logger = logger;
        }

        public async Task<ServiceResponse<IEnumerable<object>>> Search(SearchQuery query)
        {
            var response = new ServiceResponse<IEnumerable<object>>();

            if (query.SearchType == SearchType.Posts && _context.Posts == null)
            {
                _logger.Log(LogLevel.Error, "Posts table is null");
                response.Success = false;
                response.Message = "Server error";
                return response;
            }
            else if (query.SearchType == SearchType.Comments && _context.Comments == null)
            {
                _logger.Log(LogLevel.Error, "Comments table is null");
                response.Success = false;
                response.Message = "Server error";
                return response;
            }

            try
            {
                if (query.SearchType == SearchType.Posts)
                {
                    IQueryable<Post> dbQuery = _context.Posts;
                    if (query.StartDate != null)
                    {
                        dbQuery = dbQuery.Where(p => p.Date >= query.StartDate);
                    }
                    if (query.EndDate != null)
                    {
                        dbQuery = dbQuery.Where(p => p.Date <= query.EndDate);
                    }

                    var ids = await dbQuery
                        .Where(p => p.Message.Contains(query.Query))
                        .Skip(query.Offset)
                        .Take(query.Limit)
                        .Select(p => p.Id)
                        .ToListAsync();
                    var postsDtos = ids.Select(id => GetPostById(id));
                    response.Data = postsDtos;
                }
                else if (query.SearchType == SearchType.Comments)
                {

                    IQueryable<Comment> dbQuery = _context.Comments;
                    if (query.StartDate != null)
                    {
                        dbQuery = dbQuery.Where(p => p.Date >= query.StartDate);
                    }
                    if (query.EndDate != null)
                    {
                        dbQuery = dbQuery.Where(p => p.Date <= query.EndDate);
                    }

                    var comments = await dbQuery
                        .Include(comment => comment.From)
                        .Where(c => c.Message.Contains(query.Query))
                        .Skip(query.Offset)
                        .Take(query.Limit)
                        .ToListAsync();
                    var commentsDtos = _mapper.Map<List<CommentDto>>(comments);
                    response.Data = commentsDtos;
                }
                response.Success = true;
                return response;
            }
            catch (Exception ex)
            {
                _logger.Log(LogLevel.Error, ex.Message);
                response.Success = false;
                response.Message = "Server error";
                return response;
            }
        }

        private PostDto GetPostById(long postId)
        {
            var post = _context.Posts.FirstOrDefault(p => p.Id == postId);
            if (post == null)
            {
                return null;
            }
            return _mapper.Map<PostDto>(post);
        }

        private CommentDto GetCommentById(long commentId)
        {
            var comment = _context.Comments.FirstOrDefault(c => c.Id == commentId);
            if (comment == null)
            {
                return null;
            }
            return _mapper.Map<CommentDto>(comment);
        }
    }
}
