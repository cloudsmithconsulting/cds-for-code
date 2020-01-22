using Microsoft.Xrm.Sdk.Metadata;
using System;
using System.Linq;

namespace CloudSmith.Dynamics365.CrmSvcUtil.Cache
{
    public class OptionSetCacheItem : IHaveCacheKey, IParseCacheKey<string, string>, IParseMetadata<OptionSetMetadataBase>
    {
        public OptionSetCacheItem()
        {
            Key = new Func<string>(() => { return $"{EntityLogicalName}.{LogicalName}"; });
            ParseKey = new Func<string, string, string>((entity, optionSet) => { EntityLogicalName = entity; LogicalName = optionSet; return Key(); });
            ParseMetadata = new Action<OptionSetMetadataBase>(m =>
            {
                Metadata = m;
                EntityLogicalName = !(m.IsGlobal.HasValue && m.IsGlobal.Value) ? m.Name.Split('_')[0] : "*";
                LogicalName = m.Name.Replace($"{EntityLogicalName}_", "");
                DisplayName = m.DisplayName?.LocalizedLabels?.FirstOrDefault()?.Label;
            });
        }
        public OptionSetCacheItem(OptionSetMetadataBase metadata) : this() { ParseMetadata(metadata); }

        public Func<string> Key { get; }
        public Func<string, string, string> ParseKey { get; }
        public Action<OptionSetMetadataBase> ParseMetadata { get; }
        public OptionSetMetadataBase Metadata { get; private set; }

        public string EntityLogicalName { get; set; }
        public string LogicalName { get; set; }
        public string DisplayName { get; set; }
        public string GeneratedTypeName { get; set; }
    }
}
