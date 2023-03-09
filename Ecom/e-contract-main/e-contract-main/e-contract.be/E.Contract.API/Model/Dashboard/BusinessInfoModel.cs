namespace E.Contract.API.Model.Dashboard
{
    public class BusinessInfoModel
    {
        public List<ChartDataModel> revenue { get; set; }// doanh thu
        public List<ChartDataModel> profit { get; set; }// lợi nhuận
        public List<ChartDataModel> funds { get; set; }// vốn
        public List<ChartDataModel> cost { get; set; }// chi phí
    }

    
}
