using E.Contract.API.Model;
using E.Contract.API.Model.Contract;

namespace E.Contract.API.IRepositories
{
    public interface IContractRepository
    {
        Task<ContractModel> ContractCreate(ContractModel model);
        Task<ContractModel> ContractUpdate(ContractModel model);
        Task<bool> ContractUpdateStatus(long contract_id, int status_id, long user_id);
        Task<bool> ContractDelete(long contract_id, long user_id);
        Task<ContractModel> ContractGetById(long id);
        Task<PaginationSet<ContractModel>> ContractList(ContractSearchModel model);
        Task<string> GenPDF(long contract_id);
        Task<string> OTPCreateForContract(string phone_number, string contract_code);
        Task<string> CheckOTP(string phone_number, string otp);
    }
}
