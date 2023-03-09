using E.Contract.API.Entities;

namespace E.Contract.API.Model.Transfer
{
    public class TransfersModel
    {
        public long customer_id { set; get; } // id customer
        public long contract_id { set; get; } // id hợp đồng
        public string transfer_content { set; get; }  // nội dung chuyển khoản
        public string? bank_account { set; get; } // số tài khoản nguồn 
        public string? bank_name { set; get; } // ngân hàng
        public decimal transfer_amount { set; get; } // số tiền chuyenr khoản
        public byte status { get; set; } // 0 nháp, 1 chờ xác nhận, 2 đã xác nhận
        public long id { set; get; }
        public long userAdded { set; get; }
        public long? userUpdated { set; get; }
        public DateTime dateAdded { get; set; }
        public DateTime? dateUpdated { get; set; }
        public bool is_delete { get; set; } = false;
        public Contract_File? image { get; set; }
    }
}
