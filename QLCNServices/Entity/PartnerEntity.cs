using System.Runtime.Serialization;

namespace QLCNServices.Entity
{
    [DataContract]
    public class PartnerEntity
    {
        [DataMember]
        public int? ID { get; set; }
        [DataMember]
        public string CompanyName { get; set; }
        [DataMember]
        public decimal? Debt { get; set; }
        [DataMember]
        public string RepName { get; set; }
        [DataMember]
        public string TaxCode { get; set; }
        [DataMember]
        public bool IsSupplier { get; set; }
        [DataMember]
        public string Mobile { get; set; }
        [DataMember]
        public string Address { get; set; }
        [DataMember]
        public string CompanyPhone { get; set; }

    }
}