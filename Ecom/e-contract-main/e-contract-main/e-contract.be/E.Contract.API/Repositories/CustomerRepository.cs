using AutoMapper;
using E.Contract.API.Entities;
using E.Contract.API.Extensions;
using E.Contract.API.IRepositories;
using E.Contract.API.Model;
using E.Contract.API.Model.Customer;
using E.Contract.API.Model.User;
using E.Contract.Extensions;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using static E.Contract.Extensions.Common;

namespace E.Contract.API.Repositories
{
    public class CustomerRepository : ICustomerRepository

    {
        private readonly ApplicationContext _context;
        private readonly IMapper _mapper;
        private readonly IContractFileRepository _file;

        public CustomerRepository(ApplicationContext context, IMapper mapper, IContractFileRepository fileRepository)
        {
            _mapper = mapper;
            _context = context;
            _file = fileRepository;
        }
        public Task<int> CustomerCheck(string phone)
        {
            int check = _context.Customer.Where(r => r.phone == phone).Count();
            return Task.FromResult(check);
        }
        public async Task<Customer> CustomerGetPhone(string phone)
        {
            Customer customer = new Customer();
            customer = _context.Customer.Where(r => r.phone == phone).FirstOrDefault();
            return customer;
        }
        public async Task<string> CustomerCreate(CustomerAddModel model)
        {

            return await Task.Run(() =>
            {
                string respons = "0";
                try
                {
                    Customer customer = new Customer
                    {
                        pass_code = Encryptor.RandomPassword(),
                        phone = model.phone,
                        code = "",
                        username = model.phone,
                        referral_code = model.referral_code,
                        name = model.name
                    };
                    customer.password = Encryptor.MD5Hash(model.password + customer.pass_code);
                    customer.dateAdded = DateTime.Now;
                    customer.is_active = true;
                    _context.Customer.Add(customer);
                    _context.SaveChanges();
                    customer.code = "SMG_CUS_" + customer.id;
                    _context.Customer.Update(customer);
                    _context.SaveChanges();
                }
                catch (Exception ex)
                {
                    respons = ex.Message;
                }
                return Task.FromResult(respons);
            });

        }
        public async Task<int> Authenticate(CustomerLoginModel login)
        {
            Customer user = await _context.Customer.Where(r => r.username.ToUpper() == login.username.ToUpper() || r.phone.ToUpper() == login.username.ToUpper() && !r.is_delete).FirstOrDefaultAsync();
            if (!user.is_active)
            {
                return -1;
            }
            else
            {
                var passWord = Encryptor.MD5Hash(login.password + user.pass_code);
                return passWord != user.password ? 2 : 1;
            }
        }
        public async Task<CustomerLoginOTPModel> CustomerAuthenticateOPT(string phone, string otp)
        {
            return await Task.Run(() =>
            {

                CustomerLoginOTPModel respon = new CustomerLoginOTPModel();
                DateTime DateLogin = DateTime.Now.AddMinutes(-6);
                SMS_OTP otpcheck = _context.SMS_OTP.Where(r => r.phone_number == phone && r.type == 1 && r.date_send > DateLogin).OrderByDescending(r => r.id).FirstOrDefault();
                if (otpcheck != null)
                {
                    if (otpcheck.otp == otp)
                    {
                        Customer customer = _context.Customer.Where(r => r.phone == phone && r.is_active).FirstOrDefault();
                        if (customer != null)
                        {
                            respon.customer_id = customer.id;
                            respon.full_name = customer.name;
                            respon.username = customer.username;
                            respon.checkLogin = 4;
                            otpcheck.is_delete = true;
                            _context.SMS_OTP.Update(otpcheck);
                            _context.SaveChanges();
                        }
                        else
                        {
                            respon.checkLogin = 3;
                        }
                    }
                    else
                        respon.checkLogin = 2;
                }
                else
                    respon.checkLogin = 1;
                return respon;
            });

        }
        public async Task<CustomerModel> Customer(long id)
        {
            return await Task.Run(async () =>
            {
                string tablename = Common.TableName.Customer.ToString();
                CustomerModel model = new CustomerModel();
                Customer customer = await _context.Customer.FirstOrDefaultAsync(r => r.id == id && !r.is_delete);
                if (customer != null)
                {
                    model = _mapper.Map<CustomerModel>(customer);
                    model.banks = _context.Customer_Bank.Where(x => x.customer_id == id).ToList();
                    model.image = _context.Contract_File.Where(x => x.tablename == tablename && x.idtable == id && !x.is_delete).OrderByDescending(x => x.id).FirstOrDefault();
                }

                return model;
            });
        }
        public async Task<List<CustomerAffiliate>> CustomerAfiliateList(string referral_code)
        {
            return await Task.Run(async () =>
            {
                IQueryable<CustomerAffiliate> listItem = from a in _context.Customer
                                                         where !a.is_delete && a.referral_code == referral_code
                                                         select new CustomerAffiliate
                                                         {
                                                             id = a.id,
                                                             name = a.name,
                                                             investment_money = (double)_context.Contracts.Where(x => x.customer_id == a.id && x.status >= 2).Select(x => x.amount_of_investment).Sum(),
                                                             amount_transferred = (double)_context.Transfers.Where(x => x.customer_id == a.id && x.status == 2).Select(x => x.transfer_amount).Sum(),
                                                             date_join = a.dateAdded
                                                         };
                List<CustomerAffiliate> data =await listItem.ToListAsync();
                return data;
            });
        }
        public async Task<List<CustomerAffiliateContract>> CustomerAffiliateContractList(long user_id)
        {
            return await Task.Run(async () =>
            {
                IQueryable<CustomerAffiliateContract> listItem = from a in _context.Contracts
                                                         where !a.is_delete && a.customer_id == user_id
                                                                 select new CustomerAffiliateContract
                                                         {
                                                                     user_id = a.customer_id    ,
                                                                     contract_id = a.id    ,
                                                                     investment_money = (double)a.amount_of_investment,
                                                                     date_confirm = a.active_time,
                                                                     status = a.status
                                                         };
                List<CustomerAffiliateContract> data =await listItem.ToListAsync();
                return data;
            });
        }
        public async Task<CustomerModel> CustomerModify(CustomerModel model)
        {
            return await Task.Run(() =>
            {
                //Customer customer = _mapper.Map<Customer>(model);
                Customer customer = _context.Customer.FirstOrDefault(x => x.id == model.id);
                customer.name = model.name;
                customer.address = model.address;
                customer.identity = model.identity;
                customer.phone = model.phone;
                customer.birthday = model.birthday;
                customer.taxcode = model.taxcode;
                string tablename = Common.TableName.Customer.ToString();
                if (model.image != null)
                {
                    var image = _context.Contract_File.AsNoTracking().Where(x => x.tablename == tablename && x.idtable == model.id && !x.is_delete).OrderByDescending(x => x.id).FirstOrDefault();
                    if (image == null)
                        _file.FileSingleCreate(model.image, tablename, model.id, 1);
                    else
                        _file.FileSingleModify(model.image, tablename, model.id, 1);
                }
                _context.Customer.Update(customer);
                _context.SaveChanges();
                var bankdb = _context.Customer_Bank.Where(x => x.customer_id == model.id).ToList();
                _context.Customer_Bank.RemoveRange(bankdb);
                foreach (var item in model.banks)
                {
                    item.customer_id = model.id;
                    item.dateAdded = DateTime.Now;
                    item.userAdded = model.userUpdated.Value;
                    item.id = 0;
                }
                _context.Customer_Bank.AddRange(model.banks);
                _context.SaveChanges();

                return Task.FromResult(model);
            });
        }
        public async Task<bool> CustomerDelete(long customer_id, long user_id)
        {
            return await Task.Run(() =>
            {
                var customer = _context.Customer.FirstOrDefault(x => x.id == customer_id);
                if (customer != null)
                {
                    customer.is_delete = true;
                    customer.dateUpdated = DateTime.Now;
                    customer.userUpdated = user_id;
                    _context.Customer.Update(customer);
                    _context.SaveChanges();

                }
                return Task.FromResult(true);
            });
        }
        public async Task<PaginationSet<CustomerModel>> CustomerList(CustomerSearch model)
        {
            string tablename = Common.TableName.Customer.ToString();
            await Task.CompletedTask;
            PaginationSet<CustomerModel> response = new PaginationSet<CustomerModel>();
            IQueryable<CustomerModel> listItem = from a in _context.Customer
                                                 where !a.is_delete
                                                 select new CustomerModel
                                                 {
                                                     id = a.id,
                                                     name = a.name,
                                                     phone = a.phone,
                                                     birthday = a.birthday,
                                                     identity = a.identity,
                                                     address = a.address,
                                                     referral_code = a.referral_code,
                                                     code = a.code,
                                                     dateAdded = a.dateAdded,
                                                     userAdded = a.userAdded,
                                                     taxcode = a.taxcode,
                                                     dateUpdated = a.dateUpdated,
                                                     userUpdated = a.userUpdated,
                                                     image = _context.Contract_File.Where(x => x.tablename == tablename && x.idtable == a.id && !x.is_delete).OrderByDescending(x => x.id).FirstOrDefault()
                                                 };

            if (model.keyword is not null and not "")
            {
                listItem = listItem.Where(r => r.name.Contains(model.keyword) || r.phone.Contains(model.keyword));
            }

            if (model.page_number > 0)
            {
                response.totalcount = listItem.Select(x => x.id).Count();
                response.page = model.page_number;
                response.maxpage = (int)Math.Ceiling((decimal)response.totalcount / model.page_size);
                response.lists = await listItem.OrderByDescending(r => r.dateAdded).Skip(model.page_size * (model.page_number - 1)).Take(model.page_size).ToListAsync();
            }
            else
            {
                response.lists = await listItem.OrderByDescending(r => r.dateAdded).ToListAsync();
            }
            return response;

        }
        public async Task<string> OTPCreateForRegister(string phone_number)
        {
            return await Task.Run(async () =>
            {
                string mess = "0";

                var user = _context.Customer.FirstOrDefault(r => r.phone == phone_number && !r.is_delete);
                if (user != null)
                {
                    mess = " Số điện thoại của bạn đã được đăng ký sử dụng user trong hệ thống  vui lòng liên hệ quản trị để được hỗ trợ";
                    return mess;
                }
                DateTime day_send = DateTime.Now.Date;
                var sendcheck = _context.SMS_OTP.Where(r => r.phone_number == phone_number && r.day_send == day_send && r.type == 0 && !r.is_delete).Count();
                if (sendcheck >= 5)
                {
                    mess = " Số điện thoại của bạn nhận quá số lượng otp được phép vui lòng kiểm tra lại";
                    return mess;
                }
                string otpsms = Encryptor.OTP();
                SMSExtensions SMS_services = new();
                string content = await SMS_services.SendOTPRegister(phone_number, otpsms);
                SMS_OTP oTP = new SMS_OTP();
                oTP.date_send = DateTime.Now;
                oTP.day_send = day_send;
                oTP.otp = otpsms;
                oTP.type = 0;
                if (content != "0")
                {
                    oTP.content = content;
                    oTP.send_status = true;
                }
                else
                {
                    oTP.content = content;
                    oTP.send_status = false;

                }
                oTP.phone_number = phone_number;
                _context.SMS_OTP.Add(oTP);
                _context.SaveChanges();
                return mess;
            });
        }
        public async Task<string> OTPCreateForLogin(string phone_number)
        {
            return await Task.Run(async () =>
            {
                string mess = "0";

                var user = _context.Customer.FirstOrDefault(r => r.phone == phone_number && !r.is_delete);
                if (user == null)
                {
                    mess = " Số điện thoại của bạn chưa đăng ký sử dụng user trong hệ thống, vui lòng liên hệ quản trị để được hỗ trợ";
                    return mess;
                }
                DateTime day_send = DateTime.Now.Date;
                var sendcheck = _context.SMS_OTP.Where(r => r.phone_number == phone_number && r.day_send == day_send && r.type == 1 && !r.is_delete).Count();
                if (sendcheck >= 5)
                {
                    mess = " Số điện thoại của bạn nhận quá số lượng otp được phép vui lòng kiểm tra lại";
                    return mess;
                }
                string otpsms = Encryptor.OTP();
                SMSExtensions SMS_services = new();
                string content = await SMS_services.SendOTPLogin(phone_number, otpsms);
                SMS_OTP oTP = new SMS_OTP();
                oTP.date_send = DateTime.Now;
                oTP.day_send = day_send;
                oTP.otp = otpsms;
                oTP.type = 1;
                if (content != "0")
                {
                    oTP.content = content;
                    oTP.send_status = true;
                }
                else
                {
                    oTP.content = content;
                    oTP.send_status = false;
                }
                oTP.phone_number = phone_number;
                _context.SMS_OTP.Add(oTP);
                _context.SaveChanges();
                return mess;
            });
        }
        public async Task<string> CheckOTP(string phone_number, string otp)
        {
            return await Task.Run(async () =>
            {
                string mess = "0";
                var sms_otp = _context.SMS_OTP.Where(r => r.phone_number == phone_number).OrderByDescending(r => r.id).FirstOrDefault();

                if (sms_otp == null)
                {
                    mess = "Mã của bạn không chính xác vui lòng kiểm tra lại";
                }
                else
                {
                    if (sms_otp.otp != otp)
                        mess = "Mã của bạn không chính xác vui lòng kiểm tra lại";
                    else
                    {
                        DateTime datenow = DateTime.Now;
                        sms_otp.is_delete = true;
                        _context.SMS_OTP.Update(sms_otp);
                        _context.SaveChanges();
                        if (datenow > sms_otp.date_send.AddMinutes(5))
                            mess = "Mã xác thực của bạn đã quá hạn vui lòng kiểm tra lại";
                    }
                }
                return mess;
            });
        }
    }
}
