using AutoMapper;
using E.Contract.API.Entities;
using E.Contract.API.Model.Category;
using E.Contract.API.Model.Config;
using E.Contract.API.Model.Contract;
using E.Contract.API.Model.Customer;
using E.Contract.API.Model.Transfer;
using E.Contract.API.Model.User;

namespace E.Contract.API.Mapper
{
    public class AddAutoMapper : Profile
    {
        public AddAutoMapper()
        {
            CreateMap<Admin_User, UserCreateModel>();
            CreateMap<UserCreateModel, Admin_User>();

            CreateMap<Admin_User, UserModifyModel>();
            CreateMap<UserModifyModel, Admin_User>();

            CreateMap<Admin_User, UserModel>();

            CreateMap<CustomerModel, Customer>();
            CreateMap<Customer, CustomerModel>(); 
            
            
            CreateMap<ContractModel, Contracts>();
            CreateMap<Contracts, ContractModel>();     
            
            CreateMap<Transfers, TransfersModel>();
            CreateMap<TransfersModel, Transfers>(); 
            
            CreateMap<Config, ConfigModel>();
            CreateMap<ConfigModel, Config>();

            CreateMap<Category_Store, Category_StoreModel>();
            CreateMap<Category_StoreModel, Category_Store>();
        }
    }
}
