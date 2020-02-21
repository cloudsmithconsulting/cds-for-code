using System.Configuration;
using System.Linq;

namespace CloudSmith.Cds.CrmSvcUtil.Configuration.Filter
{
    public class WhitelistElement : FilterListElement
    {
        public WhitelistElement()
            : base(FilterListStrategy.Whitelist)
        {
        }

        [ConfigurationProperty("filter", DefaultValue = WhitelistFilter.Exclusive)]
        public WhitelistFilter Filter
        {
            get => (WhitelistFilter)base["filter"];
            set => base["filter"] = value;
        }

    }

    public class BlacklistElement : FilterListElement
    {
        public BlacklistElement()
            : base(FilterListStrategy.Blacklist)
        {
        }
    }

    public enum WhitelistFilter
    {
        Exclusive,
        Inclusive
    }

    public abstract class FilterListElement : ConfigurationElement
    {
        internal FilterListElement(FilterListStrategy strategy)
            : base()
        {
            Strategy = strategy;
        }

        internal FilterListStrategy Strategy
        {
            get; set;
        }

        internal bool HasFilters => HasEntityFilters || HasAttributeFilters || HasOptionSetFilters || HasRegExFilters || HasSolutionFilters || HasCustomizationFilter;
        internal bool HasEntityFilters => Entities.Count(e => !string.IsNullOrEmpty(e.Entity)) > 0;
        internal bool HasAttributeFilters => Attributes.Count(a => !string.IsNullOrEmpty(a.Attribute)) > 0;
        internal bool HasOptionSetFilters => OptionSets.Count(o => !string.IsNullOrEmpty(o.OptionSet)) > 0;
        internal bool HasRegExFilters => Filters.Count(f => !string.IsNullOrEmpty(f.Expression)) > 0;
        internal bool HasSolutionFilters => Solutions.Count(s => !string.IsNullOrEmpty(s.SolutionName)) > 0;
        internal bool HasCustomizationFilter => Customizations?.CustomizationStrategy != CustomizationStrategy.Default;

        [ConfigurationProperty("Entities", IsRequired = false)]
        [ConfigurationCollection(typeof(EntityListElementCollection),
          AddItemName = "add",
          ClearItemsName = "clear",
          RemoveItemName = "remove")]
        public EntityListElementCollection Entities
        {
            get => (EntityListElementCollection)base["Entities"];
            set => base["Entities"] = value;
        }

        [ConfigurationProperty("Attributes", IsRequired = false)]
        [ConfigurationCollection(typeof(AttributeListElementCollection),
          AddItemName = "add",
          ClearItemsName = "clear",
          RemoveItemName = "remove")]
        public AttributeListElementCollection Attributes
        {
            get => (AttributeListElementCollection)base["Attributes"];
            set => base["Attributes"] = value;
        }

        [ConfigurationProperty("OptionSets", IsRequired = false)]
        [ConfigurationCollection(typeof(OptionSetListElementCollection),
          AddItemName = "add",
          ClearItemsName = "clear",
          RemoveItemName = "remove")]
        public OptionSetListElementCollection OptionSets
        {
            get => (OptionSetListElementCollection)base["OptionSets"];
            set => base["OptionSets"] = value;
        }

        [ConfigurationProperty("Filters", IsRequired = false)]
        [ConfigurationCollection(typeof(FilterListElementCollection))]
        public FilterListElementCollection Filters
        {
            get => (FilterListElementCollection)base["Filters"];
            set => base["Filters"] = value;
        }

        [ConfigurationProperty("Solutions", IsRequired = false)]
        [ConfigurationCollection(typeof(SolutionFilterElementCollection),
          AddItemName = "add",
          ClearItemsName = "clear",
          RemoveItemName = "remove")]
        public SolutionFilterElementCollection Solutions
        {
            get => (SolutionFilterElementCollection)base["Solutions"];
            set => base["Solutions"] = value;
        }

        [ConfigurationProperty("Customizations", IsRequired = false)]
        public CustomizationFilterElement Customizations
        {
            get => (CustomizationFilterElement)base["Customizations"];
            set => base["Customizations"] = value;
        }
    }
}