using E.Contract.API.IRepositories;
using E.Contract.API.Model;
using E.Contract.API.Model.Dashboard;
using Microsoft.AspNetCore.Mvc;

namespace E.Contract.API.Controllers
{
    [Route("api/dashboard")]
    [ApiController]
    public class DashboardController : BaseController
    {
        private readonly IDashboardRepository _dashboardRepository;
        private IHttpContextAccessor _httpContextAccessor;

        public DashboardController(IDashboardRepository dashboardRepository, IHttpContextAccessor httpContextAccessor)
        {
            _dashboardRepository = dashboardRepository;
            _httpContextAccessor = httpContextAccessor;
        }

        [HttpPost("business-info")]
        public async Task<IActionResult> Info(ChartSearch search)
        {
            try
            {
                var data = await this._dashboardRepository.DashboardBusinessInfo(search);
                return Ok(new ResponseSingleContentModel<BusinessInfoModel>
                {
                    StatusCode = 200,
                    Message = "Success",
                    Data = data
                });

            }
            catch (Exception ex)
            {
                return Ok(new ResponseSingleContentModel<string>
                {
                    StatusCode = 500,
                    Message = "Có lỗi trong quá trình xử lý",
                    Data = ex.ToString()
                });
            }
        }

        [HttpPost("admin-stock-info")]
        public async Task<IActionResult> StockInfo(ChartSearch search)
        {
            try
            {
                var data = await this._dashboardRepository.DashboardStockInfo(search);
                return Ok(new ResponseSingleContentModel<StockInfoModel>
                {
                    StatusCode = 200,
                    Message = "Success",
                    Data = data
                });

            }
            catch (Exception ex)
            {
                return Ok(new ResponseSingleContentModel<string>
                {
                    StatusCode = 500,
                    Message = "Có lỗi trong quá trình xử lý",
                    Data = ex.ToString()
                });
            }
        }

        [HttpPost("admin-dashboard-info")]
        public async Task<IActionResult> DashboardInfo()
        {
            try
            {
                var user_id = userid(_httpContextAccessor);
                var data = await this._dashboardRepository.DashboardInfo(user_id);
                return Ok(new ResponseSingleContentModel<DashboardInfoModel>
                {
                    StatusCode = 200,
                    Message = "Success",
                    Data = data
                });

            }
            catch (Exception ex)
            {
                return Ok(new ResponseSingleContentModel<string>
                {
                    StatusCode = 500,
                    Message = "Có lỗi trong quá trình xử lý",
                    Data = ex.ToString()
                });
            }
        }

    }
}
