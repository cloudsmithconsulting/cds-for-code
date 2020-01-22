using System.ComponentModel;
using System.Configuration;

namespace CloudSmith.Dynamics365.CrmSvcUtil.Configuration.Naming
{
    public class PublisherElement : ConfigurationElement
    {
        public PublisherElement()
        {
        }

        public PublisherElement(string name)
        {
            Name = name;
        }

        [ConfigurationProperty("name", IsKey = true, IsRequired = true)]
        public string Name
        {
            get => (string)this["name"];
            set => this["name"] = value;
        }

        [ConfigurationProperty("action", DefaultValue = PublisherNamingAction.Remove)]
        [TypeConverter(typeof(CaseInsensitiveEnumConfigConverter<PublisherNamingAction>))]
        public PublisherNamingAction Action { get; set; }
    }
}