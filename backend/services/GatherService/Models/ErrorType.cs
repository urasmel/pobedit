namespace Gather.Models;

public enum ErrorType
{
    NoError,
    NotFound,
    ServerError,
    MalFormedData,
    AlreadyExists,
    TooManyRequests
}
