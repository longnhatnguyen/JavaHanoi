namespace E.Contract.API.Model.Dashboard
{
    public class DashboardInfoModel
    {
        public int total_contract { get; set; }//tổng số hợp đòng
        public int total_draft_contract { get; set; }// hợp đồng nháp
        public int total_completed_contract { get; set; }//hợp đồng hoàn thành 
        public int total_customer { get; set; }
        public int total_tranfer { get; set; }
    }
}
