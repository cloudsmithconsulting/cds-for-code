using System.Configuration;

namespace CloudSmith.Dynamics365.CrmSvcUtil.Configuration.Filter
{
    public class CustomizationFilterElement : ConfigurationElement
    {
        public CustomizationFilterElement()
        {
        }

        public CustomizationFilterElement(CustomizationStrategy strategy)
        {
            CustomizationStrategy = strategy;
        }

        [ConfigurationProperty("strategy", IsRequired = true)]
        public CustomizationStrategy CustomizationStrategy
        {
            get => (CustomizationStrategy)this["strategy"];
            set => this["strategy"] = value;
        }
    }

    public enum CustomizationStrategy
    {
        Default = 0,
        CustomOnly = 1,
        UncustomizedOnly = 2
    }
}