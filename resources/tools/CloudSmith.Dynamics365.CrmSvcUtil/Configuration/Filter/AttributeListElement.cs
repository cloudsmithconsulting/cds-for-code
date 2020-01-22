using System.Configuration;

namespace CloudSmith.Dynamics365.CrmSvcUtil.Configuration.Filter
{
    public class AttributeListElement : ConfigurationElement
    {
        public AttributeListElement()
        {
        }

        public AttributeListElement(string attribute)
        {
            Attribute = attribute;
            Entity = "*";
        }

        public AttributeListElement(string entity, string attribute)
        {
            Attribute = attribute;
            Entity = entity;
        }

        [ConfigurationProperty("attribute", IsRequired = true)]
        public string Attribute
        {
            get => (string)this["attribute"];
            set => this["attribute"] = value;
        }

        [ConfigurationProperty("entity", IsRequired = true, DefaultValue = "*")]
        public string Entity
        {
            get => (string)this["entity"];
            set => this["entity"] = value;
        }
    }
}