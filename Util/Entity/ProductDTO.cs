using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace Util.DTO
{
    public class ProductDTO
    {
        public int ID { get; set; }
        public string ProductName { get; set; }
        public double Price { get; set; }
        public string Unit { get; set; }
        public string ProductCode { get; set; }

    }
}