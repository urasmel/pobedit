using GatherMicroservice.Controllers;
using GatherMicroservice.Services;
using SharedCore.Models;
using SharedCore.Dtos.Channel;
using Moq;
using GatherMicroservice.Services.InfoService;
using GatherMicroservice.Client;
using GatherMicroservice.Data;
using AutoMapper;
using Microsoft.Extensions.Logging;
using Microsoft.AspNetCore.Mvc;
using GatherMicroservice.Utils;
using Moq.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace GatherService.Tests
{
    public class InfoServiceTests
    {
        //[Fact]
        //public void GetUser_Returns_OkResult()
        //{
        //    // Arrange
        //    var config = new Mock<IConfigUtils>();
        //    var gatherClient = new GatherClient(config.Object);

        //    var dbContextMock = new Mock<DataContext>();
        //    dbContextMock.Setup<DbSet<Channel>>(x => x.Channels)
        //        .ReturnsDbSet(TestDataHelper.GetFakeChannelList());

        //    var mapper = new Mock<IMapper>();
        //    var logger = new Mock<ILogger<InfoService>>();


        //    var infoService = new InfoService(gatherClient, dbContextMock.Object, mapper.Object, logger.Object);
        //    //infoService.Setup(service => 
        //    //service.GetChannelInfo(It.IsAny<string>(), It.IsAny<int>()))
        //    //    .Returns(new Task<ServiceResponse<ChannelInfoDto>>(() => new ServiceResponse<ChannelInfoDto>
        //    //    { 
        //    //        Success = true, 
        //    //        Message = "", 
        //    //        Data = new ChannelInfoDto 
        //    //        { Id = 1, 
        //    //            About = "About info", 
        //    //            Image = "base64 picture",
        //    //            ParticipantsCount = 11, 
        //    //            Title = "Channel Title" 
        //    //        } 
        //    //    }));

        //    // Act
        //    var result = infoService.GetChannelInfo("firstUser", 1);

        //    // Assert
        //    Assert.IsType<Task<ActionResult<ChannelInfoDto>>>(result);
        //}
    }
}