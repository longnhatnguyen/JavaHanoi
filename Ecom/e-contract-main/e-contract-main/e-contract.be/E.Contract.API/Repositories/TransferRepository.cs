using AutoMapper;
using E.Contract.API.Entities;
using E.Contract.API.IRepositories;
using E.Contract.API.Model;
using E.Contract.API.Model.Transfer;
using E.Contract.Extensions;
using Microsoft.EntityFrameworkCore;

namespace E.Contract.API.Repositories
{
    public class TransferRepository : ITransfersRepository
    {
        private readonly ApplicationContext _context;
        private readonly IMapper _mapper;
        private readonly IContractFileRepository _file;
        public TransferRepository(ApplicationContext context, IMapper mapper, IContractFileRepository fileRepository)
        {
            _mapper = mapper;
            _context = context;
            _file = fileRepository;
        }
        public async Task<TransfersModel> TransfersCreate(TransfersModel model)
        {
            return await Task.Run(async () =>
            {
                string tablename = Common.TableName.Transfers.ToString();
                Transfers transfer = _mapper.Map<Transfers>(model);
                transfer.dateAdded = DateTime.Now;
                //transfer.status = 0;
                _context.Transfers.Add(transfer);
                _context.SaveChanges();
                if (model.image != null)
                {
                    _file.FileSingleCreate(model.image, tablename, transfer.id, 1);
                }

                model = _mapper.Map<TransfersModel>(transfer);
                model.image = _context.Contract_File.Where(r => r.tablename == tablename && r.idtable == transfer.id && !r.is_delete).OrderBy(r => r.id).FirstOrDefault();

                return model;
            });
        }
        public async Task<TransfersModel> TransfersUpdate(TransfersModel model)
        {
            return await Task.Run(() =>
            {
                string tablename = Common.TableName.Transfers.ToString();
                Transfers transfer = _mapper.Map<Transfers>(model);
                transfer.dateUpdated = DateTime.Now;
                _context.Transfers.Update(transfer);
                _context.SaveChanges();
                var image = _context.Contract_File.Where(r => r.tablename == tablename && r.idtable == model.id && !r.is_delete).OrderBy(r => r.id).FirstOrDefault();
                if (image != null)
                {
                    if (model.image != null)
                        _file.FileSingleModify(model.image, tablename, model.id, 1);
                    else
                        _file.FileSingleCreate(model.image, tablename, model.id, 1);
                }
                return Task.FromResult(model);
            });
        }
        public async Task<bool> TransfersUpdateStatus(long transfer_id, byte status_id, long user_id)
        {
            return await Task.Run(() =>
            {
                Transfers transfer = _context.Transfers.FirstOrDefault(x => x.id == transfer_id);
                if (transfer != null && status_id < 3)
                {
                    transfer.status = status_id;
                    transfer.userUpdated = user_id;
                    transfer.dateUpdated = DateTime.Now;
                    _context.Transfers.Update(transfer);
                    _context.SaveChanges();

                    var contract = _context.Contracts.FirstOrDefault(x => x.id == transfer.contract_id && !x.is_delete);
                    var transfers = _context.Transfers.Where(x => x.contract_id == transfer.contract_id && !x.is_delete && x.status == 2).ToList();
                    decimal transfer_cost = transfers.Sum(x => x.transfer_amount);
                    if (contract.amount_of_investment <= transfer_cost)
                    {
                        contract.status = 4;
                    }
                    _context.Contracts.Update(contract);
                    _context.SaveChanges();
                }
                return Task.FromResult(true);
            });
        }
        public async Task<bool> TransfersDelete(long Transfers_id, long user_id)
        {
            return await Task.Run(() =>
            {
                Transfers transfers = _context.Transfers.FirstOrDefault(x => x.id == Transfers_id);
                if (transfers != null)
                {
                    transfers.is_delete = true;
                    transfers.dateUpdated = DateTime.Now;
                    transfers.userUpdated = user_id;
                }

                _context.SaveChanges();
                return Task.FromResult(true);
            });
        }
        public async Task<TransfersModel> TransfersGetById(long id)
        {
            return await Task.Run(async () =>
            {
                string tablename = Common.TableName.Transfers.ToString();
                Transfers transferdb = await _context.Transfers.FirstOrDefaultAsync(r => r.id == id);
                if (transferdb == null)
                {
                    return null;
                }
                else
                {
                    TransfersModel transfer = _mapper.Map<TransfersModel>(transferdb);
                    var files = await _file.FileList(tablename, id);
                    if (files != null && files.Count > 0)
                    {
                        transfer.image = files[0];
                    }
                    return transfer;
                }
            });
        }
        public async Task<PaginationSet<TransfersModel>> TransfersList(SearchModel model)
        {
            return await Task.Run(() =>
            {
                string tablename = Common.TableName.Transfers.ToString();

                PaginationSet<TransfersModel> transfers = new PaginationSet<TransfersModel>();
                IEnumerable<TransfersModel> listItem = from a in _context.Transfers
                                                       where a.is_delete == false
                                                       select new TransfersModel
                                                       {
                                                           id = a.id,
                                                           userAdded = a.userAdded,
                                                           customer_id = a.customer_id,
                                                           contract_id = a.contract_id,
                                                           transfer_content = a.transfer_content,
                                                           bank_account = a.bank_account,
                                                           bank_name = a.bank_name,
                                                           status = a.status,
                                                           transfer_amount = a.transfer_amount,
                                                           userUpdated = a.userUpdated,
                                                           dateAdded = a.dateAdded,
                                                           dateUpdated = a.dateUpdated,
                                                           image = _context.Contract_File.Where(x => x.tablename == tablename && x.idtable == a.id && !x.is_delete).FirstOrDefault()
                                                       };
                if (model.keyword is not null and not "")
                {
                    listItem = listItem.Where(r => r.transfer_content.Contains(model.keyword));
                }
                if (model.customer_id is not null and not 0)
                {
                    listItem = listItem.Where(r => r.customer_id == model.customer_id);
                }
                if (model.contract_id is not null and not 0)
                {
                    listItem = listItem.Where(r => r.contract_id == model.contract_id);
                }
                if (model.page_number > 0)
                {
                    transfers.totalcount = listItem.Select(x => x.id).Count();
                    transfers.page = model.page_number;
                    transfers.maxpage = (int)Math.Ceiling((decimal)transfers.totalcount / model.page_size);
                    transfers.lists = listItem.OrderByDescending(r => r.id).Skip(model.page_size * (model.page_number - 1)).Take(model.page_size).ToList();
                }
                else
                {
                    transfers.lists = listItem.OrderByDescending(r => r.id).ToList();
                }
                return Task.FromResult(transfers);
            });
        }

        public async Task<TransfersPostModel> TransfersCreatePost(TransfersPostModel model)
        {
            return await Task.Run( () =>
            {
                Transfers gettrasfers = _context.Transfers.OrderByDescending(r => r.id).FirstOrDefault();
                if (gettrasfers.dateAdded < model.datepost)
                {
                    var contract = _context.Contracts.Where(o => o.contract_number == model.contract_number).SingleOrDefault();
                    if (contract != null)
                    {
                        Transfers transfer = new Transfers();
                        transfer.customer_id = contract.customer_id;
                        transfer.contract_id = contract.id;
                        transfer.transfer_content = model.transfer_content;
                        transfer.bank_account = model.bank_account;
                        transfer.bank_name = model.bank_name;
                        transfer.dateAdded = DateTime.Now;
                        _context.Transfers.Add(transfer);
                        _context.SaveChanges();
                        return Task.FromResult(model);
                    }
                    return Task.FromResult(model);
                }             
                return Task.FromResult(model);
            });

        }
    }
}
