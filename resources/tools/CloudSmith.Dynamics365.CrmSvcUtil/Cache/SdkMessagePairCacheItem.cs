using Microsoft.Crm.Services.Utility;
using System;

namespace CloudSmith.Dynamics365.CrmSvcUtil.Cache
{
    public class SdkMessagePairCacheItem : IHaveCacheKey, IParseCacheKey<string>, IParseMetadata<SdkMessagePair>
    {
        public SdkMessagePairCacheItem()
        {
            Key = new Func<string>(() => { return RequestName; });
            ParseKey = new Func<string, string>(key => { RequestName = key; return Key(); });
            ParseMetadata = new Action<SdkMessagePair>(m =>
            {
                Metadata = m;
                MessageNamespace = m.MessageNamespace;
                RequestName = m.Request.Name;
            });
        }
        public SdkMessagePairCacheItem(SdkMessagePair metadata) : this() { ParseMetadata(metadata); }

        public Func<string> Key { get; }
        public Func<string, string> ParseKey { get; }
        public Action<SdkMessagePair> ParseMetadata { get; }
        public SdkMessagePair Metadata { get; private set; }

        public string MessageNamespace { get; set; }
        public string RequestName { get; set; }
        public string GeneratedRequestTypeName { get; set; }
        public string GeneratedTypeName { get; set; }
    }
}
