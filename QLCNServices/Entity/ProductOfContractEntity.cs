
using System.Runtime.Serialization;

namespace QLCNServices.Entity
{
    [DataContract]
    public class ProductOfContractEntity
    {
        [DataMember]
        public int ID { get; set; }
        [DataMember]
        public int ProductId { get; set; }
        [DataMember]
        public int ContractId { get; set; }
        [DataMember]
        public string Unit { get; set; }
        [DataMember]
        public int Amount { get; set; }
        [DataMember]
        public decimal Cost { get; set; }
        [DataMember]
        public decimal Price { get; set; }
        [DataMember]
        public decimal TotalCost { get; set; }
        [DataMember]
        public decimal TotalPrice { get; set; }
    }
}