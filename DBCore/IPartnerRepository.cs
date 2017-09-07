using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DBCore
{
    public interface IPartnerRepository
    {
        Partner SavePartner(Partner partner);

        IList<Partner> GetAllPartner(bool isSupplier);
        int DeletePartner(int id);
    }
}
