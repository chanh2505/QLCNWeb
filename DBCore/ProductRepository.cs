using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DBCore
{
    public class ProductRepository : IProductRepository
    {
        public IList<Product> GetProduct(Product p)
        {
            var result = new List<Product>();
            return result;
        }
        public string getData()
        {
            return "This is from Main Repository";
        }

        public Product SaveProduct(Product product)
        {
            try
            {
                if (!string.IsNullOrEmpty(product.ProductName) && !string.IsNullOrEmpty(product.ProductCode))
                {
                    using (QLCNEntities context = new QLCNEntities())
                    {
                        if (product.Id > 0)
                        {
                            //context.Product.Attach(product);
                            context.Entry(product).State = EntityState.Modified;
                        }
                        else
                        {
                            context.Product.Add(product);
                        }
                        context.SaveChanges();
                    }
                }
            }
            catch (Exception ex)
            {
                var a = ex.Message;
            }
            return product;
        }

        public IList<Product> GetAllProduct()
        {
            IList<Product> result = new List<Product>();
            try
            {
                using (QLCNEntities context = new QLCNEntities())
                {
                    var list = from p in context.Product
                               where p.Id > 0
                               select p;
                    if (list != null && list.Any())
                    {
                        result = list.ToList();
                    }
                }
            }
            catch (Exception ex)
            {
                var a = ex.Message;
            }
            return result;
        }
        public bool DeleteProduct(int id)
        {
            var result = false;
            try
            {
                using (QLCNEntities context = new QLCNEntities())
                {
                    var check = context.ProductOfContract.FirstOrDefault(p => p.IsActive == true && p.ProductId == id);
                    if (check == null)
                    {
                        context.Entry(new Product() { Id=id }).State = EntityState.Deleted;
                        context.SaveChanges();
                        result = true;
                    }
                }
            }
            catch (Exception ex)
            {
                var a = ex.Message;
            }
            return result;
        }
    }
}
