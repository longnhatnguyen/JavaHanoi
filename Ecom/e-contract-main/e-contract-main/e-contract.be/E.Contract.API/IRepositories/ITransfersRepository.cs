using E.Contract.API.Model;
using E.Contract.API.Model.Transfer;

namespace E.Contract.API.IRepositories
{
    public interface  ITransfersRepository
    {
        Task<TransfersModel> TransfersCreate(TransfersModel model);
        Task<TransfersModel> TransfersUpdate(TransfersModel model);
        Task<bool> TransfersUpdateStatus(long transfer_id, byte status_id, long user_id);
        Task<bool> TransfersDelete(long Transfers_id, long user_id);
        Task<TransfersModel> TransfersGetById(long id);
        Task<PaginationSet<TransfersModel>> TransfersList(SearchModel model);
        Task<TransfersPostModel> TransfersCreatePost(TransfersPostModel model);


    }
}
