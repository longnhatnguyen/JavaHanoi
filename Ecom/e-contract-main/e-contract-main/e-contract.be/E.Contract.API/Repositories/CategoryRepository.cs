using AutoMapper;
using E.Contract.API.Entities;
using E.Contract.API.IRepositories;
using E.Contract.API.Model;
using E.Contract.API.Model.Category;
using E.Contract.API.Model.Config;
using E.Contract.Extensions;
using Microsoft.EntityFrameworkCore;

namespace E.Contract.API.Repositories
{
    public class CategoryRepository : ICategoryRepository
    {
        private readonly ApplicationContext _context;
        private readonly IMapper _mapper;
        private readonly IContractFileRepository _contractFile;
        #region Category
        public CategoryRepository(ApplicationContext context, IMapper mapper, IContractFileRepository contractFile)
        {
            _mapper = mapper;
            _context = context;
            _contractFile = contractFile;
        }
        public async Task<Category_Ratio> CategoryRatio(long id)
        {

            var ratio = _context.Category_Ratio.Where(r => r.id == id && !r.is_delete).FirstOrDefault();

            return ratio;

        }
        public async Task<PaginationSet<Category_Ratio>> CategoryRatioList(string? keyword, int page_size, int page_number)
        {
            return await Task.Run(() =>
            {
                PaginationSet<Category_Ratio> response = new PaginationSet<Category_Ratio>();
                IEnumerable<Category_Ratio> listItem = _context.Category_Ratio.Where(r => !r.is_delete);

                if (keyword != null && keyword != "")
                {
                    listItem = listItem.Where(r => r.name.Contains(keyword));
                }

                if (page_number > 0)
                {
                    response.totalcount = listItem.Select(x => x.id).Count();
                    response.page = page_number;
                    response.maxpage = (int)Math.Ceiling((decimal)response.totalcount / page_size);
                    response.lists = listItem.OrderByDescending(r => r.id).Skip(page_size * (page_number - 1)).Take(page_size).ToList();
                }
                else
                {
                    response.lists = listItem.OrderByDescending(r => r.id).ToList();
                }
                return response;
            });
        }
        public async Task<Category_Ratio> CategoryRatioCreate(Category_Ratio category)
        {
            return await Task.Run(async () =>
            {
                category.dateAdded = DateTime.Now;
                _context.Category_Ratio.Add(category);
                _context.SaveChanges();
                return category;
            });
        }
        public async Task<Category_Ratio> CategoryRatioModify(Category_Ratio category)
        {
            return await Task.Run(async () =>
            {

                category.dateUpdated = DateTime.Now;
                _context.Category_Ratio.Update(category);

                _context.SaveChanges();
                return category;
            });
        }
        public async Task<bool> CategoryRatioDelete(long category_id, long user_id)
        {
            return await Task.Run(async () =>
            {
                var model = _context.Category_Ratio.Where(r => r.id == category_id).FirstOrDefault();
                if (model == null || model.id == 0)
                {
                    return false;
                }
                else
                {
                    model.userUpdated = user_id;
                    model.dateUpdated = DateTime.Now;
                    model.is_delete = true;
                    _context.Category_Ratio.Update(model);
                }
                _context.SaveChanges();
                return true;
            });
        }

