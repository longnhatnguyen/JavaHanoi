using AutoMapper;
using E.Contract.API.Entities;
using E.Contract.API.Extensions;
using E.Contract.API.IRepositories;
using E.Contract.API.Model;
using E.Contract.API.Model.Contract;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage;
using Syncfusion.DocIO;
using Syncfusion.DocIO.DLS;
using Syncfusion.DocIORenderer;
using Syncfusion.Pdf;

namespace E.Contract.API.Repositories
{

    public class ContractRepository : IContractRepository
    {
        private readonly ApplicationContext _context;
        private readonly IMapper _mapper;
        public ContractRepository(ApplicationContext context, IMapper mapper)
        {
            _mapper = mapper;
            _context = context;
        }

        public async Task<ContractModel> ContractCreate(ContractModel model)
        {
            return await Task.Run(() =>
            {
                using (IDbContextTransaction transaction = _context.Database.BeginTransaction())
                {
                    try
                    {
                        Contracts contract = _mapper.Map<Contracts>(model);
                        contract.dateAdded = DateTime.Now;
                        contract.status = 0;
                        contract.contract_path = String.Empty;
                        _context.Contracts.Add(contract);
                        _context.SaveChanges();
                        string number = contract.id.ToString();
                        for (int i = number.Length; i < 5; i++)
                        {
                            number = "0" + number;
                        }
                        contract.contract_number = "HD" + number + "/ HTDT" + DateTime.Now.Year + "/SMG";
                        _context.Contracts.Update(contract);
                        _context.SaveChanges();
                        model = _mapper.Map<ContractModel>(contract);
                        transaction.Commit();
                        return model;
                    }
                    catch (Exception ex)
                    {
                        transaction.Rollback();
                        throw ex;
                    }
                }
            });
        }
        public async Task<ContractModel> ContractUpdate(ContractModel model)
        {
            return await Task.Run(() =>
            {
                Contracts contract = _mapper.Map<Contracts>(model);
                contract.contract_path = String.Empty;
                contract.dateUpdated = DateTime.Now;
                _context.Contracts.Update(contract);
                _context.SaveChanges();
                return Task.FromResult(model);
            });
        }


        public async Task<bool> ContractUpdateStatus(long contract_id, int status_id, long user_id)
        {
            return await Task.Run(async () =>
            {
                using (IDbContextTransaction transaction = _context.Database.BeginTransaction())
                {
                    try
                    {
                        Contracts contract = await _context.Contracts.FirstOrDefaultAsync(x => x.id == contract_id && !x.is_delete);
                        if (contract != null && status_id < 4)
                        {
                            if (contract.status == 2)
                            {
                                contract.contract_signature_date = DateTime.Now;
                            }
                            contract.status = status_id;
                            contract.userUpdated = user_id;
                            contract.dateUpdated = DateTime.Now;
                            _context.Contracts.Update(contract);
                            _context.SaveChanges();
                            transaction.Commit();
                        }
                        return true;
                    }
                    catch (Exception ex)
                    {
                        transaction.Rollback();
                        return false;
                    }
                }
            });
        }


        public async Task<bool> ContractDelete(long Contracts_id, long user_id)
        {
            return await Task.Run(async () =>
            {
                Contracts Contractss = _context.Contracts.FirstOrDefault(x => x.id == Contracts_id && !x.is_delete);
                if (Contractss != null)
                {
                    Contractss.is_delete = true;
                    Contractss.dateUpdated = DateTime.Now;
                    Contractss.userUpdated = user_id;
                }

                _context.SaveChanges();
                return true;
            });
        }
        public async Task<ContractModel> ContractGetById(long id)
        {
            return await Task.Run(async () =>
            {
                Contracts contractdb = await _context.Contracts.FirstOrDefaultAsync(r => r.id == id && !r.is_delete);
                ContractModel contract = _mapper.Map<ContractModel>(contractdb);
                return contract;
            });
        }
       
