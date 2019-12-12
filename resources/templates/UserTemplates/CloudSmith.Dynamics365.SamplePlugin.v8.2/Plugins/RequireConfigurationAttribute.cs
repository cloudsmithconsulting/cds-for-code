using Microsoft.Xrm.Sdk;
using System;

namespace #{Namespace}.Plugins
{
    [AttributeUsage(AttributeTargets.Class, AllowMultiple = true)]
    public sealed class RequireConfigurationAttribute : DynamicsPluginAttribute
    {
        private readonly PluginConfigurationType _configurationType;

        public RequireConfigurationAttribute(PluginConfigurationType configurationType)
        {
            _configurationType = configurationType;
        }

        public override void Validate(DynamicsPluginConfiguration configuration, DynamicsPluginServices services)
        {
            if (((_configurationType & PluginConfigurationType.Unsecure) == PluginConfigurationType.Unsecure)
                && string.IsNullOrEmpty(configuration.UnsecureConfiguration))
            {
                Fail($"The plugin '{configuration.PluginType.Name}' must be registered with an unsecure configuration.  You must re-register the plugin with this configuration before you can execute it.");
            }

            if (((_configurationType & PluginConfigurationType.Secure) == PluginConfigurationType.Secure)
                && string.IsNullOrEmpty(configuration.SecureConfiguration))
            {
                Fail($"The plugin '{configuration.PluginType.Name}' must be registered with a secure configuration.  You must re-register the plugin with this configuration before you can execute it.");
            }

            if (_configurationType == PluginConfigurationType.Both
                && (string.IsNullOrEmpty(configuration.UnsecureConfiguration) || string.IsNullOrEmpty(configuration.SecureConfiguration)))
            {
                Fail($"The plugin '{configuration.PluginType.Name}' must be registered with both an unsecure and a secure configuration.  You must re-register the plugin with this configuration before you can execute it.");
            }
        }
    }

    [Flags]
    public enum PluginConfigurationType
    {
        Secure = 1,
        Unsecure = 2,
        Both = Secure & Unsecure
    }
}
