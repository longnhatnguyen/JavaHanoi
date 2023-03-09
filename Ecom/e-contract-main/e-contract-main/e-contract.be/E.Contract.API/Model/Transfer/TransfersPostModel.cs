namespace E.Contract.API.Model.Transfer
{
    public class TransfersPostModel
    {
        public string  contract_number { get; set; }  // sô hơp đồng
        public string transfer_content { set; get; }  // nội dung chuyển khoản
        public string? bank_account { set; get; } // số tài khoản nguồn 
        public string? bank_name { set; get; } // ngân hàng
        public decimal transfer_amount { set; get; } // số tiền chuyenr khoản
        public byte status { get; set; } // 0 nháp, 1 chờ xác nhận, 2 đã xác nhận
        public DateTime? datepost { get; set; }

    }
}
