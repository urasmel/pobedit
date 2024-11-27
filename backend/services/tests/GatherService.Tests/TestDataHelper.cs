using SharedCore.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Gather.Tests
{
    public class TestDataHelper
    {
        public static List<Channel> GetFakeChannelList()
        {
            return new List<Channel>()
            {
                new Channel
                {
                    Id = 1,
                    User=new User{UserId=1, Password="passOne", PhoneNumber="+71234567123", Username="firstUser"},
                    IsChannel=true,
                    IsGroup=true,
                    MainUsername="Mainer",
                    Title="First channel",
                    Members=new Account[0],
                    About="First about",
                    Image="base64iamge",
                    ParticipantsCount=0
                },
                new Channel
                {
                    Id = 1,
                    User=new User{UserId=2, Password="passtwwo", PhoneNumber="+71231117123", Username="secondUser"},
                    IsChannel=true,
                    IsGroup=true,
                    MainUsername="Seconder",
                    Title="Second channel",
                    Members=new Account[0],
                    About="Second about",
                    Image="base64iamge",
                    ParticipantsCount=0
                }
            };
        }
    }
}
