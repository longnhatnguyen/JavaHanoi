using System;

namespace E.Contract.Framework.Validator
{
    public class ValitException : Exception
    {
        public ValitException(string message, Exception innerException)
            :base(message, innerException)
        {
        }
    }
}
