using System;

namespace #{Namespace}.Plugins
{
    public sealed class DynamicsPluginConfiguration
    {
        internal DynamicsPluginConfiguration(Type pluginType, string unsecureConfiguration, string secureConfiguration)
        {
            PluginType = pluginType;
            SecureConfiguration = secureConfiguration;
            UnsecureConfiguration = unsecureConfiguration;
        }

        public Type PluginType { get; private set; }
        public string SecureConfiguration { get; private set; }
        public string UnsecureConfiguration { get; private set; }
    }
}
