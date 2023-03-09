namespace E.Contract.API.Model.Dashboard
{
    public class StockInfoModel
    {
        public List<ChartDataModel> invest_amounts { get; set; }// số tiền đầu tư
        public List<ChartDataModel> stocks { get; set; }// số cổ phiếu
    }
}
