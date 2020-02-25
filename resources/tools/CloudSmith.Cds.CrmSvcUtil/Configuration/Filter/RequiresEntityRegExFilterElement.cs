using System.Configuration;

namespace CloudSmith.Cds.CrmSvcUtil.Configuration.Filter
{
    public class AllowsEntityRegExElement : RegExFilterElement
    {
        public AllowsEntityRegExElement() : base(FilterMember.Entity) { }
        public AllowsEntityRegExElement(string expression) : base(FilterMember.Entity, expression) { }
        public AllowsEntityRegExElement(string expression, bool ignoreCase) : base(FilterMember.Entity, expression, ignoreCase) { }

        [ConfigurationProperty("entity", IsRequired = false)]
        public string Entity
        {
            get => (string)this["entity"];
            set => this["entity"] = value;
        }
    }
}