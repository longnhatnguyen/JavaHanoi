using E.Contract.API.Entities;
using E.Contract.API.IRepositories;
using Microsoft.EntityFrameworkCore;

namespace E.Contract.API.Repositories
{
    public class ContractFileRepository : IContractFileRepository
    {
        private readonly ApplicationContext _context;


        public ContractFileRepository(ApplicationContext context)
        {
            _context = context;
        }
        public void FileCreate(List<Contract_File> file, string table_name, long id, byte type)
        {
            foreach (var item in file)
            {
                item.tablename = table_name;
                item.idtable = id;
                item.type = type;
            }
            _context.Contract_File.AddRange(file);
            _context.SaveChanges();
        }
        public void FileModify(List<Contract_File> file, string table_name, long id, byte type)
        {
            foreach (var item in file)
            {
                if (item.id == 0)
                {
                    item.tablename = table_name;
                    item.idtable = id;
                    item.type = type;
                    _context.Contract_File.Add(item);
                }
                else
                {
                    _context.Entry(item).State = EntityState.Modified;

                }

            }
            _context.SaveChanges();
        }
        public void FileSingleCreate(Contract_File file, string table_name, long id, byte type)
        {

            file.tablename = table_name;
            file.idtable = id;
            file.type = type;

            _context.Contract_File.Add(file);
            _context.SaveChanges();
        }
        public void FileSingleModify(Contract_File file, string table_name, long id, byte type)
        {
            if (file.id == 0)
            {
                file.tablename = table_name;
                file.idtable = id;
                file.type = type;

                _context.Contract_File.Add(file);
            }
            else
            {
                file.type = type;
                _context.Entry(file).State = EntityState.Modified;

            }

            _context.SaveChanges();


        }
        public async Task<List<Contract_File>> FileList(string table_name, long id)
        {
            await Task.CompletedTask;
            List<Contract_File> file = new List<Contract_File>();
            file = _context.Contract_File.Where(x => x.tablename == table_name && x.idtable == id && !x.is_delete).ToList();
            return file;
        }


    }
}
