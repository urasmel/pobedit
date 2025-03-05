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
                    MainUsername="Mainer",
                    Title="First channel",
                    Subscribers=new List<Account>(),
                    About="First about",
                    Image="base64iamge",
                    ParticipantsCount=0
                },
                new Channel
                {
                    Id = 1,
                    MainUsername="Seconder",
                    Title="Second channel",
                    Subscribers=new List<Account>(),
                    About="Second about",
                    Image="base64iamge",
                    ParticipantsCount=0
                }
            };
        }
    }
}
