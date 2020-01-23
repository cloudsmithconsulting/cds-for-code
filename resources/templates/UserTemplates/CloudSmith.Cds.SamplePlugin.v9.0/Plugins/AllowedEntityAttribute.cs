using Microsoft.Xrm.Sdk;
using System;

namespace #{Namespace}.Plugins
{
    [AttributeUsage(AttributeTargets.Class, AllowMultiple = true)]
    public sealed class AllowedEntityAttribute : DynamicsPluginAttribute
    {
        private readonly string _entityName;
        private readonly PluginEntityType _pluginEntityType;

        public AllowedEntityAttribute(string entityName, PluginEntityType entityType)
            : base(PluginValidationExceptionPolicy.ThrowIfAll)
        {
            _entityName = entityName;
            _pluginEntityType = entityType;
        }

        public override void Validate(DynamicsPluginConfiguration configuration, DynamicsPluginServices services)
        {
            if (!string.IsNullOrEmpty(_entityName))
            {
                if (((_pluginEntityType & PluginEntityType.Primary) == PluginEntityType.Primary)
                    && string.Compare(services.Context.PrimaryEntityName, _entityName, true) != 0)
                {
                    Fail($"The plugin '{configuration.PluginType.Name}' must be registered on the entity '{_entityName}' as the primary entity.");
                }

                if (((_pluginEntityType & PluginEntityType.Secondary) == PluginEntityType.Secondary)
                    && string.Compare(services.Context.SecondaryEntityName, _entityName, true) != 0)
                {
                    Fail($"The plugin '{configuration.PluginType.Name}' must be registered on the entity '{_entityName}' as the secondary entity.");
                }
            }
        }
    }

    [Flags]
    public enum PluginEntityType
    {
        Primary = 1,
        Secondary = 2
    }
}
