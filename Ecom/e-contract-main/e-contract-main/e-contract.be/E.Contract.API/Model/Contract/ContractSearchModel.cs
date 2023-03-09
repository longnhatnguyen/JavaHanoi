namespace E.Contract.API.Model.Contract
{
    public class ContractSearchModel
    {
        public int page_number { get; set; }
        public int page_size { get; set; }
        public string? keyword { get; set; }
        public long ? customer_id { get; set; }
    }
}
