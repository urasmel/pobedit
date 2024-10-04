using ControlService.Controllers;
using ControlService.Services.UserService;
using Microsoft.AspNetCore.Mvc;
using Moq;
using SharedCore.Dtos.User;
using SharedCore.Models;

namespace ControlService.Tests
{
    public class UserControllerTests
    {
        [Fact]
        public void GetUser_Returns_OkResult()
        {
            // Arrange
            var userServiceMock = new Mock<IUserService>();
            var controller = new UsersController(userServiceMock.Object);

            // Act
            var result = controller.GetSingle(1);

            // Assert
            Assert.IsType<Task<ActionResult<ServiceResponse<GetUserDto>>>>(result);
        }
    }
}