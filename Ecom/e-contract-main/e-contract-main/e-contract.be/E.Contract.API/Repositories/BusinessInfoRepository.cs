using AutoMapper;
using E.Contract.API.Entities;
using E.Contract.API.IRepositories;
using E.Contract.API.Model;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;

namespace E.Contract.API.Repositories
{
    public class BusinessInfoRepository : IBusinessInfoRepository
    {

        private readonly ApplicationContext _context;
        private readonly IMapper _mapper;
        public BusinessInfoRepository(ApplicationContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
        }
        public async Task<Business_Info> BusinessInfo(long id)
        {
            return await Task.Run(() =>
            {
                return _context.Business_Info.FirstOrDefault(r => r.id == id);
            });
        }
        public async Task<string> BusinessInfoCreate(Business_Info model)
        {
            return await Task.Run(() =>
            {
                using (IDbContextTransaction transaction = _context.Database.BeginTransaction())
                {
                    string response = "0";
                    try
                    {
                        model.dateAdded = DateTime.Now;
                        _context.Business_Info.Add(model);
                        _context.SaveChanges();
                        transaction.Commit();
                        return response;
                    }
                    catch (Exception ex)
                    {
                        response = ex.Message + " - " + ex.StackTrace;
                        return response;
                    }
                }
            });
        }
        public async Task<Business_Info> BusinessInfoModify(Business_Info model)
        {
            return await Task.Run(() =>
            {
                using (IDbContextTransaction transaction = _context.Database.BeginTransaction())
                {
                    string response = "0";
                    try
                    {

                        _context.Business_Info.Update(model);
                        _context.SaveChanges();
                        transaction.Commit();
                        return model;
                    }
                    catch (Exception ex)
                    {
                        transaction.Rollback();
                        response = ex.Message + " - " + ex.StackTrace;
                        return model;
                    }
                }
                return model;
            });
        }
        public async Task<bool> BusinessInfoDelete(long id)
        {
            return await Task.Run(() =>
            {
                using (IDbContextTransaction transaction = _context.Database.BeginTransaction())
                {
                    try
                    {
                        Business_Info bankAccount = _context.Business_Info.FirstOrDefault(r => r.id == id);
                        bankAccount.is_delete = true;
                        _context.Business_Info.Update(bankAccount);
                        _context.SaveChanges();
                        transaction.Commit();
                        return true;
                    }
                    catch (Exception ex)
                    {
                        return false;
                    }
                }
                return true;
            });
        }

        public async Task<PaginationSet<Business_Info>> BusinessInfoList(SearchBase search)
        {

            PaginationSet<Business_Info> response = new PaginationSet<Business_Info>();
            IEnumerable<Business_Info> listItem = _context.Business_Info.Where(r => !r.is_delete);

            if (search.start_date != null)
            {
                listItem = listItem.Where(r => r.date >= search.start_date);
            }
            if (search.end_date != null)
            {
                listItem = listItem.Where(r => search.end_date.Value >= r.date);
            }

            if (search.page_number > 0)
            {
                response.totalcount = listItem.Select(x => x.id).Count();
                response.page = search.page_number;
                response.maxpage = (int)Math.Ceiling((decimal)response.totalcount / search.page_size);
                response.lists = listItem.OrderByDescending(r => r.id).Skip(search.page_size * (search.page_number - 1)).Take(search.page_size).ToList();
            }
            else
            {
                response.lists = listItem.OrderByDescending(r => r.id).ToList();
            }
            return response;

        }
    }
}
