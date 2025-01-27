using AutoMapper;
using SharedCore.Dtos;
using SharedCore.Dtos.Channel;
using SharedCore.Dtos.User;
using SharedCore.Models;
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

        CreateMap<SharedCore.Models.User, GetUserDto>();
        CreateMap<SharedCore.Models.Channel, ChatBase>();
        CreateMap<SharedCore.Models.Channel, InputPeer>();
        CreateMap<TL.Channel, SharedCore.Models.Channel>().ConvertUsing(new TlgChannelConverter());
        CreateMap<SharedCore.Models.Channel, ChannelDto>();

        CreateMap<Comment, CommentDto>();
        CreateMap<MessageBase, Comment>().ConvertUsing(new TlgMessageBaseConverter());
        CreateMap<Message, Comment>().ConvertUsing(new TlgMessageConverter());
    }
    public class TlgChannelConverter : ITypeConverter<TL.Channel, SharedCore.Models.Channel>
    {
        public SharedCore.Models.Channel Convert(TL.Channel source, SharedCore.Models.Channel destination, ResolutionContext context)
        {
            var channel = new SharedCore.Models.Channel();
            channel.TlgId = source.ID;
            channel.MainUsername = source.MainUsername;
            channel.Title = source.Title;
            channel.ParticipantsCount = source.participants_count;
            return channel;
        }
    }

    public class TlgPostConverter : ITypeConverter<TL.Message, Post>
    {
        public SharedCore.Models.Post Convert(TL.Message source, Post destination, ResolutionContext context)
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
            account.isBot = source.IsBot;
            account.Phone = source.phone;
            return account;
        }
    }
}
