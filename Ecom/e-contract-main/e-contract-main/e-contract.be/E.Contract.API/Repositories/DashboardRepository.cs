using AutoMapper;
using E.Contract.API.Entities;
using E.Contract.API.IRepositories;
using E.Contract.API.Model.Dashboard;
using Microsoft.EntityFrameworkCore;

namespace E.Contract.API.Repositories
{
    public class DashboardRepository : IDashboardRepository
    {
        private readonly ApplicationContext _context;
        private readonly IMapper _mapper;

        public DashboardRepository(ApplicationContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
        }

        public async Task<BusinessInfoModel> DashboardBusinessInfo(ChartSearch search)
        {
            return await Task.Run(async () =>
            {
                BusinessInfoModel data = new BusinessInfoModel();
                try
                {
                    data.cost = new List<ChartDataModel>();
                    data.funds = new List<ChartDataModel>();
                    data.profit = new List<ChartDataModel>();
                    data.revenue = new List<ChartDataModel>();
                    foreach (var item in search.GetChartBarSearches())
                    {
                        var dataB = await _context.Business_Info.Where(e => e.date >= item.date_from && e.date <= item.date_to && !e.is_delete).ToListAsync();
                        data.cost.Add(new ChartDataModel
                        {
                            name = item.label,
                            total = dataB.Sum(e => e.cost)
                        }); ;
                        data.funds.Add(new ChartDataModel
                        {
                            name = item.label,
                            total = dataB.Sum(e => e.funds)
                        });
                        data.profit.Add(new ChartDataModel
                        {
                            name = item.label,
                            total = dataB.Sum(e => e.profit)

                        });
                        data.revenue.Add(new ChartDataModel
                        {
                            name = item.label,
                            total = dataB.Sum(e => e.revenue)

                        });
                    }
                    return data;
                }
                catch (Exception ex)
                {
                    return data;
                }
            });
        }

        public async Task<StockInfoModel> DashboardStockInfo(ChartSearch search)
        {
            return await Task.Run(async () =>
            {
                StockInfoModel data = new StockInfoModel();
                try
                {
                    data.invest_amounts = new List<ChartDataModel>();
                    data.stocks = new List<ChartDataModel>();
                    foreach (var item in search.GetChartBarSearches())
                    {
                        var dataB = await _context.Contracts.Where(e => e.dateAdded >= item.date_from && e.dateAdded <= item.date_to && !e.is_delete && e.status >= 3).ToListAsync();
                        data.invest_amounts.Add(new ChartDataModel
                        {
                            name = item.label,
                            total = (double)dataB.Sum(e => e.amount_of_investment)
                        });
                        data.stocks.Add(new ChartDataModel
                        {
                            name = item.label,
                            total = dataB.Sum(e => e.number_of_shares)
                        });

                    }
                    return data;
                }
                catch (Exception ex)
                {
                    return data;
                }
            });
        }

        public async Task<DashboardInfoModel> DashboardInfo(long id)
        {
            return await Task.Run(async () =>
            {
                DashboardInfoModel data = new DashboardInfoModel();
                try
                {
                    data.total_tranfer = await _context.Transfers.Where(x => !x.is_delete).Select(e => e.id).CountAsync();
                    data.total_customer = await _context.Customer.Where(x => !x.is_delete).Select(e => e.id).CountAsync();
                    data.total_contract = await _context.Contracts.Where(x => !x.is_delete && x.status != 0).Select(e => e.id).CountAsync();
                    data.total_draft_contract = await _context.Contracts.Where(x => !x.is_delete && x.status == 1).Select(e => e.id).CountAsync();
                    data.total_completed_contract = await _context.Contracts.Where(x => !x.is_delete && x.status >= 2).Select(e => e.id).CountAsync();

                    return data;
                }
                catch (Exception ex)
                {
                    return data;
                }
            });
        }
    }
}
