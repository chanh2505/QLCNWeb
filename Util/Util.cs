using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;

namespace Util
{
    public class Util
    {
        public T transform<U, T>(U entity)
        {
            Mapper.Initialize(cfg =>
            {
                cfg.CreateMap<U, T>();
            });
            return Mapper.Map<T>(entity);
        }

        public IList<T> transformList<U, T>(IList<U> entity)
        {
            IList<T> res = new List<T>();
            Mapper.Initialize(cfg => {
                cfg.CreateMap<U, T>();
            });
            foreach(U u in entity)
            {
                res.Add(Mapper.Map<T>(u));
            }
            return res;
        }

    }
}
