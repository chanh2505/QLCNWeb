using DBCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Util.DTO;

namespace QLCNCore
{
    public class ContractCore
    {
        private DataHelper DataHelper;
        private Util.Util util = new Util.Util();

        public ContractCore()
        {
            DataHelper = new DataHelper();
        }
        public ContractDTO SaveContract(ContractDTO entity)
        {
            var res_Contract = new Contract()
            {
                Id = entity.ID,
                ContractNo = entity.ContractNo,
                TotalValue = entity.TotalValue,
                IncludedVat = entity.IncludedVat,
                Partner = entity.Partner,
                PartnerName = entity.PartnerName,
                Paid = entity.Paid,
                Debt = entity.Debt,
                IsSale = entity.IsSale
            };
            res_Contract = DataHelper.ContractHelper.SaveContract(res_Contract);
            if (res_Contract.Id > 0)
            {
                var listProduct = util.transformList<ProductOfContractDTO, ProductOfContract>(entity.listProduct);
                DataHelper.ProductOfContractHelper.SaveProductOfContract(listProduct, res_Contract.Id);
                entity = util.transform<Contract, ContractDTO>(res_Contract);
            }
            return entity;
        }

        public int DeleteContract(int id)
        {
            var res_Contract = DataHelper.ContractHelper.DeleteContract(id);

            return res_Contract;
        }

        public ContractDTO GetContractById(int id)
        {
            var result = new ContractDTO();
            if (id > 0)
            {
                var res = DataHelper.ContractHelper.GetContractById(id);
                if(res !=null)
                {
                    result = util.transform<Contract, ContractDTO>(res);
                    var listProduct = DataHelper.ProductOfContractHelper.GetProductOfContract(id);
                    if(listProduct!=null && listProduct.Any())
                    {
                        result.listProduct = util.transformList<ProductOfContract, ProductOfContractDTO>(listProduct);
                    }
                }
            }
            return result;
        }
        public IList<ContractDTO> GetAllContract(bool isSale)
        {
            var result = new List<ContractDTO>();
            var list = DataHelper.ContractHelper.GetAllContract(isSale);
            if (list != null && list.Any())
            {
                result = util.transformList<Contract, ContractDTO>(list).ToList();
            }
            return result;
        }
    }
}
