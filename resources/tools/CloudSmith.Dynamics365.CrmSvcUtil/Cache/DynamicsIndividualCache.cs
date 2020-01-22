using System;
using System.Collections.Specialized;
using System.Runtime.Caching;

namespace CloudSmith.Dynamics365.CrmSvcUtil.Cache
{
    public class DynamicsIndividualCache<TCacheItem, TMetadata, TParse1> : TypedMemoryCache<string, TCacheItem>
        where TCacheItem : class, IHaveCacheKey, IParseCacheKey<TParse1>, IParseMetadata<TMetadata>, new()
    {
        internal DynamicsIndividualCache() : base(i => i.Key(), new MemoryCacheSettings { PhysicalMemoryLimitPercentage = 90, PollingInterval = TimeSpan.FromMinutes(10) }) { }
        
        public TCacheItem AddBy(TMetadata metadata)
        {
            return AddOrGetExisting(Parse(metadata));
        }

        public TCacheItem GetBy(TParse1 item1)
        {
            var key = ParseKey(item1);

            return Contains(key) ? this[key] : default;
        }

        public TCacheItem GetBy(TMetadata metadata)
        {
            var key = ParseKey(metadata);

            return Contains(key) ? this[key] : default;
        }

        public bool HasBy(TParse1 item1)
        {
            var key = ParseKey(item1);

            return Contains(key);
        }

        public bool HasBy(TMetadata metadata)
        {
            var key = ParseKey(metadata);

            return Contains(key);
        }

        public TCacheItem Parse(TMetadata metadata)
        {
            var item = new TCacheItem();
            item.ParseMetadata(metadata);

            return item;
        }

        public TCacheItem GetOrParse(TMetadata metadata)
        {
            TCacheItem item = Parse(metadata);

            var result = AddOrGetExisting(item);

            return result ?? item;
        }

        public string ParseKey(TParse1 item1)
        {
            return new TCacheItem().ParseKey(item1);
        }

        public string ParseKey(TMetadata metadata)
        {
            var item = new TCacheItem();
            item.ParseMetadata(metadata);

            return item.Key();
        }
    }

    public class DynamicsIndividualCache<TCacheItem, TMetadata, TParse1, TParse2> : TypedMemoryCache<string, TCacheItem>
        where TCacheItem : class, IHaveCacheKey, IParseCacheKey<TParse1, TParse2>, IParseMetadata<TMetadata>, new()
    {
        internal DynamicsIndividualCache() : base(i => i.Key(), new MemoryCacheSettings { PhysicalMemoryLimitPercentage = 90, PollingInterval = TimeSpan.FromMinutes(10) }) { }

        public TCacheItem AddBy(TMetadata metadata)
        {
            return AddOrGetExisting(Parse(metadata));
        }

        public TCacheItem GetBy(TParse1 item1, TParse2 item2)
        {
            var key = ParseKey(item1, item2);

            return Contains(key) ? this[key] : default;
        }

        public TCacheItem GetBy(TMetadata metadata)
        {
            var key = ParseKey(metadata);

            return Contains(key) ? this[key] : default;
        }

        public bool HasBy(TParse1 item1, TParse2 item2)
        {
            var key = ParseKey(item1, item2);

            return Contains(key);
        }

        public bool HasBy(TMetadata metadata)
        {
            var key = ParseKey(metadata);

            return Contains(key);
        }

        public TCacheItem Parse(TMetadata metadata)
        {
            var item = new TCacheItem();
            item.ParseMetadata(metadata);

            return item;
        }

        public TCacheItem GetOrParse(TMetadata metadata)
        {
            TCacheItem item = Parse(metadata);

            var result = AddOrGetExisting(item);

            return result ?? item;
        }

        public string ParseKey(TParse1 item1, TParse2 item2)
        {
            return new TCacheItem().ParseKey(item1, item2);
        }

        public string ParseKey(TMetadata metadata)
        {
            var item = new TCacheItem();
            item.ParseMetadata(metadata);

            return item.Key();
        }
    }
}
