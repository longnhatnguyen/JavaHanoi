using System.ComponentModel.DataAnnotations.Schema;

namespace E.Contract.API.Entities
{
    [Table("business_info")]
    public class Business_Info : IAuditableEntity
    {          
        public double revenue { get; set; }// doanh thu
        public double profit { get; set; }// lợi nhuận
        public double funds { get; set; }// vốn
        public double cost { get; set; }// chi phí
        public DateTime date { get; set; }// ngày báo cáo
         
    }
}
