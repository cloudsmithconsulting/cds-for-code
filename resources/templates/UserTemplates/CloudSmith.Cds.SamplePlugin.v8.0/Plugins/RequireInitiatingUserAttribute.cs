using System;

namespace #{Namespace}.Plugins
{
    [AttributeUsage(AttributeTargets.Class)]
    public sealed class RequireInitiatingUserAttribute : DynamicsPluginAttribute
    {
        private readonly Guid _initiatingUserId;

        public RequireInitiatingUserAttribute(string initiatingUserId)
            : base()
        {
            // Required as GUID types are not available as constructor arguments in attributes (silly .net)
            if (!Guid.TryParse(initiatingUserId, out _initiatingUserId))
            {
                Fail($"The plugin was decorated with a [RequireInitiatingUser] attribute, however the value '{initiatingUserId}' is not a valid GUID.");
            }
        }

        public override void Validate(DynamicsPluginConfiguration configuration, DynamicsPluginServices services)
        {
            if (services.Context.InitiatingUserId != _initiatingUserId)
            {
                Fail($"The plugin '{configuration.PluginType.Name}' must be executed as user '{_initiatingUserId}' but was executed as user '{services.Context.InitiatingUserId}'.");
            }
        }
    }
}
