using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace QLCNServices.Entity
{
    [DataContract]
    public class ProductEntity
    {
        [DataMember]
        public int? ID { get; set; }
        [DataMember]
        public string ProductName { get; set; }
        [DataMember]
        public decimal? Price { get; set; }
        [DataMember]
        public string Unit { get; set; }
        [DataMember]
        public string ProductCode { get; set; }

    }
}