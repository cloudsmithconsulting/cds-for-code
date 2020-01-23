using System;

namespace #{Namespace}.Plugins
{
    [AttributeUsage(AttributeTargets.Class)]
    public sealed class RequireTransactionAttribute : DynamicsPluginAttribute
    {
        public override void Validate(DynamicsPluginConfiguration configuration, DynamicsPluginServices services)
        {
            if (!services.Context.IsInTransaction)
            {
                Fail($"The plugin '{configuration.PluginType.Name}' must be registered as a step inside the database transaction.");
            }
        }
    }
}
