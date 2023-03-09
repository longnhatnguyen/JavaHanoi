using E.Contract.API.Entities;

namespace E.Contract.API.Model.Config
{
    public class ConfigModel
    {
        public string account_number { get; set; }
        public string account_name { get; set; }
        public string bank_name { get; set; }

        public string? note { get; set; }
        public long id { set; get; }
        public long userAdded { set; get; }
        public long? userUpdated { set; get; }
        public DateTime dateAdded { get; set; }
        public DateTime? dateUpdated { get; set; }
        public bool is_delete { get; set; } = false;
        public Contract_File? image { get; set; }

    }
}
