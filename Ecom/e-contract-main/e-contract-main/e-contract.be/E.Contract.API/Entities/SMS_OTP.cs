using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace E.Contract.API.Entities
{
    [Table("sms_otp")]
    public class SMS_OTP
    {
        [Key]
        public long id { get; set; }
        public string otp { get; set; }
        [StringLength(12)]
        public string phone_number { get; set; }
        public string content { get; set; }
        public bool send_status { get; set; }
        public DateTime date_send { get; set; }
        public DateTime day_send { get; set; }
        public byte type { set; get; }// 0 là đăng ký tài khoản - 1 là xác nhận đăng nhập otp - 2 là xác nhận hợp đồng
        public bool is_delete { get; set; } = false;
    }
}
