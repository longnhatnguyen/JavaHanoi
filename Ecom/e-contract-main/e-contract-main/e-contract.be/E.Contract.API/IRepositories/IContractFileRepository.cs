using E.Contract.API.Entities;

namespace E.Contract.API.IRepositories
{
    public interface IContractFileRepository
    {
        void FileCreate(List<Contract_File> file, string table_name, long id, byte type = 1);
        void FileModify(List<Contract_File> file, string table_name, long id, byte type = 1);
        void FileSingleCreate(Contract_File file, string table_name, long id, byte type);
        void FileSingleModify(Contract_File file, string table_name, long id, byte type);

        Task<List<Contract_File>> FileList(string table_name, long id);
    }
}
