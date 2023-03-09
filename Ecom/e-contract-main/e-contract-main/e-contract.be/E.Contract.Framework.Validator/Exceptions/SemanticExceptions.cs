using System;

namespace E.Contract.Framework.Validator.Exceptions
{
    internal static class SemanticExceptions
    {
        public static ValitException NullDereferenced(string message)
            => throw new ValitException(message, new ArgumentNullException());

        public static ValitException NullDereferenced()
        => throw new ValitException("Null dereferenced", new ArgumentNullException());
    }
}
