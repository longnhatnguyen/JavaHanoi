using System.ComponentModel.DataAnnotations.Schema;

namespace E.Contract.API.Entities
{
    [Table("transfers")]
    public class Transfers : IAuditableEntity
    {
        public long customer_id { set; get; } // id customer
        public long contract_id { set; get; } // id hợp đồng
        public string transfer_content { set; get; }  // nội dung chuyển khoản
        public string? bank_account { set; get; } // số tài khoản nguồn 
        public string? bank_name { set; get; } // ngân hàng
        public decimal transfer_amount { set; get; } // số tiền chuyenr khoản
        public byte status { get; set; } // 0 nháp, 1 chờ xác nhận, 2 đã xác nhận
    }
}
