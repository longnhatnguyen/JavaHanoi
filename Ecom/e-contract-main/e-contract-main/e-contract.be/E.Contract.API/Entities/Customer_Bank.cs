using System.ComponentModel.DataAnnotations.Schema;

namespace E.Contract.API.Entities
{
    [Table("customer_bank")]
    public class Customer_Bank:IAuditableEntity
    {
        public string bank_name { get; set; }
        public string bank_account { get; set; }
        public long customer_id { get; set; }
    }
}
