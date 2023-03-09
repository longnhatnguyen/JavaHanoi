using System.Collections.Immutable;

namespace E.Contract.Framework.Validator
{
    public interface IValitResult
    {
        bool Succeeded { get; }

        ImmutableArray<string> ErrorMessages { get; }

        ImmutableArray<int> ErrorCodes { get; }
    }
}
