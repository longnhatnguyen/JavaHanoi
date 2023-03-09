using System.ComponentModel.DataAnnotations.Schema;

namespace E.Contract.API.Entities
{
    [Table("customer")]
    public class Customer:IAuditableEntity
    {
        public long id { set; get; }
        public string name { set; get; } = string.Empty;//tên 
        public string code   { set; get; } = string.Empty;//code     
        public string address { set; get; } = string.Empty;//địa chỉ
        public string identity { set; get; } = string.Empty; // số căn cước công dân
        public string phone { set; get; } = string.Empty;// số điện thoại
        public string email { set; get; } = string.Empty; //email
        public DateTime? birthday { set; get; }//ngày tháng năm sinh
        public string? referral_code { get; set; }

        public string taxcode { set; get; } = string.Empty;
        public string username { set; get; } = string.Empty;
        public string password { set; get; } = string.Empty;
        public string pass_code { set; get; } = string.Empty;
        public bool is_active { set; get; } = true;

    }
}
