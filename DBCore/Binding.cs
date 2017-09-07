using Ninject;
using Ninject.Modules;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DBCore
{
    public class Binding : NinjectModule
    {
        public override void Load()
        {
            Bind<IProductRepository>().To<ProductRepository>();
            Bind<IPartnerRepository>().To<PartnerRepository>();
            Bind<IContractRepository>().To<ContractRepository>();
            Bind<IProductOfContractRepository>().To<ProductOfContractRepository>();
        }
    }
}
