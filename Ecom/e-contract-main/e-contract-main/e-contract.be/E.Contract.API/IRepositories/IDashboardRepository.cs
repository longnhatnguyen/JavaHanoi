using E.Contract.API.Model.Dashboard;

namespace E.Contract.API.IRepositories
{
    public interface IDashboardRepository
    {
        Task<BusinessInfoModel> DashboardBusinessInfo(ChartSearch search);
        Task<StockInfoModel> DashboardStockInfo(ChartSearch search);
        Task<DashboardInfoModel> DashboardInfo(long id);

        

    }
}
