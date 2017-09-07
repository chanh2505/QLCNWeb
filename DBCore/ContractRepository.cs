using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DBCore
{
    public class ContractRepository : IContractRepository
    {

        public Contract SaveContract(Contract contract)
        {
            try
            {
                if (!string.IsNullOrEmpty(contract.ContractNo) && contract.TotalValue.HasValue)
                {
                    using (QLCNEntities context = new QLCNEntities())
                    {
                        if (contract.Id > 0)
                        {
                            context.Entry(contract).State = EntityState.Modified;
                        }
                        else
                        {
                            context.Contract.Add(contract);
                        }
                        context.SaveChanges();
                    }
                }
            }
            catch (Exception ex)
            {
                var a = ex.Message;
            }
            return contract;
        }

        public IList<Contract> GetAllContract(bool isSale)
        {
            IList<Contract> result = new List<Contract>();
            try
            {
                using (QLCNEntities context = new QLCNEntities())
                {
                    var list = from p in context.Contract
                               where p.Id > 0 && p.IsSale == isSale
                               select p;
                    if (list != null && list.Any())
                    {
                        result = list.ToList();
                    }
                }
            }
            catch (Exception ex)
            {
                var a = ex.Message;
            }
            return result;
        }

        public Contract GetContractById(int id)
        {
            Contract result = null;
            try
            {
                using (QLCNEntities context = new QLCNEntities())
                {
                    var list = from p in context.Contract
                               where p.Id == id
                               select p;
                    if (list != null && list.Any())
                    {
                        result = list.FirstOrDefault();
                    }
                }
            }
            catch (Exception ex)
            {
                var a = ex.Message;
            }
            return result;
        }
        public int DeleteContract(int id)
        {
            var result = -1;
            try
            {
                using (QLCNEntities context = new QLCNEntities())
                {
                    //var check = context.Contract.FirstOrDefault(p => p.Contract == id);
                    //if (check == null)
                    //{
                    //    context.Entry(new Contract() { Id=id }).State = EntityState.Deleted;
                    //    context.SaveChanges();
                    //    result = 1;
                    //}
                    //else
                    //{
                    //    result = 0;
                    //}
                }
            }
            catch (Exception ex)
            {
                var a = ex.Message;
            }
            return result;
        }
    }
}
