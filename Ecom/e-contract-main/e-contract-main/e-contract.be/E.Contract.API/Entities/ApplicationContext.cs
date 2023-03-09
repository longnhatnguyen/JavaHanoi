using Microsoft.EntityFrameworkCore;

namespace E.Contract.API.Entities
{
    public class ApplicationContext : DbContext
    {
        public ApplicationContext(DbContextOptions<ApplicationContext> options) : base(options)
        {
        }
        public virtual DbSet<Admin_User> Admin_User { set; get; }
        public virtual DbSet<Admin_Group> Admin_Group { set; get; }
        public virtual DbSet<Admin_Role> Admin_Role { set; get; }
        public virtual DbSet<Admin_Group_User> Admin_Group_User { set; get; }
        public virtual DbSet<Admin_Role_Group> Admin_Role_Group { set; get; }
        public virtual DbSet<Contracts> Contracts { set; get; }
        public virtual DbSet<Customer> Customer { set; get; }
        public virtual DbSet<Customer_Bank> Customer_Bank { set; get; }
        public virtual DbSet<Category_Store> Category_Store { set; get; }
        public virtual DbSet<SMS_OTP> SMS_OTP { set; get; }
        public virtual DbSet<Contract_File> Contract_File { set; get; }
        public virtual DbSet<Transfers> Transfers { set; get; }
        public virtual DbSet<Business_Info> Business_Info { set; get; }
        public virtual DbSet<Category_Ratio> Category_Ratio { set; get; }
        public virtual DbSet<Config> Config { set; get; }
        public virtual DbSet<Category_Investment_Package> Category_Investment_Package { set; get; }
        
    }
}
