namespace E.Contract.Framework.Validator.MessageProvider
{
    internal sealed class EmptyMessageProvider : IValitMessageProvider<string>
    {
        public string GetByKey(string key)
            => string.Empty;
    }
}
