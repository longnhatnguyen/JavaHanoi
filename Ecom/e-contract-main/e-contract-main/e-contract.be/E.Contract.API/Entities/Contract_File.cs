﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace E.Contract.API.Entities
{
    [Table("contract_file")]
    public class Contract_File
    {
        [Key]
        public long id { get; set; } = 0;
        public long idtable { get; set; }
        [StringLength(100)]
        public string tablename { get; set; } = string.Empty;
        [StringLength(100)]
        public string name_guid { set; get; } = string.Empty;
        [StringLength(250)]
        public string name { set; get; } = string.Empty;
        public string ipserver { set; get; } = string.Empty;
        public byte type { set; get; } // =1 là ảnh mô tả, bằng 2 là video, 3 chứng chỉ ( đối với product)
        public string path { set; get; } = string.Empty;
        public string file_type { set; get; } = string.Empty;
        public bool is_delete { set; get; }
    }
}
 