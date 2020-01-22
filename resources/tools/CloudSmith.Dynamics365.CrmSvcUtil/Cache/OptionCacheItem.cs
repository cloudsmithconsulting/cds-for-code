using Microsoft.Xrm.Sdk.Metadata;
using System;
using System.Linq;

namespace CloudSmith.Dynamics365.CrmSvcUtil.Cache
{
    public class OptionCacheItem : IHaveCacheKey, IParseCacheKey<int?, string>, IParseMetadata<OptionMetadata>
    {
        public OptionCacheItem()
        {
            Key = new Func<string>(() => { return $"{Value?.ToString()}.{LogicalName}"; });
            ParseKey = new Func<int?, string, string>((value, logicalName) => { Value = value; LogicalName = logicalName; return Key(); });
            ParseMetadata = new Action<OptionMetadata>(m =>
            {
                Metadata = m;
                Value = m.Value;
                LogicalName = m.Label?.LocalizedLabels?.FirstOrDefault()?.Label;
                DisplayName = m.Description?.LocalizedLabels?.FirstOrDefault()?.Label;
            });
        }
        public OptionCacheItem(OptionMetadata metadata) : this() { ParseMetadata(metadata); }

        public Func<string> Key { get; }
        public Func<int?, string, string> ParseKey { get; }
        public Action<OptionMetadata> ParseMetadata { get; }
        public OptionMetadata Metadata { get; private set; }

        public string LogicalName { get; set; }
        public string DisplayName { get; set; }
        public int? Value { get; set; }
        public string GeneratedTypeName { get; set; }
    }
}
