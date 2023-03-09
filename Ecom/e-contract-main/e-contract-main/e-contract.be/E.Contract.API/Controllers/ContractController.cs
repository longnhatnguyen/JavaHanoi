using E.Contract.API.Extensions;
using E.Contract.API.IRepositories;
using E.Contract.API.Model;
using E.Contract.API.Model.Contract;
using E.Contract.Framework.Validator;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace E.Contract.API.Controllers
{
    [Route("api/contract")]
    [ApiController]
    public class ContractController : BaseController
    {
        private readonly IConfiguration _configuration;
        private readonly IContractRepository _contractRepository;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public ContractController(IContractRepository contractRepository, IHttpContextAccessor httpContextAccessor, IConfiguration configuration)
        {
            _contractRepository = contractRepository;
            _httpContextAccessor = httpContextAccessor;
            _configuration = configuration;
        }

        //  [Authorize(Roles = "CONTRACTCREATE")]
        [HttpPost("create")]
        public async Task<IActionResult> ContractCreate([FromBody] ContractModel model)
        {
            try
            {
                var validator = ValitRules<ContractModel>
                    .Create()
                    //.Ensure(m => m.name, rule => rule.Required())
                    //.Ensure(m => m.phone, rule => rule.Required())
                    //.Ensure(m => m.password, rule => rule.Required())
                    .For(model)
                    .Validate();

                if (validator.Succeeded)
                {
                    model.userAdded = userid(_httpContextAccessor);
                    var response = await this._contractRepository.ContractCreate(model);
                    return response != null
                        ? Ok(new ResponseSingleContentModel<ContractModel>
                        {
                            StatusCode = 200,
                            Message = "Thêm mới thành công",
                            Data = response
                        })
                        : (IActionResult)Ok(new ResponseSingleContentModel<string>
                        {
                            StatusCode = 500,
                            Message = "Có lỗi trong quá trình xử lý ",
                            Data = string.Empty
                        });
                }
                return Ok(new ResponseSingleContentModel<string>
                {
                    StatusCode = 400,
                    Message = validator.ErrorMessages.JoinNewLine(),
                    Data = string.Empty
                });
            }
            catch (Exception ex)
            {
                return this.RouteToInternalServerError();
            }
        }

        //  [Authorize(Roles = "CONTRACTMODIFY")]
        [HttpPost("modify")]
        public async Task<IActionResult> ContractUpdate([FromBody] ContractModel model)
        {
            try
            {
                var validator = ValitRules<ContractModel>
                    .Create()
                    //.Ensure(m => m.name, rule => rule.Required())
                    //.Ensure(m => m.phone, rule => rule.Required())
                    //.Ensure(m => m.password, rule => rule.Required())
                    .For(model)
                    .Validate();

                if (validator.Succeeded)
                {
                    model.userUpdated = userid(_httpContextAccessor);
                    var response = await this._contractRepository.ContractUpdate(model);
                    return response != null
                        ? Ok(new ResponseSingleContentModel<ContractModel>
                        {
                            StatusCode = 200,
                            Message = "Cập nhật thành công",
                            Data = response
                        })
                        : (IActionResult)Ok(new ResponseSingleContentModel<string>
                        {
                            StatusCode = 500,
                            Message = "Có lỗi trong quá trình xử lý ",
                            Data = string.Empty
                        });
                }
                return Ok(new ResponseSingleContentModel<string>
                {
                    StatusCode = 400,
                    Message = validator.ErrorMessages.JoinNewLine(),
                    Data = string.Empty
                });
            }
            catch (Exception ex)
            {
                return this.RouteToInternalServerError();
            }
        }

        //  [Authorize(Roles = "CONTRACTCHANGESTATUS")]
        [HttpGet("change-status")]
        public async Task<IActionResult> ContractUpdateStatus(long contract_id, int status_id)
        {
            try
            {
                long user_id = userid(_httpContextAccessor);
                var response = await this._contractRepository.ContractUpdateStatus(contract_id, status_id, user_id);
                return response == true
                    ? Ok(new ResponseSingleContentModel<string>
                    {
                        StatusCode = 200,
                        Message = "Cập nhật trạng thái thành công",
                        Data = ""
                    })
                    : (IActionResult)Ok(new ResponseSingleContentModel<string>
                    {
                        StatusCode = 500,
                        Message = "Có lỗi trong quá trình xử lý ",
                        Data = string.Empty
                    });
            }
            catch (Exception ex)
            {
                return this.RouteToInternalServerError();
            }
        }
        //[AllowAnonymous]

        // [Authorize(Roles = "CONTRACTDETAIL")]
        [HttpGet("detail")]
        public async Task<IActionResult> ContractGetById(long contract_id)
        {
            try
            {
                var response = await this._contractRepository.ContractGetById(contract_id);
                return response != null
                    ? Ok(new ResponseSingleContentModel<ContractModel>
                    {
                        StatusCode = 200,
                        Message = "Lấy thông tin thành công",
                        Data = response
                    })
                    : (IActionResult)Ok(new ResponseSingleContentModel<ContractModel>
                    {
                        StatusCode = 500,
                        Message = "Không tìm thấy bản ghi ",
                        Data = null
                    });
            }
            catch (Exception ex)
            {
                return this.RouteToInternalServerError();
            }
        }

        //  [Authorize(Roles = "CONTRACTLIST")]
        [HttpPost("list")]
        public async Task<IActionResult> ContractList([FromBody] ContractSearchModel model)
        {
            try
            {

                var response = await this._contractRepository.ContractList(model);
                return response != null
                    ? Ok(new ResponseSingleContentModel<PaginationSet<ContractModel>>
                    {
                        StatusCode = 200,
                        Message = "Lấy thông tin thành công",
                        Data = response
                    })
                    : (IActionResult)Ok(new ResponseSingleContentModel<PaginationSet<ContractModel>>
                    {
                        StatusCode = 500,
                        Message = "Có lỗi trong quá trình xử lý ",
                        Data = new PaginationSet<ContractModel>()
                    });
            }
            catch (Exception ex)
            {
                return this.RouteToInternalServerError();
            }
        }

        //  [Authorize(Roles = "CONTRACTDELETE")]
        [HttpDelete("delete")]
        public async Task<IActionResult> ContractDelete(long contract_id)
        {
            try
            {
                long user_id = userid(_httpContextAccessor);
                var response = await this._contractRepository.ContractDelete(contract_id, user_id);
                return response != true
                    ? Ok(new ResponseSingleContentModel<bool>
                    {
                        StatusCode = 200,
                        Message = "cập nhật thành công",
                        Data = response
                    })
                    : (IActionResult)Ok(new ResponseSingleContentModel<bool>
                    {
                        StatusCode = 500,
                        Message = "Không tìm thấy bản ghi ",
                        Data = response
                    });
            }
            catch (Exception ex)
            {
                return this.RouteToInternalServerError();
            }
        }
        //[AllowAnonymous]

        // [Authorize(Roles = "CONTRACTGENPDF")]
        [HttpGet("gen-pdf")]
        public async Task<IActionResult> GenPDF(long contract_id)
        {
            try
            {
                var response = await this._contractRepository.GenPDF(contract_id);
                return response != ""
                    ? Ok(new ResponseSingleContentModel<string>
                    {
                        StatusCode = 200,
                        Message = "Lấy thông tin thành công",
                        Data = response
                    })
                    : (IActionResult)Ok(new ResponseSingleContentModel<string>
                    {
                        StatusCode = 500,
                        Message = "Không tìm thấy bản ghi ",
                        Data = response
                    });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new ResponseSingleContentModel<string>
                {
                    StatusCode = 500,
                    Message = "Internal Server Error!",
                    Data = ex.ToString()
                });
            }
        }
        [AllowAnonymous]
        [HttpGet("send-otp-confirm")]
        public async Task<IActionResult> OTPCreateForConfirm(string phone_number, string contract_code)
        {
            try
            {
                string check = await _contractRepository.OTPCreateForContract(phone_number,contract_code);
                return check == "0"
                    ? Ok(new ResponseSingleContentModel<string>
                    {
                        StatusCode = 200,
                        Message = "Vui lòng chờ OTP trong giây lát",
                        Data = null
                    })
                    : (IActionResult)Ok(new ResponseSingleContentModel<string>
                    {
                        StatusCode = 500,
                        Message = check,
                        Data = null
                    });
            }
            catch (Exception)
            {

                return Ok(new ResponseSingleContentModel<IResponseData>
                {
                    StatusCode = 500,
                    Message = "Có lỗi trong quá trình xử lý",
                    Data = null
                });
            }
        }
        [AllowAnonymous]
        [HttpGet("check-otp")]
        public async Task<IActionResult> CheckOTP(string phone_number, string otp)
        {
            try
            {
                string check = await _contractRepository.CheckOTP(phone_number, otp);
                return check == "0"
                    ? Ok(new ResponseSingleContentModel<string>
                    {
                        StatusCode = 200,
                        Message = "Vui lòng chờ OTP trong giây lát",
                        Data = null
                    })
                    : (IActionResult)Ok(new ResponseSingleContentModel<string>
                    {
                        StatusCode = 500,
                        Message = check,
                        Data = null
                    });
            }
            catch (Exception)
            {

                return Ok(new ResponseSingleContentModel<IResponseData>
                {
                    StatusCode = 500,
                    Message = "Có lỗi trong quá trình xử lý",
                    Data = null
                });
            }
        }



    }
}
