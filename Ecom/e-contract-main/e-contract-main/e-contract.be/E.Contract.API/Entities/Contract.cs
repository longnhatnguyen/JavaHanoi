using System.ComponentModel.DataAnnotations.Schema;

namespace E.Contract.API.Entities
{
    [Table("contract")]
    public class Contracts : IAuditableEntity
    {
        public long customer_id { get; set; } // id khach hang 
        public DateTime contract_signature_date { get; set; } // ngày ký hợp đồng 
        public string customer_deputy { get; set; } // người đại diện 
        public string? customer_position { get; set; } // chức vụ 
        public string? customer_enterprise_name { get; set; } // tên doanh nghiệp
        public string? customer_enterprise_short_name { get; set; } // tên tên viết tắt 
        public string? customer_enterprise_code { get; set; } // mã doanh nghiệp
        public string customer_phone { get; set; } // só điện thoại
        public string? customer_email { get; set; } // email 
        public string customer_address { get; set; } // địa chỉ 
        public string customer_tax_code { get; set; } // mã số thuế 
        public string customer_account_number { get; set; } // số tài khoản ngân hàng 
        public string customer_bank_name { get; set; } //tên ngân hàng 
        public long customer_bank_account_id { get; set; } // id tài khoản ngana hàng của khách 
        public string customer_id_number { get; set; } // số CCCD của khách         citizen identification number
        public DateTime issuance_date { get; set; } //  của ngày cấp hộ chiếu/cccd khách         citizen identification number
        public string passport_issuer { get; set; } // cơ quan cấp hộ chiếu       citizen identification number
        public DateTime customer_date_of_birth { get; set; } // ngày sinh của khách 
        public string contract_number { get; set; } // số hợp đồng 
        public decimal amount_of_investment { get; set; } // số tiền  đầu tư  
        public int number_of_shares { get; set; } // số cổ phiếu 
        public long investment_id { get; set; } // id option đầu tu
        public DateTime active_time { get; set; } // thời hạn hợp đồng bắt đầu  
        public DateTime end_time { get; set; } // thời hạn hợp đồng kết thúc  
        public double profit_percentage { get; set; } // số % lợi nhuận dược hưởng 
        public int status { set; get; } // 0: hợp đồng nháp, 1 đã chọn số tiền , 2 đã xác minh otp , 3 đã chuyển tiền - chờ kế toán xác nhận, 4 done
        public byte validation_type { set; get; } // phuong thuc xac minh . 0 la otp 1 la online sign
        public string? note { get; set; }
        public byte type { set; get; } //0 la hợp đồng cá nhân, 1 là hợp đồng doanh nghiệp 
        public string contract_path { set; get; } // duong dan file hop dong pdf
    }
}
