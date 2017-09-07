using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DBCore
{
    public interface IContractRepository
    {
        Contract SaveContract(Contract contract);

        IList<Contract> GetAllContract(bool isSale);
        int DeleteContract(int id);
        Contract GetContractById(int id);
    }
}
