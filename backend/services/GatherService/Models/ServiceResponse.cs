namespace Gather.Models;

public class ServiceResponse<T>
{
    public T? Data { get; set; }

    public bool Success { get; set; } = true;

    public ErrorType ErrorType { get; set; } = ErrorType.NoError;

    public string Message { get; set; } = string.Empty;
}
