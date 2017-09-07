using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace Util.DTO
{
    public class PartnerDTO
    {

        public int? ID { get; set; }

        public string CompanyName { get; set; }

        public decimal? Debt { get; set; }

        public string RepName { get; set; }

        public string TaxCode { get; set; }

        public bool IsSupplier { get; set; }

        public string Mobile { get; set; }

        public string Address { get; set; }

        public string CompanyPhone { get; set; }

    }
}