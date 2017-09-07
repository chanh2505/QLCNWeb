using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace Util.DTO
{
    public class ContractDTO
    {

        public int ID { get; set; }
        public string ContractNo { get; set; }
        public decimal? TotalValue { get; set; }
        public DateTime? SubmitDate { get; set; }
        public decimal? Paid { get; set; }
        public decimal? Debt { get; set; }
        public string PartnerName { get; set; }
        public int Partner { get; set; }
        public bool IsSale { get; set; }
        public bool IncludedVat { get; set; }
        public IList<ProductOfContractDTO> listProduct { get; set; }
    }
}