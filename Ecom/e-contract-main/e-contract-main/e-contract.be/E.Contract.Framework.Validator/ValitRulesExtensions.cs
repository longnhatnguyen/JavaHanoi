using E.Contract.Framework.Validator.Exceptions;
using E.Contract.Framework.Validator.Validators;

namespace E.Contract.Framework.Validator
{
    public static class ValitRulesExtensions
    {
        public static IValitator<TObject> CreateValitator<TObject>(this IValitRules<TObject> valitRules) where TObject : class
        {
            valitRules.ThrowIfNull();
            return new Valitator<TObject>(valitRules);
        }
    }
}
