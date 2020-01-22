using System.Configuration;
using System.Linq;

namespace CloudSmith.Dynamics365.CrmSvcUtil.Configuration.Filter
{
    public class FilterContainerElement : ConfigurationElement
    {
        public bool HasWhitelist => Whitelist.HasFilters;
        public bool HasBlacklist => Blacklist.HasFilters;

        [ConfigurationProperty("Whitelist")]
        public WhitelistElement Whitelist
        {
            get => (WhitelistElement)base["Whitelist"];
            set => base["Whitelist"] = value;
        }

        [ConfigurationProperty("Blacklist")]
        public BlacklistElement Blacklist
        {
            get => (BlacklistElement)base["Blacklist"];
            set => base["Blacklist"] = value;
        }
    }
}