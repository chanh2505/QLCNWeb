using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DBCore
{
    public interface IProductRepository
    {
        IList<Product> GetProduct(Product p);

        string getData();

        Product SaveProduct(Product product);

        IList<Product> GetAllProduct();
        bool DeleteProduct(int id);
    }
}
