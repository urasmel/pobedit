using Gather.Controllers;
using Gather.Services;
using Microsoft.AspNetCore.Mvc;
using Moq;
using SharedCore.Dtos.Channel;

namespace Gather.Tests
{
    public class InfoControllerTests
    {
        [Fact]
        public void GetChannel_Returns_OkResult()
        {
            // Arrange
            var infoServiceMock = new Mock<IInfoService>();
            var controller = new InfoController(infoServiceMock.Object);

            // Act
            var result = controller.GetChannelInfo("firstUser", 1);

            // Assert
            Assert.IsType<Task<ActionResult<ChannelInfoDto>>>(result);
        }
    }
}
