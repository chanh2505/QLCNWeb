using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DBCore
{
    public interface IProductOfContractRepository
    {
        bool SaveProductOfContract(IList<ProductOfContract> list, int contractId);

        IList<ProductOfContract> GetProductOfContract(int contractId);
       
    }
}
