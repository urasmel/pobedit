namespace Gather.Utils;

public static class ReflectionHelper
{
    public static T GetPrivateFieldValue<T>(object obj, string fieldName)
    {
        var fieldInfo = obj.GetType().GetField(fieldName);

        if (fieldInfo == null)
        {
            throw new MissingFieldException($"Private field '{fieldName}' not found");
        }

        return (T)fieldInfo.GetValue(obj);
    }
}
