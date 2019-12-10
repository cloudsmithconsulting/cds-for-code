using Microsoft.Xrm.Sdk;
using System;

namespace #{Namespace}.Plugins
{
    [AttributeUsage(AttributeTargets.Class)]
    public sealed class RequireTargetAttribute : DynamicsPluginAttribute
    {
        private readonly PluginContextTargetType _targetType;

        public RequireTargetAttribute(PluginContextTargetType targetType)
            : base()
        {
            _targetType = targetType;
        }

        public override void Validate(DynamicsPluginConfiguration configuration, DynamicsPluginServices services)
        {
            if ((services.Context.InputParameters == null || !services.Context.InputParameters.Contains("Target"))
                && _targetType != PluginContextTargetType.None)
            {
                Fail($"The plugin '{configuration.PluginType.Name}' must contain an input parameter named 'Target' to be invoked.");
            }

            if (services.Context.InputParameters != null 
                && services.Context.InputParameters.Contains("Target"))
            {
                if (_targetType == PluginContextTargetType.None)
                {
                    Fail($"The plugin '{configuration.PluginType.Name}' contains an input parameter named 'Target' but it should not.");
                }

                var targetIsEntity = services.Context.InputParameters["Target"] is Entity;
                var targetIsEntityReference = services.Context.InputParameters["Target"] is EntityReference;

                if (!targetIsEntity 
                    && _targetType == PluginContextTargetType.Entity)
                {
                    Fail($"The plugin '{configuration.PluginType.Name}' contains an input parameter named 'Target' but it's type is not 'Entity'.");
                }

                if (!targetIsEntityReference
                    && _targetType == PluginContextTargetType.EntityReference)
                {
                    Fail($"The plugin '{configuration.PluginType.Name}' contains an input parameter named 'Target' but it's type is not 'EntityReference'.");
                }

                if (!(targetIsEntity || targetIsEntityReference)
                    && _targetType == (PluginContextTargetType.Entity | PluginContextTargetType.EntityReference))
                {
                    Fail($"The plugin '{configuration.PluginType.Name}' contains an input parameter named 'Target' but it's type is not 'Entity' or 'EntityReference'.");
                }
            }
        }
    }

    [Flags]
    public enum PluginContextTargetType
    {
        None = 0,
        Entity = 1,
        EntityReference = 2
    }
}
