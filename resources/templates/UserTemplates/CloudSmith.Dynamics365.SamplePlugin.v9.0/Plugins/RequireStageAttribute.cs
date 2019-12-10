using Microsoft.Xrm.Sdk;
using System;

namespace #{Namespace}.Plugins
{
    [AttributeUsage(AttributeTargets.Class)]
    public sealed class RequireStageAttribute : DynamicsPluginAttribute
    {
        private readonly PluginStage? _stage;

        public RequireStageAttribute(PluginStage stage)
        {
            _stage = stage;
        }

        public override void Validate(DynamicsPluginConfiguration configuration, DynamicsPluginServices services)
        {
            var contextStage = (PluginStage)Enum.ToObject(typeof(PluginStage), services.Context.Stage);

            if (_stage.HasValue)
            {
                switch (contextStage)
                {
                    case PluginStage.PreValidation:
                        if ((_stage.Value & PluginStage.PreValidation) != PluginStage.PreValidation)
                        {
                            Fail($"The plugin '{configuration.PluginType.Name}' cannot be invoked in '{contextStage}'.");
                        }

                        break;
                    case PluginStage.PreOperation:
                        if ((_stage.Value & PluginStage.PreOperation) != PluginStage.PreOperation)
                        {
                            Fail($"The plugin '{configuration.PluginType.Name}' cannot be invoked in '{contextStage}'.");
                        }

                        break;

                    case PluginStage.PostOperation:
                        if ((_stage.Value & PluginStage.PostOperation) != PluginStage.PostOperation)
                        {
                            Fail($"The plugin '{configuration.PluginType.Name}' cannot be invoked in '{contextStage}'.");
                        }

                        break;
                }
            }
        }
    }

    [Flags]
    public enum PluginStage
    {
        PreValidation = 10,
        PreOperation = 20,
        PostOperation = 40
    }
}
