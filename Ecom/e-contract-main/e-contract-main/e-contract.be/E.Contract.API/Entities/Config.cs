using System.ComponentModel.DataAnnotations.Schema;

namespace E.Contract.API.Entities
{
    [Table("config")]

    public class Config : IAuditableEntity
    {
        public string account_number { get; set; }  
        public string account_name { get; set; }
        public string bank_name { get; set; }
        public string? note { get; set; }   
    }
}
