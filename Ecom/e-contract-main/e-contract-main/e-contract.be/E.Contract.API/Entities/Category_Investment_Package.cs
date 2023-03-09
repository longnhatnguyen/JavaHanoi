using System.ComponentModel.DataAnnotations.Schema;

namespace E.Contract.API.Entities
{
    [Table("category_investment_package")]
    public class Category_Investment_Package : IAuditableEntity
    {
        public decimal investment_amount { get; set; }  //số tiền đầu tư
        public int stocks { get; set; } = 0; //số cổ phiếu
        public string? note { get; set; }
        public string? name { get; set; }
    }
}
