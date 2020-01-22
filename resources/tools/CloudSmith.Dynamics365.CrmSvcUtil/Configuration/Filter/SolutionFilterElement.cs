using System.Configuration;

namespace CloudSmith.Dynamics365.CrmSvcUtil.Configuration.Filter
{
    public class SolutionFilterElement : ConfigurationElement
    {
        public SolutionFilterElement()
        {
        }

        public SolutionFilterElement(string name)
        {
            SolutionName = name;
        }

        [ConfigurationProperty("solution", IsRequired = true)]
        public string SolutionName
        {
            get => (string)this["solution"];
            set => this["solution"] = value;
        }
    }
}