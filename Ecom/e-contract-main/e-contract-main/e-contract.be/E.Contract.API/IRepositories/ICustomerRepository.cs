using E.Contract.API.Entities;
using E.Contract.API.Model;
using E.Contract.API.Model.Customer;
using E.Contract.API.Model.User;

namespace E.Contract.API.IRepositories
{
    public interface ICustomerRepository
    {
        Task<int> CustomerCheck(string phone);
        Task<Customer> CustomerGetPhone(string phone);
        Task<int> Authenticate(CustomerLoginModel login);
        Task<CustomerLoginOTPModel> CustomerAuthenticateOPT(string phone, string otp);
        Task<string> CustomerCreate(CustomerAddModel model);
        Task<CustomerModel> Customer(long id);
        Task<List<CustomerAffiliate>> CustomerAfiliateList(string referral_code);
        Task<List<CustomerAffiliateContract>> CustomerAffiliateContractList(long user_id);
        Task<PaginationSet<CustomerModel>> CustomerList(CustomerSearch model);
        Task<CustomerModel> CustomerModify(CustomerModel model);
        Task<bool> CustomerDelete(long customer_id, long user_id);
        Task<string> OTPCreateForRegister(string phone_number);
        Task<string> OTPCreateForLogin(string phone_number);
        Task<string> CheckOTP(string phone_number, string otp);
    }
}
