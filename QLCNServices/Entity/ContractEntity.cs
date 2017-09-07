using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace QLCNServices.Entity
{
    [DataContract]
    public class ContractEntity
    {
        [DataMember]
        public int ID { get; set; }
        [DataMember]
        public string ContractNo { get; set; }
        [DataMember]
        public decimal? TotalValue { get; set; }
        [DataMember]
        public DateTime? SubmitDate { get; set; }
        [DataMember]
        public decimal? Paid { get; set; }
        [DataMember]
        public decimal? Debt { get; set; }
        [DataMember]
        public string PartnerName { get; set; }
        [DataMember]
        public int Partner { get; set; }
        [DataMember]
        public bool IsSale { get; set; }
        [DataMember]
        public bool IncludedVat { get; set; }
        [DataMember]
        public IList<ProductOfContractEntity> listProduct { get; set; }
    }
}