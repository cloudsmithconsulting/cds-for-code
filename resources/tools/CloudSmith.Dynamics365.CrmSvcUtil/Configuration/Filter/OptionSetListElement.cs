using System.Configuration;

namespace CloudSmith.Dynamics365.CrmSvcUtil.Configuration.Filter
{
    public class OptionSetListElement : ConfigurationElement
    {
        public OptionSetListElement()
        {
        }

        public OptionSetListElement(string optionSet)
        {
            OptionSet = optionSet;
        }

        [ConfigurationProperty("optionSet", IsRequired = true)]
        public string OptionSet
        {
            get => (string)this["optionSet"];
            set => this["optionSet"] = value;
        }

        [ConfigurationProperty("entity", IsRequired = true, DefaultValue = "*")]
        public string Entity
        {
            get => (string)this["entity"];
            set => this["entity"] = value;
        }
    }
}