using E.Contract.API.Extensions;
using E.Contract.API.IRepositories;
using E.Contract.API.Model;
using E.Contract.API.Model.Transfer;
using E.Contract.Framework.Validator;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace E.Contract.API.Controllers
{
    [Route("api/transfer")]
    [ApiController]
    public class TransfersController : BaseController
    {
        private readonly IConfiguration _configuration;
        private readonly ITransfersRepository _transferRepository;
        private readonly IHttpContextAccessor _httpContextAccessor;
        public TransfersController(ITransfersRepository transferRepository, IHttpContextAccessor httpContextAccessor, IConfiguration configuration)
        {
            _transferRepository = transferRepository;
            _httpContextAccessor = httpContextAccessor;
            _configuration = configuration;
        }
        //[Authorize(Roles = "TRANSFERCREATE")]
        [HttpPost("create")]
        public async Task<IActionResult> TransfersCreate([FromBody] TransfersModel model)
        {
            try
            {
                var validator = ValitRules<TransfersModel>
                    .Create()
                    //.Ensure(m => m.name, rule => rule.Required())
                    //.Ensure(m => m.phone, rule => rule.Required())
                    //.Ensure(m => m.password, rule => rule.Required())
                    .For(model)
                    .Validate();

                if (validator.Succeeded)
                {
                    model.userAdded = userid(_httpContextAccessor);
                    var response = await this._transferRepository.TransfersCreate(model);
                    return response != null
                        ? Ok(new ResponseSingleContentModel<TransfersModel>
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

        //  [Authorize(Roles = "TRANSFERMODIFY")]
        [HttpPost("modify")]
        public async Task<IActionResult> TransfersUpdate([FromBody] TransfersModel model)
        {
            try
            {
                var validator = ValitRules<TransfersModel>
                    .Create()
                    //.Ensure(m => m.name, rule => rule.Required())
                    //.Ensure(m => m.phone, rule => rule.Required())
                    //.Ensure(m => m.password, rule => rule.Required())
                    .For(model)
                    .Validate();

                if (validator.Succeeded)
                {
                    model.userUpdated = userid(_httpContextAccessor);
                    var response = await this._transferRepository.TransfersUpdate(model);
                    return response != null
                        ? Ok(new ResponseSingleContentModel<TransfersModel>
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

        // [Authorize(Roles = "TRANSFERCHANGESTATUS")]
        [HttpGet("change-status")]
        public async Task<IActionResult> TransfersUpdateStatus(long transfer_id, byte status_id)
        {
            try
            {
                long user_id = userid(_httpContextAccessor);
                var response = await this._transferRepository.TransfersUpdateStatus(transfer_id, status_id, user_id);
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

        //   [Authorize(Roles = "TRANSFERDETAIL")]
        [HttpGet("detail")]
        public async Task<IActionResult> TransfersGetById(long transfer_id)
        {
            try
            {
                var response = await this._transferRepository.TransfersGetById(transfer_id);
                return response != null
                    ? Ok(new ResponseSingleContentModel<TransfersModel>
                    {
                        StatusCode = 200,
                        Message = "Lấy thông tin thành công",
                        Data = response
                    })
                    : (IActionResult)Ok(new ResponseSingleContentModel<TransfersModel>
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
        // [Authorize(Roles = "TRANSFERLIST")]
        [HttpPost("list")]
        public async Task<IActionResult> TransfersList([FromBody] SearchModel model)
        {
            try
            {
                var response = await this._transferRepository.TransfersList(model);
                return response != null
                    ? Ok(new ResponseSingleContentModel<PaginationSet<TransfersModel>>
                    {
                        StatusCode = 200,
                        Message = "Lấy thông tin thành công",
                        Data = response
                    })
                    : (IActionResult)Ok(new ResponseSingleContentModel<PaginationSet<TransfersModel>>
                    {
                        StatusCode = 500,
                        Message = "Có lỗi trong quá trình xử lý ",
                        Data = new PaginationSet<TransfersModel>()
                    });
            }
            catch (Exception ex)
            {
                return this.RouteToInternalServerError();
            }
        }
        //   [Authorize(Roles = "TRANSFERDELETE")]
        [HttpDelete("delete")]
        public async Task<IActionResult> TransfersDelete(long transfer_id)
        {
            try
            {
                long user_id = userid(_httpContextAccessor);
                var response = await this._transferRepository.TransfersDelete(transfer_id, user_id);
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
        // api cho công post
        [AllowAnonymous]
        [HttpPost("transfers-post")]
        public async Task<IActionResult> TransfersCreate([FromBody] TransfersPostModel model)
        {
            try
            {
                var response = await this._transferRepository.TransfersCreatePost(model);
               if(response != null)
                {
                    return Ok(new ResponseSingleContentModel<TransfersPostModel>
                    {
                        StatusCode = 200,
                        Message = "cập nhật thành công",
                        Data = response
                    }) ;
                }
                else
                {
                    return Ok(new ResponseSingleContentModel<string>
                    {

                        StatusCode = 500,
                        Message = "câp nhập không thành công",
                        Data = null
                    });
                }
            }
            catch
            {
                return Ok(new ResponseSingleContentModel<string>
                {
                    StatusCode = 500,
                    Message = "câp nhập không thành công",
                    Data = null
                });
            }

        }

    }
}
