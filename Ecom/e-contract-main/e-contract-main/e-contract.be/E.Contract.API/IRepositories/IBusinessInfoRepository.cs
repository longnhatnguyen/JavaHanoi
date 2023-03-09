using E.Contract.API.Entities;
using E.Contract.API.Model;

namespace E.Contract.API.IRepositories
{
    public interface IBusinessInfoRepository
    {
        Task<string> BusinessInfoCreate(Business_Info model);
        Task<Business_Info> BusinessInfoModify(Business_Info model);
        Task<Business_Info> BusinessInfo(long id);
        Task<bool> BusinessInfoDelete(long id);
        Task<PaginationSet<Business_Info>> BusinessInfoList(SearchBase search);
    }
}
