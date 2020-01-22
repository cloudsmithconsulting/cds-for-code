using System.Configuration;
using Microsoft.Xrm.Sdk;

namespace CloudSmith.Dynamics365.CrmSvcUtil.Configuration.Naming
{
    public sealed class NamingElement : ConfigurationElement
    {
        [ConfigurationProperty("PublisherRules")]
        [ConfigurationCollection(typeof(PublisherElementCollection))]
        public PublisherElementCollection Publisher
        {
            get => (PublisherElementCollection)base["PublisherRules"];
            set => base["PublisherRules"] = value;
        }

        [ConfigurationProperty("MappingRules")]
        [ConfigurationCollection(typeof(MappingCollection))]
        public MappingCollection Mapping
        {
            get => (MappingCollection)base["MappingRules"];
            set => base["MappingRules"] = value;
        }
    }
}