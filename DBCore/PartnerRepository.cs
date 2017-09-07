using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DBCore
{
    public class PartnerRepository : IPartnerRepository
    {
       

        public Partner SavePartner(Partner partner)
        {
            try
            {
                if (!string.IsNullOrEmpty(partner.CompanyName) && !string.IsNullOrEmpty(partner.RepName))
                {
                    using (QLCNEntities context = new QLCNEntities())
                    {
                        if (partner.Id > 0)
                        {
                            context.Entry(partner).State = EntityState.Modified;
                        }
                        else
                        {
                            context.Partner.Add(partner);
                        }
                        context.SaveChanges();
                        
                    }
                }
            }
            catch (Exception ex)
            {
                var a = ex.Message;
            }
            return partner;
        }

        public IList<Partner> GetAllPartner(bool isSupplier)
        {
            IList<Partner> result = new List<Partner>();
            try
            {
                using (QLCNEntities context = new QLCNEntities())
                {
                    var list = from p in context.Partner
                               where p.Id > 0 && p.IsSupplier == isSupplier
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
        public int DeletePartner(int id)
        {
            var result = -1;
            try
            {
                using (QLCNEntities context = new QLCNEntities())
                {
                    var check = context.Contract.FirstOrDefault(p => p.Partner == id);
                    if (check == null)
                    {
                        context.Entry(new Partner() { Id=id }).State = EntityState.Deleted;
                        context.SaveChanges();
                        result = 1;
                    }
                    else
                    {
                        result = 0;
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
