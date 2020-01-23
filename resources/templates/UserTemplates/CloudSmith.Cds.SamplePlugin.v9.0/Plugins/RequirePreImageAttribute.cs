using Microsoft.Xrm.Sdk;
using System;

namespace #{Namespace}.Plugins
{
    [AttributeUsage(AttributeTargets.Class, AllowMultiple = true)]
    public sealed class RequirePreImageAttribute : DynamicsPluginAttribute
    {
        private readonly string _imageName;

        public RequirePreImageAttribute(string imageName)
        {
            _imageName = imageName;
        }

        public override void Validate(DynamicsPluginConfiguration configuration, DynamicsPluginServices services)
        {
            if (!string.IsNullOrEmpty(_imageName))
            {
                if (!services.Context.PreEntityImages.ContainsKey(_imageName))
                {
                    Fail($"The plugin '{configuration.PluginType.Name}' must contain a pre-entity image named '{_imageName}' to be invoked.");
                }
            }
        }
    }
}
