using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace Util.DTO
{
    public class ProductOfContractDTO
    {

        public int ID { get; set; }
        
        public int ProductId { get; set; }

        public int ContractId { get; set; }

        public string Unit { get; set; }
        
        public int Amount { get; set; }
        
        public decimal Cost { get; set; }
        
        public decimal Price { get; set; }
        
        public decimal TotalCost { get; set; }
        
        public decimal TotalPrice { get; set; }
    }
}