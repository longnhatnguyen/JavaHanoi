using System.ComponentModel.DataAnnotations.Schema;

namespace E.Contract.API.Entities
{
    [Table("category_ratio")]
    public class Category_Ratio:IAuditableEntity
    {
        public string name { get; set; }
        public string? note { get; set; }
        public double capital_value { get; set; }//
        public double price { set; get; }
        public double income { get; set; } // lợi tức 
    }
}
