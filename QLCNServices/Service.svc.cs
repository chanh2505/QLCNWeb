using QLCNCore;
using QLCNServices.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.ServiceModel;
using System.ServiceModel.Activation;
using System.ServiceModel.Web;
using System.Text;
using Util.DTO;
using Util;

namespace QLCNServices
{
    [ServiceContract(Namespace = "")]
    [AspNetCompatibilityRequirements(RequirementsMode = AspNetCompatibilityRequirementsMode.Allowed)]
    public class Service
    {
        PartnerCore partnerCore = new PartnerCore();
        ProductCore productCore = new ProductCore();
        Util.Util util = new Util.Util();
        ContractCore contractCore = new ContractCore();
        #region Product
        [WebGet(ResponseFormat = WebMessageFormat.Json)]
        [OperationContract]
        public string GetData()
        {
            var a = new ProductCore();

            return a.getData();
        }

        [WebInvoke(Method = "POST", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        [OperationContract]
        public ProductEntity SaveProduct(ProductEntity product)
        {
            if (!string.IsNullOrEmpty(product.ProductName) && !string.IsNullOrEmpty(product.ProductCode))
            {
                var productDTO = productCore.SaveProduct(util.transform<ProductEntity, ProductDTO>(product));
                if (productDTO.ID > 0)
                {
                    product = util.transform<ProductDTO, ProductEntity>(productDTO);
                }
            }
            return product;
        }

        [WebInvoke(Method = "POST", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        [OperationContract]
        public bool DeleteProduct(ProductEntity product)
        {
            var result = false;
            if (product.ID.GetValueOrDefault() > 0)
            {
                result = productCore.DeleteProduct(product.ID.GetValueOrDefault());

            }
            return result;
        }

        [WebInvoke(Method = "GET", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        [OperationContract]
        public IList<ProductEntity> GetAllProduct()
        {
            var result = new List<ProductEntity>();
            var list = productCore.GetAllProduct();
            if (list != null && list.Any())
            {

                result = util.transformList<ProductDTO, ProductEntity>(list).ToList();
            }

            return result;
        }

        #endregion Product

        #region Partners

        [WebInvoke(Method = "POST", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        [OperationContract]
        public IList<PartnerEntity> GetAllPartners(PartnerEntity data)
        {
            var result = new List<PartnerEntity>();
            var list = partnerCore.GetAllPartner(data.IsSupplier);
            if (list != null && list.Any())
            {
                result = util.transformList<PartnerDTO, PartnerEntity>(list).ToList();
            }

            return result;
        }

        [WebInvoke(Method = "POST", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        [OperationContract]
        public PartnerEntity SavePartner(PartnerEntity partner)
        {
            if (!string.IsNullOrEmpty(partner.CompanyName) && !string.IsNullOrEmpty(partner.RepName) && !string.IsNullOrEmpty(partner.TaxCode) && !string.IsNullOrEmpty(partner.Mobile))
            {
                var partnerDTO = partnerCore.SavePartner(util.transform<PartnerEntity, PartnerDTO>(partner));
                if (partnerDTO.ID > 0)
                {
                    partner = util.transform<PartnerDTO, PartnerEntity>(partnerDTO);
                }
            }
            return partner;
        }

        [WebInvoke(Method = "POST", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        [OperationContract]
        public int DeletePartner(PartnerEntity partner)
        {
            var result = -1;
            if (partner.ID.GetValueOrDefault() > 0)
            {
                result = partnerCore.DeletePartner(partner.ID.GetValueOrDefault());

            }
            return result;
        }

        #endregion Partners

        #region Contract

        [WebInvoke(Method = "POST", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        [OperationContract]
        public ContractEntity SaveContract(ContractEntity contract)
        {
            if (!string.IsNullOrEmpty(contract.ContractNo) && contract.TotalValue > 0 && contract.listProduct != null && contract.listProduct.Any())
            {
                ContractDTO data = new ContractDTO
                {
                    ID = contract.ID,
                    ContractNo = contract.ContractNo,
                    Debt = contract.Debt,
                    Paid = contract.Paid,
                    Partner = contract.Partner,
                    PartnerName = contract.PartnerName,
                    IsSale = contract.IsSale,
                    TotalValue = contract.TotalValue,
                    IncludedVat = contract.IncludedVat,
                    listProduct = util.transformList<ProductOfContractEntity, ProductOfContractDTO>(contract.listProduct)
                };
                var contractDTO = contractCore.SaveContract(data);
                if (contractDTO.ID > 0)
                {
                    contract = util.transform<ContractDTO, ContractEntity>(contractDTO);
                }
            }
            return contract;
        }

        [WebInvoke(Method = "POST", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        [OperationContract]
        public IList<ContractEntity> GetAllContract(ContractEntity contract)
        {
            IList<ContractEntity> result = new List<ContractEntity>();

            var list = contractCore.GetAllContract(contract.IsSale);
            if (list != null && list.Any())
            {
                result = util.transformList<ContractDTO, ContractEntity>(list);
            }
            return result;
        }

        [WebInvoke(Method = "POST", RequestFormat = WebMessageFormat.Json, ResponseFormat = WebMessageFormat.Json)]
        [OperationContract]
        public ContractEntity GetContractById(ContractEntity contract)
        {
            ContractEntity result = new ContractEntity();
            if (contract?.ID > 0)
            {
                var res = contractCore.GetContractById(contract.ID);
                if (res != null && res.ID > 0)
                {
                    result.ID = res.ID;
                    result.IncludedVat = res.IncludedVat;
                    result.IsSale = res.IsSale;
                    result.Paid = res.Paid;
                    result.ContractNo = res.ContractNo;
                    result.Debt = res.Debt;
                    result.Partner = res.Partner;
                    result.PartnerName = res.PartnerName;
                    result.SubmitDate = res.SubmitDate;
                    result.TotalValue = res.TotalValue;
                    result.listProduct = util.transformList<ProductOfContractDTO,ProductOfContractEntity>(res.listProduct);
                }
            }
            return result;
        }

        #endregion Contract

        // Add more operations here and mark them with [OperationContract]
    }
}
