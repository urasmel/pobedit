using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace ControlMicroservice.Filtering
{
    public class IdNumberFilter : IActionFilter
    {
        public void OnActionExecuted(ActionExecutedContext context)
        {
            var action = context.RouteData.Values["action"];
            var controller = context.RouteData.Values["controller"];

            var param = context.RouteData;

            if (!param.Values.ContainsKey("id"))
            {
                context.Result = (context.Controller as ControllerBase).ValidationProblem("The account ID is missing");
                return;
            }

            if (param.Values.ContainsKey("id") && !int.TryParse(param.Values["id"].ToString(), out int _))
            {
                var problemDetails = new ValidationProblemDetails();
                problemDetails.Status = 400;
                problemDetails.Title = "Parameter type validation error occurred.";
                problemDetails.Detail = "The account ID must be a number";
                context.Result = (context.Controller as ControllerBase).ValidationProblem(problemDetails);
                return;
            }
        }

        public void OnActionExecuting(ActionExecutingContext context)
        {
        }
    }
}
