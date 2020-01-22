using Microsoft.Crm.Services.Utility;
using Microsoft.Xrm.Sdk.Metadata;
using System.Collections.Generic;
using System.Collections.Specialized;
using System.Runtime.Caching;
using System.Text;
using System.Threading.Tasks;

namespace CloudSmith.Dynamics365.CrmSvcUtil.Cache
{
    public static class DynamicsMetadataCache
    {
        static DynamicsMetadataCache()
        {
            Entities = new DynamicsIndividualCache<EntityCacheItem, EntityMetadata, string>();
            Attributes = new DynamicsIndividualCache<AttributeCacheItem, AttributeMetadata, string, string>();
            Options = new DynamicsIndividualCache<OptionCacheItem, OptionMetadata, int?, string>();
            OptionSets = new DynamicsIndividualCache<OptionSetCacheItem, OptionSetMetadataBase, string, string>();
            Relationships = new DynamicsIndividualCache<RelationshipCacheItem, RelationshipMetadataBase, string>();
            SdkMessages = new DynamicsIndividualCache<SdkMessageCacheItem, SdkMessage, string>();
            SdkMessagePairs = new DynamicsIndividualCache<SdkMessagePairCacheItem, SdkMessagePair, string>();            
        }

        public static DynamicsIndividualCache<EntityCacheItem, EntityMetadata, string> Entities { get; private set; }
        public static DynamicsIndividualCache<AttributeCacheItem, AttributeMetadata, string, string> Attributes { get; private set; }
        public static DynamicsIndividualCache<OptionCacheItem, OptionMetadata, int?, string> Options { get; private set; }
        public static DynamicsIndividualCache<OptionSetCacheItem, OptionSetMetadataBase, string, string> OptionSets { get; private set; }
        public static DynamicsIndividualCache<RelationshipCacheItem, RelationshipMetadataBase, string> Relationships { get; private set; }
        public static DynamicsIndividualCache<SdkMessageCacheItem, SdkMessage, string> SdkMessages { get; private set; }
        public static DynamicsIndividualCache<SdkMessagePairCacheItem, SdkMessagePair, string> SdkMessagePairs { get; private set; }            
    }
}
