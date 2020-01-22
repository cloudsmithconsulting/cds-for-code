using System.ComponentModel;
using System.Configuration;

namespace CloudSmith.Dynamics365.CrmSvcUtil.Configuration.Naming
{
    public class Map : ConfigurationElement
    {
        public Map()
        {
        }

        public Map(string from, string to)
        {
            From = from;
            To = to;
        }

        [ConfigurationProperty("from", IsKey = true, IsRequired = true)]
        public string From
        {
            get => (string)base["from"];
            set => base["from"] = value;
        }
        [ConfigurationProperty("to", IsRequired = true)]
        public string To
        {
            get => (string)base["to"];
            set => base["to"] = value;
        }

        [ConfigurationProperty("type", DefaultValue = "entity")]
        [TypeConverter(typeof(CaseInsensitiveEnumConfigConverter<MapType>))]
        public MapType Type
        {
            get => (MapType)base["type"];
            set => base["type"] = value;
        }
    }
}