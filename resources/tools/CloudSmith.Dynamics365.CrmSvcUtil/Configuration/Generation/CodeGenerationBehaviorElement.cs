using System.Configuration;

namespace CloudSmith.Dynamics365.CrmSvcUtil.Configuration.Generation
{
    public class CodeGenerationBehaviorElement : ConfigurationElement
    {
        public CodeGenerationBehaviorElement()
        {
        }

        public CodeGenerationBehaviorElement(string name)
        {
            Name = name;
            IsEnabled = true;
        }

        [ConfigurationProperty("name", IsRequired = true)]
        public string Name
        {
            get => (string)this["name"];
            set => this["name"] = value;
        }

        [ConfigurationProperty("enabled", DefaultValue = true)]
        public bool IsEnabled
        {
            get => (bool)this["enabled"];
            set => this["enabled"] = value;
        }

        [ConfigurationProperty("arguments", IsRequired = false)]
        public string Arguments
        {
            get => (string)this["arguments"];
            set => this["arguments"] = value;
        }
    }
}