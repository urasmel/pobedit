using AutoMapper;
using Gather.Dtos;
using Gather.Models;
using TL;

namespace Gather;

public class AutoMapperProfile : Profile
{
    public AutoMapperProfile()
    {
        CreateMap<Message, PostDto>();
        CreateMap<Message, Post>().ConvertUsing(new TlgPostConverter());
        CreateMap<Post, PostDto>();

        CreateMap<TL.User, GetUserDto>();
        CreateMap<TL.User, Account>().ConvertUsing(new TlgAccountConverter());

        CreateMap<Models.User, GetUserDto>();
        CreateMap<Models.Channel, ChatBase>();
        CreateMap<Models.Channel, InputPeer>();
        CreateMap<TL.Channel, Models.Channel>().ConvertUsing(new TlgChannelConverter());
        CreateMap<Models.Channel, ChannelDto>();

        CreateMap<Comment, CommentDto>();
        CreateMap<MessageBase, Comment>().ConvertUsing(new TlgMessageBaseConverter());
        CreateMap<Message, Comment>().ConvertUsing(new TlgMessageConverter());


        CreateMap<Models.Account, AccountDto>();
    }

    public class TlgChannelConverter : ITypeConverter<TL.Channel, Models.Channel>
    {
        public Models.Channel Convert(TL.Channel source, Models.Channel destination, ResolutionContext context)
        {
            var channel = new Models.Channel();
            channel.TlgId = source.ID;
            channel.MainUsername = source.MainUsername;
            channel.Title = source.Title;
            channel.ParticipantsCount = source.participants_count;
            return channel;
        }
    }

    public class TlgPostConverter : ITypeConverter<TL.Message, Post>
    {
        public Post Convert(TL.Message source, Post destination, ResolutionContext context)
        {
            var post = new Post();
            post.TlgId = source.ID;
            post.Message = source.message;
            post.PeerId = source.Peer.ID;
            post.Date = source.Date;
            return post;
        }
    }

    public class TlgMessageBaseConverter : ITypeConverter<TL.MessageBase, Comment>
    {
        public Comment Convert(TL.MessageBase source, Comment destination, ResolutionContext context)
        {
            if (source is TL.Message src)
            {
                var comment = new Comment();
                comment.Message = src.message;
                comment.Date = src.Date;
                comment.TlgId = src.id;
                return comment;
            }

            return null;
        }
    }

    public class TlgMessageConverter : ITypeConverter<TL.Message, Comment>
    {
        public Comment Convert(TL.Message source, Comment destination, ResolutionContext context)
        {
            var comment = new Comment();
            comment.Message = source.message;
            comment.Date = source.Date;
            comment.TlgId = source.id;
            return comment;
        }
    }

    public class TlgAccountConverter : ITypeConverter<TL.User, Account>
    {
        public Account Convert(TL.User source, Account destination, ResolutionContext context)
        {
            var account = new Account();
            account.TlgId = source.ID;
            account.MainUsername = source.MainUsername;
            account.FirstName = source.first_name;
            account.LastName = source.last_name;
            account.Username = source.username;
            account.IsBot = source.IsBot;
            account.Phone = source.phone;
            return account;
        }
    }
}
