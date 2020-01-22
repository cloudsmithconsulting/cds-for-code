using System.Configuration;

namespace CloudSmith.Dynamics365.CrmSvcUtil.Configuration.Filter
{
    public class EntityListElement : ConfigurationElement
    {
        public EntityListElement()
        {
        }

        public EntityListElement(string entity)
        {
            Entity = entity;
        }

        [ConfigurationProperty("entity", IsRequired = true)]
        public string Entity
        {
            get => (string)this["entity"];
            set => this["entity"] = value;
        }
    }
}