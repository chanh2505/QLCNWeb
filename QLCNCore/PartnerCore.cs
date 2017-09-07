using DBCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Util.DTO;

namespace QLCNCore
{
    public class PartnerCore
    {
        private DataHelper DataHelper;
        private Util.Util util = new Util.Util();
        public PartnerCore()
        {
            DataHelper = new DataHelper();
        }
        public PartnerDTO SavePartner(PartnerDTO entity)
        {
            var res_Partner = util.transform<PartnerDTO, Partner>(entity);
            res_Partner = DataHelper.PartnerHelper.SavePartner(res_Partner);
            if(res_Partner.Id > 0)
            {
                entity = util.transform<Partner, PartnerDTO>(res_Partner);
            }
            return entity;
        } 

        public int DeletePartner(int id)
        {
            var res_Partner = DataHelper.PartnerHelper.DeletePartner(id);
            
            return res_Partner;
        }

        public IList<PartnerDTO> GetAllPartner(bool isSupplier)
        {
            var result = new List<PartnerDTO>();
            var list = DataHelper.PartnerHelper.GetAllPartner(isSupplier);
            if (list != null && list.Any())
            {
                result = util.transformList<Partner, PartnerDTO>(list).ToList();
            }
            return result;
        }
    }
}