        public async Task<PaginationSet<ContractModel>> ContractList(ContractSearchModel model)
        {
            return await Task.Run(async () =>
            {
                PaginationSet<ContractModel> suppliers = new PaginationSet<ContractModel>();
                IEnumerable<ContractModel> listItem = from a in _context.Contracts
                                                      where a.is_delete == false
                                                      select new ContractModel
                                                      {
                                                          id = a.id,
                                                          userAdded = a.userAdded,
                                                          customer_id = a.customer_id,
                                                          contract_signature_date = a.contract_signature_date,
                                                          customer_deputy = a.customer_deputy,
                                                          customer_position = a.customer_position,
                                                          customer_phone = a.customer_phone,
                                                          customer_email = a.customer_email,
                                                          customer_enterprise_short_name = a.customer_enterprise_short_name,
                                                          customer_enterprise_name = a.customer_enterprise_name,
                                                          customer_enterprise_code = a.customer_enterprise_code,
                                                          customer_address = a.customer_address,
                                                          customer_tax_code = a.customer_tax_code,
                                                          customer_account_number = a.customer_account_number,
                                                          customer_bank_name = a.customer_bank_name,
                                                          customer_bank_account_id = a.customer_bank_account_id,
                                                          customer_id_number = a.customer_id_number,
                                                          customer_date_of_birth = a.customer_date_of_birth,
                                                          contract_number = a.contract_number,
                                                          amount_of_investment = a.amount_of_investment,
                                                          number_of_shares = a.number_of_shares,
                                                          investment_id = a.investment_id,
                                                          active_time = a.active_time,
                                                          end_time = a.end_time,
                                                          profit_percentage = a.profit_percentage,
                                                          status = a.status,
                                                          validation_type = a.validation_type,
                                                          amount_paid = _context.Transfers.Where(x => x.contract_id == a.id && !x.is_delete && x.status == 2).Sum(x => x.transfer_amount),
                                                          note = a.note,
                                                          type = a.type,
                                                          userUpdated = a.userUpdated,
                                                          dateAdded = a.dateAdded,
                                                          dateUpdated = a.dateUpdated,

                                                      };
                if (model.keyword is not null and not "")
                {
                    listItem = listItem.Where(r => r.customer_deputy.Contains(model.keyword) || r.customer_deputy.Contains(model.keyword) ||
                    r.customer_phone.Contains(model.keyword) || r.customer_email.Contains(model.keyword) || r.customer_address.Contains(model.keyword) || r.customer_tax_code.Contains(model.keyword));
                }
                if (model.customer_id is not null and not 0)
                {
                    listItem = listItem.Where(r => r.customer_id == model.customer_id);
                }
                if (model.page_number > 0)
                {
                    suppliers.totalcount = listItem.Select(x => x.id).Count();
                    suppliers.page = model.page_number;
                    suppliers.maxpage = (int)Math.Ceiling((decimal)suppliers.totalcount / model.page_size);
                    suppliers.lists = listItem.OrderByDescending(r => r.id).Skip(model.page_size * (model.page_number - 1)).Take(model.page_size).ToList();
                }
                else
                {
                    suppliers.lists = listItem.OrderByDescending(r => r.id).ToList();
                }
                return suppliers;
            });
        }

        public async Task<string> GenPDF(long contract_id)
        {

            using (IDbContextTransaction transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    var contract_db = await _context.Contracts.FirstOrDefaultAsync(x => x.id == contract_id && !x.is_delete);
                    if (contract_db == null)
                        return "";

                    if (!string.IsNullOrEmpty(contract_db.contract_path) && File.Exists(contract_db.contract_path))
                    {
                        var check = contract_db.status >= 2 && !contract_db.contract_path.Contains("/done");
                        if (contract_db.status < 2 || !check)
                        {
                            return contract_db.contract_path;
                        }
                    }
                    var sFileNameExport = CreateFilePdf(contract_db);
                    contract_db.contract_path = sFileNameExport;
                    _context.Contracts.Update(contract_db);
                    _context.SaveChanges();

                    transaction.Commit();
                    return sFileNameExport;
                }
                catch (Exception ex)
                {
                    transaction.Rollback();
                    throw ex;
                }
            }

        }

