using E.Contract.API.Entities;
using E.Contract.API.Model;
using E.Contract.API.Model.Category;
using E.Contract.API.Model.Config;

namespace E.Contract.API.IRepositories
{
    public interface ICategoryRepository
    {
        Task<Category_Ratio> CategoryRatio(long id);
        Task<PaginationSet<Category_Ratio>> CategoryRatioList(string? keyword, int page_size, int page_number);
        Task<Category_Ratio> CategoryRatioCreate(Category_Ratio product);
        Task<Category_Ratio> CategoryRatioModify(Category_Ratio product);
        Task<bool> CategoryRatioDelete(long category_id, long user_id);

        Task<Category_StoreModel> CategoryStore(long id);
        Task<PaginationSet<Category_StoreViewModel>> CategoryStoreList(string? keyword, int? status, int page_size, int page_number,int? type);
        Task<Category_StoreModel> CategoryStoreCreate(Category_StoreModel model);
        Task<Category_StoreModel> CategoryStoreModify(Category_StoreModel model);
        Task<bool> CategoryStoreDelete(long category_id, long user_id);
        Task<ConfigModel> Config();
        Task<ConfigModel> ConfigModify(ConfigModel model);

    }
}
