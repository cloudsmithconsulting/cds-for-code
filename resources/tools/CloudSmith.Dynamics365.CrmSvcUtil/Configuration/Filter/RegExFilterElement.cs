using System.Configuration;

namespace CloudSmith.Dynamics365.CrmSvcUtil.Configuration.Filter
{
    public class RegExFilterElement : ConfigurationElement, IFilterElement
    {
        public RegExFilterElement()
        {
            Filter = FilterMember.Entity;
        }

        public RegExFilterElement(FilterMember filter) : base()
        {
            Filter = filter;
            Expression = ".*";
        }

        public RegExFilterElement(FilterMember filter, string expression) : this(filter)
        {
            Expression = expression;
        }

        public RegExFilterElement(FilterMember filter, string expression, bool ignoreCase) : this(filter, expression)
        {
            IgnoreCase = ignoreCase;
        }

        [ConfigurationProperty("expression", IsRequired = true)]
        public string Expression
        {
            get => (string)this["expression"];
            set => this["expression"] = value;
        }

        [ConfigurationProperty("ignoreCase", DefaultValue = true)]
        public bool IgnoreCase
        {
            get => (bool)this["ignoreCase"];
            set => this["ignoreCase"] = value;
        }

        public FilterMember Filter { get; private set; }
    }
}