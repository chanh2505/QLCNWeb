using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DBCore
{
    public class ProductOfContractRepository : IProductOfContractRepository
    {      

        public bool SaveProductOfContract(IList<ProductOfContract> list, int contractId)
        {
            var result = false;
            try
            {
                if (list !=null && list.Any())
                {
                    using (QLCNEntities context = new QLCNEntities())
                    {
                       foreach(var p in list)
                        {
                            if(p.Id > 0)
                            {
                                if(p.ContractId > 0)
                                {
                                    context.Entry(p).State = EntityState.Modified;
                                }
                                else
                                {
                                    context.Entry(p).State = EntityState.Deleted;
                                }
                                
                            }
                            else
                            {
                                p.ContractId = contractId;
                                p.Id = 0;
                                context.Entry(p).State = EntityState.Added;
                            }
                        }
                        context.SaveChanges();
                        result = true;
                    }
                }
            }
            catch (Exception ex)
            {
                var a = ex.Message;
            }
            return result;
        }

        public IList<ProductOfContract> GetProductOfContract(int contractId)
        {
            IList<ProductOfContract> result = new List<ProductOfContract>();
            try
            {
                using (QLCNEntities context = new QLCNEntities())
                {
                    var list = from p in context.ProductOfContract
                               where p.Id > 0 && p.ContractId == contractId
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
    }
}