        private string CreateFilePdf(Contracts contract_db)
        {
            var filenamegui = Guid.NewGuid().ToString();
            //var filedev = @"E:/SmartGap/E contract/electronic_contract/E.Contract/E.Contract.API/Template/TemplateHD.docx";
            //var filesavedev = @"E:/SmartGap/E contract/data/";
            string fileName = Path.Combine("/app/Template/TemplateHD.docx");
            var folderName = contract_db.status >= 2 ? @"/data/econtract_files/dh/done/" : @"/data/econtract_files/dh/";
            string pathToSave = Path.Combine(Directory.GetCurrentDirectory(), folderName);
            if (!Directory.Exists(pathToSave))
            {
                Directory.CreateDirectory(pathToSave);
            }
            if (!File.Exists(fileName))
            {
                return "not exist File:" + fileName;
            }

            string sFileNameExport = Path.Combine(pathToSave, filenamegui + ".pdf");

            FileStream fileStreamPath = new FileStream(fileName, FileMode.Open, FileAccess.Read, FileShare.ReadWrite);
            WordDocument doc = new WordDocument(fileStreamPath, FormatType.Docx);

            doc.Replace("@customer_deputy", contract_db.customer_deputy, true, true);
            if (contract_db.customer_position != null)
            {
                doc.Replace("@customer_position", contract_db.customer_position, true, true);

            }
            doc.Replace("@customer_position", "", true, true);

            doc.Replace("@contract_number", contract_db.contract_number, true, true);
            doc.Replace("@customer_phone", contract_db.customer_phone, true, true);
            doc.Replace("@customer_email", contract_db.customer_email, true, true);
            doc.Replace("@customer_address", contract_db.customer_address, true, true);
            doc.Replace("@customer_tax_code", contract_db.customer_tax_code, true, true);
            doc.Replace("@customer_account_number", contract_db.customer_account_number, true, true);
            doc.Replace("@customer_bank_name", contract_db.customer_bank_name, true, true);
            doc.Replace("@customer_id_number", contract_db.customer_id_number, true, true);
            doc.Replace("@issuance_date", contract_db.issuance_date.ToString("dd/MM/yyyy"), true, true);
            doc.Replace("@passport_issuer", contract_db.passport_issuer, true, true);
            doc.Replace("@customer_date_of_birth", contract_db.customer_date_of_birth.ToString("dd/MM/yyyy"), true, true);
            doc.Replace("@amount_of_investment", contract_db.amount_of_investment.ToString("N0"), true, true);
            doc.Replace("@number_of_shares", contract_db.number_of_shares.ToString("N0"), true, true);
            doc.Replace("@profit_percentage", contract_db.profit_percentage.ToString("N2"), true, true);
            doc.Replace("@amount_investment_text", Utils.NumberToText((double)contract_db.amount_of_investment), true, true);

            var signDate = contract_db.status >= 2 ? contract_db.contract_signature_date : DateTime.Now;
            doc.Replace("@day", signDate.Day.ToString(), true, true);
            doc.Replace("@month", signDate.Month.ToString(), true, true);
            doc.Replace("@year", signDate.Year.ToString(), true, true);

            string dateSign = contract_db.status >= 2 ?
                string.Format("{0}h {1}p ngày {2} tháng {3} năm {4}", signDate.Hour, signDate.Minute, signDate.Day, signDate.Month, signDate.Year)
                 : string.Empty;

            doc.Replace("@date_sign", dateSign, true, true);

            var startDate = contract_db.active_time;
            doc.Replace("@day_start", signDate.Day.ToString(), true, true);
            doc.Replace("@month_start", signDate.Month.ToString(), true, true);
            doc.Replace("@year_start", signDate.Year.ToString(), true, true);

            var endDate = contract_db.end_time;
            doc.Replace("@day_end", endDate.Day.ToString(), true, true);
            doc.Replace("@month_end", endDate.Month.ToString(), true, true);
            doc.Replace("@year_end", endDate.Year.ToString(), true, true);


            DocIORenderer render = new DocIORenderer();
            render.Settings.ChartRenderingOptions.ImageFormat = Syncfusion.OfficeChart.ExportImageFormat.Jpeg;
            render.Settings.EmbedFonts = true;
            PdfDocument pdfDocument = render.ConvertToPDF(doc);
            render.Dispose();
            doc.Dispose();
            FileStream outputStream = new FileStream(sFileNameExport, FileMode.Create, FileAccess.ReadWrite, FileShare.ReadWrite);
            pdfDocument.Save(outputStream);
            pdfDocument.Close();
            outputStream.Flush();
            outputStream.Dispose();
            return sFileNameExport;
        }

        public async Task<string> OTPCreateForContract(string phone_number, string contract_code)
        {
            return await Task.Run(async () =>
            {
                string mess = "0";
                string otpsms = Encryptor.OTP();
                SMSExtensions SMS_services = new();
                string content = await SMS_services.SendOTPContract(phone_number, otpsms, contract_code);
                SMS_OTP oTP = new SMS_OTP();
                oTP.date_send = DateTime.Now;
                oTP.day_send = DateTime.Now;
                oTP.otp = otpsms;
                oTP.type = 2;
                if (content != "0")
                {
                    oTP.content = content;
                    oTP.send_status = true;
                }
                else
                {
                    oTP.content = content;
                    oTP.send_status = false;
                }
                oTP.phone_number = phone_number;
                _context.SMS_OTP.Add(oTP);
                _context.SaveChanges();
                return mess;
            });
        }
        public async Task<string> CheckOTP(string phone_number, string otp)
        {
            return await Task.Run(async () =>
            {
                string mess = "0";
                var sms_otp = _context.SMS_OTP.Where(r => r.phone_number == phone_number && r.type == 2).OrderByDescending(r => r.id).FirstOrDefault();
                if (sms_otp == null)
                {
                    mess = "Mã của bạn không chính xác vui lòng kiểm tra lại";
                }
                else
                {
                    if (sms_otp.otp != otp)
                        mess = "Mã của bạn không chính xác vui lòng kiểm tra lại";
                    else
                    {
                        DateTime datenow = DateTime.Now;
                        sms_otp.is_delete = true;
                        _context.SMS_OTP.Update(sms_otp);
                        _context.SaveChanges();
                        if (datenow > sms_otp.date_send.AddMinutes(5))
                            mess = "Mã xác thực của bạn đã quá hạn vui lòng kiểm tra lại";
                    }
                }
                return mess;
            });
        }


    }
}
