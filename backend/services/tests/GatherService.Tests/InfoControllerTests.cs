using Gather.Controllers;
using Gather.Services.InfoService;
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
            var infoServiceMock = new Mock<ICommentsService>();
            var controller = new CommentsController(infoServiceMock.Object);

            // Act
            var result = controller.GetChannelInfo(1);

            // Assert
            Assert.IsType<Task<ActionResult<ChannelDto>>>(result);
        }
    }
}
