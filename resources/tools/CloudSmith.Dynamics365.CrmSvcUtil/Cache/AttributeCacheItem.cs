using Microsoft.Xrm.Sdk.Metadata;
using System;
using System.Linq;

namespace CloudSmith.Dynamics365.CrmSvcUtil.Cache
{
    public class AttributeCacheItem : IHaveCacheKey, IParseCacheKey<string, string>, IParseMetadata<AttributeMetadata>
    {
        public AttributeCacheItem()
        {
            Key = new Func<string>(() => { return $"{EntityLogicalName}.{LogicalName}"; });
            ParseKey = new Func<string, string, string>((entity, attribute) => { EntityLogicalName = entity; LogicalName = attribute; return Key(); });
            ParseMetadata = new Action<AttributeMetadata>(m => 
            {
                Metadata = m;
                EntityLogicalName = m.EntityLogicalName == null ? "*" : m.EntityLogicalName;
                LogicalName = m.LogicalName;
                DisplayName = m.DisplayName?.LocalizedLabels?.FirstOrDefault()?.Label;
                Type = m.AttributeTypeName.Value;
            });
        }
        public AttributeCacheItem(AttributeMetadata metadata) : this() { ParseMetadata(metadata); }

        public Func<string> Key { get; }
        public Func<string, string, string> ParseKey { get; }
        public Action<AttributeMetadata> ParseMetadata { get; }

        public AttributeMetadata Metadata { get; private set; }

        public string EntityLogicalName { get; set; }
        public string LogicalName { get; set; }
        public string DisplayName { get; set; }
        public string Type { get; set; }
        public string GeneratedTypeName { get; set; }
    }
}
