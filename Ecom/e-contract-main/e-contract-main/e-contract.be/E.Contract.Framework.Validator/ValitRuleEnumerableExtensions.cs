using System.Collections.Generic;
using System.Linq;
using E.Contract.Framework.Validator.Errors;

namespace E.Contract.Framework.Validator
{
    public static class ValitRuleEnumerableExtensions
    {

        public static IValitRule<TObject, IEnumerable<TProperty>> MinItems<TObject, TProperty>(this IValitRule<TObject, IEnumerable<TProperty>> rule, int expectedItemsNumber) where TObject : class
            => rule.Satisfies(p => p != null && p.Count() >= expectedItemsNumber).WithDefaultMessage(ErrorMessages.MinItems, expectedItemsNumber);

        public static IValitRule<TObject, IEnumerable<TProperty>> MaxItems<TObject, TProperty>(this IValitRule<TObject, IEnumerable<TProperty>> rule, int expectedItemsNumber) where TObject : class
            => rule.Satisfies(p => p != null && p.Count() <= expectedItemsNumber).WithDefaultMessage(ErrorMessages.MaxItems, expectedItemsNumber);
    }
}
