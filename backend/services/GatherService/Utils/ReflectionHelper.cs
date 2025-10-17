namespace Gather.Utils;

public static class ReflectionHelper
{
    public static T? GetPrivateFieldValue<T>(object obj, string fieldName)
    {
        var fieldInfo = obj.GetType().GetField(fieldName);

        if (fieldInfo == null)
        {
            throw new MissingFieldException($"Private field '{fieldName}' not found");
        }

        var value = fieldInfo.GetValue(obj);
        if (value is null && typeof(T).IsValueType && Nullable.GetUnderlyingType(typeof(T)) == null)
        {
            throw new InvalidCastException($"Cannot cast null to non-nullable value type '{typeof(T)}'.");
        }
        return (T?)value;
    }
}