        public async Task<Category_StoreModel> CategoryStore(long id)
        {
            string tablename = Common.TableName.Category_Store.ToString();


            var store = _context.Category_Store.Where(r => r.id == id && !r.is_delete).FirstOrDefault();
            Category_StoreModel model = _mapper.Map<Category_StoreModel>(store);
            model.files = _context.Contract_File.Where(r => r.tablename == tablename && r.idtable == id && !r.is_delete).OrderBy(r => r.id).ToList();
            return model;

        }
        public async Task<PaginationSet<Category_StoreViewModel>> CategoryStoreList(string? keyword, int? status, int page_size, int page_number, int? type)
        {
            return await Task.Run(async () =>
            {
                string tablename = Common.TableName.Category_Store.ToString();
                PaginationSet<Category_StoreViewModel> response = new PaginationSet<Category_StoreViewModel>();
                IQueryable<Category_StoreViewModel> listItem = from a in _context.Category_Store
                                                               where !a.is_delete
                                                               select new Category_StoreViewModel
                                                               {
                                                                   id = a.id,
                                                                   name = a.name,
                                                                   brand_value = a.brand_value,
                                                                   capital_value = a.capital_value,
                                                                   opening_day = a.opening_day,
                                                                   address = a.address,
                                                                   acreage = a.acreage,
                                                                   userAdded = a.userAdded,
                                                                   lat = a.lat,
                                                                   lng = a.lng,
                                                                   userUpdated = a.userUpdated,
                                                                   status = a.status,
                                                                   type = a.type,
                                                                   status_name = a.status_name,
                                                                   note = a.note,
                                                                   file = _context.Contract_File.Where(r => r.tablename == tablename && r.idtable == a.id).OrderBy(r => r.id).FirstOrDefault(),
                                                               };

                if (keyword is not null and not "")
                {
                    listItem = listItem.Where(r => r.name.Contains(keyword) || r.address.Contains(keyword));
                }
                if (status is not null)
                    listItem = listItem.Where(r => r.status == status);
                if (type is not null)
                    listItem = listItem.Where(r => r.type == type);

                if (page_number > 0)
                {
                    response.totalcount = listItem.Select(x => x.id).Count();
                    response.page = page_number;
                    response.maxpage = (int)Math.Ceiling((decimal)response.totalcount / page_size);
                    response.lists = await listItem.OrderByDescending(r => r.id).Skip(page_size * (page_number - 1)).Take(page_size).ToListAsync();
                }
                else
                {
                    response.lists = await listItem.OrderByDescending(r => r.id).ToListAsync();
                }
                return response;

            });
        }
        public async Task<Category_StoreModel> CategoryStoreCreate(Category_StoreModel model)
        {
            return await Task.Run(() =>
            {
                Category_Store store = _mapper.Map<Category_Store>(model);
                store.dateAdded = DateTime.Now;
                _context.Category_Store.Add(store);
                _context.SaveChanges();

                if (model.files != null)
                {
                    List<Contract_File> file = model.files;
                    // file.Add(certification);
                    _contractFile.FileCreate(file, Common.TableName.Category_Store.ToString(), store.id, 0);

                }
                model = _mapper.Map<Category_StoreModel>(store);
                return model;
            });
        }
        public async Task<Category_StoreModel> CategoryStoreModify(Category_StoreModel model)
        {
            return await Task.Run(() =>
            {
                Category_Store store = _context.Category_Store.FirstOrDefault(r => r.id == model.id);
                store.name = model.name;
                store.address = model.address;
                store.address = model.address;
                store.capital_value = model.capital_value;
                store.brand_value = model.brand_value;
                store.lat = model.lat;
                store.lng = model.lng;
                store.type = model.type;
                store.note = model.note;
                store.status = model.status;
                store.opening_day = model.opening_day;
                store.acreage = model.acreage;
                store.status_name = model.status_name;
                store.userUpdated = model.userUpdated;
                store.dateUpdated = DateTime.Now;
                _context.Category_Store.Update(store);
                _context.SaveChanges();

                if (model.files != null)
                {
                    List<Contract_File> file = model.files;
                    _contractFile.FileModify(file, Common.TableName.Category_Store.ToString(), store.id, 0);

                }
                model = _mapper.Map<Category_StoreModel>(store);
                return model;
            });
        }
        public async Task<bool> CategoryStoreDelete(long category_id, long user_id)
        {
            return await Task.Run(async () =>
            {
                var model = _context.Category_Store.Where(r => r.id == category_id).FirstOrDefault();
                if (model == null || model.id == 0)
                {
                    return false;
                }
                else
                {
                    model.userUpdated = user_id;
                    model.dateUpdated = DateTime.Now;
                    model.is_delete = true;
                    _context.Category_Store.Update(model);
                }
                _context.SaveChanges();
                return true;
            });
        }
        #endregion
        #region Config 
        public async Task<ConfigModel> Config()
        {
            string tablename = Common.TableName.Config.ToString();
            var configdb = _context.Config.Where(r => !r.is_delete).FirstOrDefault();
            ConfigModel model = _mapper.Map<ConfigModel>(configdb);
            model.image = _context.Contract_File.Where(r => r.tablename == tablename && r.idtable == model.id && !r.is_delete).OrderBy(r => r.id).FirstOrDefault();
            return model;
        }
        public async Task<ConfigModel> ConfigModify(ConfigModel model)
        {

            string tablename = Common.TableName.Config.ToString();
            var configdb = _context.Config.AsNoTracking().Where(r => !r.is_delete).FirstOrDefault();
            if (configdb == null)
            {
                Config config = _mapper.Map<Config>(model);
                _context.Config.Add(config);
                _context.SaveChanges();
                _contractFile.FileSingleCreate(model.image, tablename, config.id, 1);
            }
            else
            {
                Config config = _mapper.Map<Config>(model);
                _context.Config.Update(config);
                var image = _context.Contract_File.Where(r => r.tablename == tablename && r.idtable == model.id && !r.is_delete).OrderBy(r => r.id).FirstOrDefault();
                if (image != null)
                    _contractFile.FileSingleModify(model.image, tablename, config.id, 1);
                else
                    _contractFile.FileSingleCreate(model.image, tablename, config.id, 1);

                _context.SaveChanges();
            }
            return model;
        }

        #endregion


    }
}
