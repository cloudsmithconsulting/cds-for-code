using Microsoft.Xrm.Sdk;
using System;

namespace #{Namespace}.Plugins
{
    [AttributeUsage(AttributeTargets.Class, AllowMultiple = true)]
    public sealed class AllowedMessageAttribute : DynamicsPluginAttribute
    {
        private readonly string _messageName;

        public AllowedMessageAttribute(string messageName)
            : base(PluginValidationExceptionPolicy.ThrowIfAll)
        {
            _messageName = messageName;
        }

        public override void Validate(DynamicsPluginConfiguration configuration, DynamicsPluginServices services)
        {
            if (!string.IsNullOrEmpty(_messageName))
            {
                if (string.Compare(services.Context.MessageName, _messageName, true) != 0)
                {
                    Fail($"The plugin '{configuration.PluginType.Name}' must be registered on the message '{_messageName}'.");
                }
            }
        }
    }
}
