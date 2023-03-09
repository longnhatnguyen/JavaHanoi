using E.Contract.API.Entities;
using E.Contract.API.IRepositories;
using E.Contract.API.Model;
using Microsoft.AspNetCore.Mvc;

namespace E.Contract.API.Controllers
{
    [Route("api/business-info")]
    [ApiController]
    public class BusinessInfoController : BaseController
    {
        private readonly IBusinessInfoRepository _businessInfo;
        public BusinessInfoController(IBusinessInfoRepository businessInfoRepository)
        {
            _businessInfo = businessInfoRepository;
        }

        [HttpGet("detail")]
        public async Task<IActionResult> BusinessInfo(long id)
        {
            try
            {
                var data = await this._businessInfo.BusinessInfo(id);
                return Ok(new ResponseSingleContentModel<Business_Info>
                {
                    StatusCode = 200,
                    Message = "Success",
                    Data = data
                });
            }
            catch (Exception)
            {
                return this.RouteToInternalServerError();
            }
        }

        [HttpPost("list")]
        public async Task<IActionResult> BusinessInfoList([FromBody] SearchBase search)
        {
            try
            {
                var data = await this._businessInfo.BusinessInfoList(search);
                return Ok(new ResponseSingleContentModel<PaginationSet<Business_Info>>
                {
                    StatusCode = 200,
                    Message = "Success",
                    Data = data
                });
            }
            catch (Exception)
            {
                return this.RouteToInternalServerError();
            }
        }

        [HttpPost("create")]
        public async Task<IActionResult> BusinessInfoCreate([FromBody] Business_Info model)
        {
            try
            {
                var data = await this._businessInfo.BusinessInfoCreate(model);
                return Ok(new ResponseSingleContentModel<string>
                {
                    StatusCode = 200,
                    Message = "Success",
                    Data = data
                });
            }
            catch (Exception)
            {
                return this.RouteToInternalServerError();
            }
        }

        [HttpPost("modify")]
        public async Task<IActionResult> BankAccountModify([FromBody] Business_Info model)
        {
            try
            {
                var data = await this._businessInfo.BusinessInfoModify(model);
                return Ok(new ResponseSingleContentModel<Business_Info>
                {
                    StatusCode = 200,
                    Message = "Success",
                    Data = data
                });
            }
            catch (Exception)
            {
                return this.RouteToInternalServerError();
            }
        }

        [HttpGet("delete")]
        public async Task<IActionResult> BankAccountDelete(long id)
        {
            try
            {
                var data = await this._businessInfo.BusinessInfoDelete(id);
                if (data == true)
                {
                    return Ok(new ResponseSingleContentModel<bool>
                    {
                        StatusCode = 200,
                        Message = "Success",
                        Data = true
                    });
                }
                else
                    return this.RouteToInternalServerError();
            }
            catch (Exception)
            {
                return this.RouteToInternalServerError();

            }
        }

    }
}
