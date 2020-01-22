using Microsoft.Xrm.Sdk.Metadata;
using System;
using System.Collections.Generic;
using System.Linq;

namespace CloudSmith.Dynamics365.CrmSvcUtil.Cache
{
    public class EntityCacheItem : IHaveCacheKey, IParseCacheKey<string>, IParseMetadata<EntityMetadata>
    {
        public EntityCacheItem()
        {
            Key = new Func<string>(() => { return LogicalName; });
            ParseKey = new Func<string, string>(s => { LogicalName = s; return Key(); });
            ParseMetadata = new Action<EntityMetadata>(m => 
            {
                Metadata = m;
                LogicalName = m.LogicalName;
                DisplayName = m.DisplayName?.LocalizedLabels?.FirstOrDefault()?.Label;
            });
        }
        public EntityCacheItem(EntityMetadata metadata) : this() { ParseMetadata(metadata); }

        public Func<string> Key { get; }
        public Func<string, string> ParseKey { get; }
        public Action<EntityMetadata> ParseMetadata { get; }

        public EntityMetadata Metadata { get; private set; }
        public IEnumerable<AttributeCacheItem> Attributes
        {
            get
            {
                return DynamicsMetadataCache.Attributes.Where(a => a.Value.EntityLogicalName == LogicalName).Select(a => a.Value);
            }
        }

        public IEnumerable<OptionSetCacheItem> OptionSets
        {
            get
            {
                return DynamicsMetadataCache.OptionSets.Where(o => o.Value.EntityLogicalName == LogicalName).Select(o => o.Value);
            }
        }

        public string LogicalName { get; set; }
        public string DisplayName { get; set; }
        public string GeneratedTypeName { get; set; }
        public string GeneratedSetName { get; set; }
    }
}
