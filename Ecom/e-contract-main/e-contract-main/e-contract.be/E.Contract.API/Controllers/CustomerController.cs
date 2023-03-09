using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using E.Contract.API.Extensions;
using E.Contract.API.IRepositories;
using E.Contract.API.Model;
using E.Contract.API.Model.Customer;
using E.Contract.API.Model.User;
using E.Contract.Framework.Validator;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace E.Contract.API.Controllers
{
    [Route("api/customer")]
    [ApiController]
    public class CustomerController : BaseController
    {
        private readonly IConfiguration _configuration;
        private readonly ICustomerRepository _customerRepository;

        private readonly IHttpContextAccessor _httpContextAccessor;
        public List<string> customer_role = new List<string>{"CATEGORYSTOREDETAIL", "BUSINESSINFODETAIL", "CONTRACTCREATE", "CONTRACTMODIFY", "CONTRACTCHANGESTATUS", "CONTRACTDETAIL", "CONTRACTLIST",
                                            "CONTRACTGENPDF", "CUSTOMERDETAIL", "CUSTOMERMODIFY", "BUSINESSINFO", "ADMINSTOCKINFO", "ADMINDASHBOARDINFO", "TRANSFERDETAIL", "TRANSFERLIST",
                                            "TRANSFERMODIFY", "TRANSFERCREATE"};
        public CustomerController(ICustomerRepository customerRepository, IHttpContextAccessor httpContextAccessor, IConfiguration configuration)
        {
            _customerRepository = customerRepository;
            _httpContextAccessor = httpContextAccessor;
            _configuration = configuration;
        }
        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<IActionResult> Login(CustomerLoginModel login)
        {
            try
            {
                var validator = ValitRules<CustomerLoginModel>
                    .Create()
                    .Ensure(m => m.username, rule => rule.Required())
                    .Ensure(m => m.password, rule => rule.Required())
                    .For(login)
                    .Validate();

                if (validator.Succeeded)
                {
                    var user = await _customerRepository.CustomerGetPhone(login.username);
                    if (user != null && user.id > 0)
                    {

                        int checkAccount = await _customerRepository.Authenticate(login);
                        CustomerTokenModel userAuthen = new();
                        if (checkAccount == 1)
                        {
                            List<string> roles = customer_role;
                            CustomerClaimModel claim = new CustomerClaimModel
                            {

                                full_name = user.name,
                                id = user.id,
                                username = user.username,
                            };
                            string tokenString = GenerateToken(claim);
                            userAuthen.token = tokenString;
                            userAuthen.id = user.id;
                            userAuthen.roles = roles;
                            userAuthen.username = user.username;
                            userAuthen.full_name = user.name;
                            userAuthen.token = tokenString;
                            CustomerModel customer = await _customerRepository.Customer(user.id);
                            userAuthen.image = customer.image;
                            return Ok(new ResponseSingleContentModel<CustomerTokenModel>
                            {
                                StatusCode = 200,
                                Message = "Đăng nhập thành công",
                                Data = userAuthen
                            });
                        }
                        else
                        {
                            return Ok(new ResponseSingleContentModel<string>
                            {
                                StatusCode = 500,
                                Message = "Sai tài khoản hoặc mật khẩu",
                                Data = null
                            });
                        }
                    }
                    else
                    {
                        return Ok(new ResponseSingleContentModel<string>
                        {
                            StatusCode = 500,
                            Message = "Tài khoản không tồn tại trong hệ thống",
                            Data = null
                        });
                    }
                }

                // Return invalidate data
                return Ok(new ResponseSingleContentModel<string>
                {
                    StatusCode = 400,
                    Message = validator.ErrorMessages.JoinNewLine(),
                    Data = string.Empty
                });
            }
            catch (Exception)
            {
                return Ok(new ResponseSingleContentModel<string>
                {
                    StatusCode = 500,
                    Message = "Có lỗi xảy ra trong quá trình xử lý",
                    Data = string.Empty
                });
            }
        }
        private string GenerateToken(CustomerClaimModel user)
        {
            var identity = GetClaims(user);

            var key = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_configuration["TokenSettings:Key"]));
            var token = new JwtSecurityToken(
            _configuration["TokenSettings:Issuer"],
             _configuration["TokenSettings:Audience"],
              expires: DateTime.Now.AddDays(3),
              claims: identity,
              signingCredentials: new SigningCredentials(key, SecurityAlgorithms.HmacSha256)
              );
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
        private IEnumerable<Claim> GetClaims(CustomerClaimModel user)
        {
            var claims = new List<Claim>
            {
               new Claim(JwtRegisteredClaimNames.Sub, Guid.NewGuid().ToString()),
                new Claim(JwtRegisteredClaimNames.Typ, user.type.ToString()),
                new Claim(JwtRegisteredClaimNames.UniqueName, user.username.ToString()),
                new Claim(JwtRegisteredClaimNames.Name, user.full_name),
                new Claim(JwtRegisteredClaimNames.Email, user.email),
                new Claim(JwtRegisteredClaimNames.Sid, user.id.ToString())
            };



            return claims;
        }
        [AllowAnonymous]
        [HttpPost("create")]
        public async Task<IActionResult> CustomerCreate([FromBody] CustomerAddModel model)
        {
            try
            {
                var checkUser = await this._customerRepository.CustomerCheck(model.phone);
                if (checkUser <= 0)
                {
                    var validator = ValitRules<CustomerAddModel>
                        .Create()
                        .Ensure(m => m.name, rule => rule.Required())
                        .Ensure(m => m.phone, rule => rule.Required())
                        .Ensure(m => m.password, rule => rule.Required())


                        .For(model)
                        .Validate();

                    if (validator.Succeeded)
                    {
                        var checkadd = await this._customerRepository.CustomerCreate(model);
                        return checkadd == "0"
                            ? Ok(new ResponseSingleContentModel<string>
                            {
                                StatusCode = 200,
                                Message = "Tạo tài khoản thành công",
                                Data = string.Empty
                            })
                            : (IActionResult)Ok(new ResponseSingleContentModel<string>
                            {
                                StatusCode = 500,
                                Message = "Có lỗi trong quá trình xử lý " + checkadd,
                                Data = string.Empty
                            });
                    }

                    // Return invalidate data
                    return Ok(new ResponseSingleContentModel<string>
                    {
                        StatusCode = 400,
                        Message = validator.ErrorMessages.JoinNewLine(),
                        Data = string.Empty
                    });
                }
                return Ok(new ResponseSingleContentModel<string>
                {
                    StatusCode = 400,
                    Message = "Tài khoản, email hoặc số điện thoại đã được đăng ký vui lòng kiểm tra lại",
                    Data = string.Empty
                });
            }
            catch (Exception)
            {
                return this.RouteToInternalServerError();


            }
        }
        //  [Authorize(Roles = "CUSTOMERDETAIL")]
        [HttpGet("detail")]
        public async Task<IActionResult> Customer(long id)
        {
            try
            {
                var Customer = await this._customerRepository.Customer(id);
                return Ok(new ResponseSingleContentModel<CustomerModel>
                {
                    StatusCode = 200,
                    Message = "Success",
                    Data = Customer
                });

            }
            catch (Exception ex)
            {
                return this.RouteToInternalServerError();
            }
        }
        [HttpGet("affiliate-list")]
        public async Task<IActionResult> CustomerAfiliateList(string referral_code)
        {
            try
            {
                var response = await this._customerRepository.CustomerAfiliateList(referral_code);
                return Ok(new ResponseSingleContentModel<List<CustomerAffiliate>>
                {
                    StatusCode = 200,
                    Message = "Success",
                    Data = response
                });

            }
            catch (Exception ex)
            {
                return this.RouteToInternalServerError();
            }
        }
        [HttpGet("affiliate-list-contract")]
        public async Task<IActionResult> CustomerAffiliateContractList(long user_id)
        {
            try
            {
                var response = await this._customerRepository.CustomerAffiliateContractList(user_id);
                return Ok(new ResponseSingleContentModel<List<CustomerAffiliateContract>>
                {
                    StatusCode = 200,
                    Message = "Success",
                    Data = response
                });

            }
            catch (Exception ex)
            {
                return this.RouteToInternalServerError();
            }
        }

        //  [Authorize(Roles = "CUSTOMERLIST")]
        [HttpPost("list")]
        public async Task<IActionResult> CustomerList([FromBody] CustomerSearch model)
        {
            try
            {
                var Customer = await this._customerRepository.CustomerList(model);
                return Ok(new ResponseSingleContentModel<PaginationSet<CustomerModel>>
                {
                    StatusCode = 200,
                    Message = "Success",
                    Data = Customer
                });
            }
            catch (Exception ex)
            {
                return this.RouteToInternalServerError();

            }
        }
        // [Authorize(Roles = "CUSTOMERMODIFY")]
        [HttpPost("modify")]
        public async Task<IActionResult> CustomerModify([FromBody] CustomerModel model)
        {
            try
            {
                model.userUpdated = userid(_httpContextAccessor);
                var Customer = await this._customerRepository.CustomerModify(model);
                return Ok(new ResponseSingleContentModel<CustomerModel>
                {
                    StatusCode = 200,
                    Message = "Success",
                    Data = Customer
                });
            }
            catch (Exception ex)
            {
                return this.RouteToInternalServerError();
            }
        }
        // [Authorize(Roles = "CUSTOMERDELETE")]
        [HttpDelete("delete")]
        public async Task<IActionResult> CustomerDelete(long customer_id)
        {
            try
            {
                long user_id = userid(_httpContextAccessor);
                var response = await this._customerRepository.CustomerDelete(customer_id, user_id);
                if (response)
                {
                    return Ok(new ResponseSingleContentModel<bool>
                    {
                        StatusCode = 200,
                        Message = "Success",
                        Data = response
                    });
                }
                else
                    return this.RouteToInternalServerError();

            }
            catch (Exception ex)
            {
                return this.RouteToInternalServerError();


            }
        }
        [AllowAnonymous]
        [HttpGet("send-otp-regist")]
        public async Task<IActionResult> OTPCreateForRegister(string phone_number)
        {
            try
            {
                string check = await _customerRepository.OTPCreateForRegister(phone_number);
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
        [HttpGet("send-otp-login")]
        public async Task<IActionResult> OTPCreateForLogin(string phone_number)
        {
            try
            {
                string check = await _customerRepository.OTPCreateForLogin(phone_number);
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
                string check = await _customerRepository.CheckOTP(phone_number, otp);
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
        [HttpGet("login-otp")]
        public async Task<IActionResult> CustomerAuthenticateOPT(string phone_number, string otp)
        {
            try
            {
                CustomerLoginOTPModel check = await _customerRepository.CustomerAuthenticateOPT(phone_number, otp);
                CustomerTokenModel userAuthen = new();
                if (check.checkLogin == 4)
                {
                    CustomerClaimModel claim = new CustomerClaimModel
                    {
                        full_name = check.full_name,
                        id = check.customer_id,
                        username = check.username,
                    };
                    string tokenString = GenerateToken(claim);
                    userAuthen.token = tokenString;
                    userAuthen.id = check.customer_id;
                    userAuthen.username = check.username;
                    userAuthen.full_name = check.full_name;
                    userAuthen.token = tokenString;
                    CustomerModel customer = await _customerRepository.Customer(check.customer_id);
                    userAuthen.image = customer.image;
                    return Ok(new ResponseSingleContentModel<CustomerTokenModel>
                    {
                        StatusCode = 200,
                        Message = "Đăng nhập thành công",
                        Data = userAuthen
                    });
                }
                else
                {
                    string mess = "";
                    switch (check.checkLogin)
                    {
                        case 1: mess = "OTP đã hết hạn, vui lòng kiểm tra lại"; break;
                        case 2: mess = "OTP không chính xác, vui lòng kiểm tra lại"; break;
                        case 3: mess = "Tài khoản chưa tồn tại, vui lòng kiểm tra lại"; break;

                    }
                    return Ok(new ResponseSingleContentModel<string>
                    {
                        StatusCode = 500,
                        Message = mess,
                        Data = null
                    });
                }
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