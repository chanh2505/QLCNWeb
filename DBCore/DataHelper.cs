using Ninject;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DBCore
{
    public class DataHelper
    {
        public IProductRepository ProductHelper;
        public IPartnerRepository PartnerHelper;
        public IContractRepository ContractHelper;
        public IProductOfContractRepository ProductOfContractHelper;
        public DataHelper()
        {
            IKernel kernel = new StandardKernel(
               new Binding()
           );

            ProductHelper = kernel.Get<IProductRepository>();
            PartnerHelper = kernel.Get<IPartnerRepository>();
            ContractHelper = kernel.Get<IContractRepository>();
            ProductOfContractHelper = kernel.Get<IProductOfContractRepository>();
        }
    }
}
