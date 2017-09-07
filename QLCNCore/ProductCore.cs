using DBCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Util.DTO;

namespace QLCNCore
{
    public class ProductCore
    {
        private DataHelper DataHelper;
        private Util.Util util = new Util.Util();
        public ProductCore()
        {
            DataHelper = new DataHelper();
        }
        public string getData()
        {
            return DataHelper.ProductHelper.getData();
        }

        public ProductDTO SaveProduct(ProductDTO entity)
        {
            var res_Product = util.transform<ProductDTO, Product>(entity);
            res_Product = DataHelper.ProductHelper.SaveProduct(res_Product);
            if(res_Product.Id > 0)
            {
                entity = util.transform<Product, ProductDTO>(res_Product);
            }
            return entity;
        } 

        public bool DeleteProduct(int id)
        {
            var res_Product = DataHelper.ProductHelper.DeleteProduct(id);
            
            return res_Product;
        }

        public IList<ProductDTO> GetAllProduct()
        {
            var result = new List<ProductDTO>();
            var list = DataHelper.ProductHelper.GetAllProduct();
            if (list != null && list.Any())
            {
                result = util.transformList<Product, ProductDTO>(list).ToList();
            }
            return result;
        }
    }
}
