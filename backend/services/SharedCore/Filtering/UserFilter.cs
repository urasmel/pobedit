using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc;

namespace SharedCore.Filtering
{
    public class UserFilter : IActionFilter
    {
        public void OnActionExecuted(ActionExecutedContext context)
        {
            var action = context.RouteData.Values["action"];
            var controller = context.RouteData.Values["controller"];

            var param = context.RouteData;

            //if (param.Values.ContainsKey("user"))
            //{
            //    var errorDict = new Dictionary<string, string[]>();
            //    errorDict["user"] = new string[] { "The user is missing" };
            //    var problems = new ValidationProblemDetails(errorDict);
            //    context.Result = (context.Controller as ControllerBase).ValidationProblem(problems);
            //    return;
            //}

            //if (param.Values.ContainsKey("user") && !Char.IsLetter(param.Values["user"].ToString()[0]))
            //{
            //    var problemDetails = new ValidationProblemDetails();
            //    problemDetails.Status = 400;
            //    problemDetails.Title = "Parameter type validation error occurred.";
            //    problemDetails.Detail = "The user's name must start with a letter";
            //    context.Result = (context.Controller as ControllerBase).ValidationProblem(problemDetails);
            //    return;
            //}
        }

        public void OnActionExecuting(ActionExecutingContext context)
        {
        }
    }
}
