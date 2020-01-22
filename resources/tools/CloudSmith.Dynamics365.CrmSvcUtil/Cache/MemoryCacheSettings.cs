using System;
using System.Collections.Specialized;
using System.Globalization;
using System.Runtime.Caching;

namespace CloudSmith.Dynamics365.CrmSvcUtil.Cache
{
    public class MemoryCacheSettings
    {
        public int MemoryLimitMegabytes { get; set; }
        public int PhysicalMemoryLimitPercentage { get; set; }
        public TimeSpan PollingInterval { get; set; }
        public TimeSpan SlidingExpiration { get; set; }

        public static MemoryCacheSettings Default()
        {
            return new MemoryCacheSettings()
            {
                MemoryLimitMegabytes = 100,
                PhysicalMemoryLimitPercentage = 10,
                PollingInterval = TimeSpan.FromMinutes(1),
                SlidingExpiration = TimeSpan.FromHours(1),
            };
        }

        public NameValueCollection ToCollection()
        {
            var settings = new NameValueCollection()
            {
                ["cacheMemoryLimitMegabytes"] = MemoryLimitMegabytes.ToString(),
                ["physicalMemoryLimitPercentage"] = PhysicalMemoryLimitPercentage.ToString(),
                ["pollingInterval"] = PollingInterval.ToString(@"hh\:mm\:ss", CultureInfo.InvariantCulture),
            };

            return settings;
        }

        public CacheItemPolicy Policy()
        {
            var policy = new CacheItemPolicy();

            policy.SlidingExpiration = SlidingExpiration;

            return policy;
        }
    }
}
