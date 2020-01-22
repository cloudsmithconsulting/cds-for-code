using Microsoft.Crm.Services.Utility;
using System;

namespace CloudSmith.Dynamics365.CrmSvcUtil.Cache
{
    public class SdkMessageCacheItem : IHaveCacheKey, IParseCacheKey<string>, IParseMetadata<SdkMessage>
    {
        public SdkMessageCacheItem()
        {
            Key = new Func<string>(() => { return MessageName; });
            ParseKey = new Func<string, string>(message => { MessageName = message; return Key(); });
            ParseMetadata = new Action<SdkMessage>(m =>
            {
                Metadata = m;
                IsPrivate = m.IsPrivate;
                MessageName = m.Name;
            });
        }
        public SdkMessageCacheItem(SdkMessage metadata) : this() { ParseMetadata(metadata); }

        public Func<string> Key { get; }
        public Func<string, string> ParseKey { get; }
        public Action<SdkMessage> ParseMetadata { get; }
        public SdkMessage Metadata { get; private set; }

        public string MessageName { get; set; }
        public bool IsPrivate { get; set; }
        public string GeneratedTypeName { get; set; }
    }
}
