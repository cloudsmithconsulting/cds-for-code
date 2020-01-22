using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Caching;
using System.Text;
using System.Threading.Tasks;

namespace CloudSmith.Dynamics365.CrmSvcUtil.Cache
{
    public static class ObjectCacheExtensions
    {
        /// <summary>
        /// Thread-safe implementation of AddOrGetExisting with typed parameter.
        /// </summary>
        /// <typeparam name="T">The type of item to return from the cache.</typeparam>
        /// <param name="cache">The cache.</param>
        /// <param name="key">The item key.</param>
        /// <param name="valueFactory">Factory method that produces the item if it needs to be added.</param>
        /// <returns>Cached item (added or retrieved)</returns>
        public static T AddOrGetExisting<T>(this ObjectCache cache,
                                            string key,
                                            Func<T> valueFactory)
            where T : class
        {
            return AddOrGetExisting(cache, key, valueFactory, new CacheItemPolicy());
        }

        /// <summary>
        /// Thread-safe implementation of AddOrGetExisting with typed parameter.
        /// </summary>
        /// <typeparam name="T">The type of item to return from the cache.</typeparam>
        /// <param name="cache">The cache.</param>
        /// <param name="key">The item key.</param>
        /// <param name="valueFactory">Factory method that produces the item if it needs to be added.</param>
        /// <param name="policy">CacheItemPolicy</param>
        /// <returns>Cached item (added or retrieved)</returns>
        public static T AddOrGetExisting<T>(this ObjectCache cache,
                                            string key,
                                            Func<T> valueFactory,
                                            CacheItemPolicy policy)
            where T : class
        {
            var newValue = valueFactory != null 
                ? new Lazy<T>(valueFactory) 
                : new Lazy<T>(() => default);

            var oldValue = cache.AddOrGetExisting(key, newValue.Value, policy) as T;

            try
            {
                return oldValue == null ? newValue.Value : oldValue;
            }
            catch
            {
                cache.Remove(key);

                throw;
            }
        }
    }
}
