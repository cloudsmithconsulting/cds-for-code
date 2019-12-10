using Microsoft.Xrm.Sdk;
using System;

namespace #{Namespace}.Plugins
{
    [AttributeUsage(AttributeTargets.Class)]
    public sealed class RequireExecutionModeAttribute : DynamicsPluginAttribute
    {
        private readonly ExecutionMode? _mode;

        public RequireExecutionModeAttribute(ExecutionMode mode)
        {
            _mode = mode;
        }

        public override void Validate(DynamicsPluginConfiguration configuration, DynamicsPluginServices services)
        {
            if (_mode.HasValue && services.Context.Mode != (int)_mode.Value)
            {
                Fail($"The plugin '{configuration.PluginType.Name}' must be invoked using mode '{_mode.ToString()}' but was invoked using mode '{Enum.ToObject(typeof(ExecutionMode), services.Context.Mode)}' instead.");
            }
        }
    }

    public enum ExecutionMode
    {
        Synchronous = 0,
        Asynchronous = 1
    }
}
