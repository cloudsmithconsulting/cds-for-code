using Microsoft.Xrm.Sdk;
using System;

namespace #{Namespace}.Plugins
{
    [AttributeUsage(AttributeTargets.Class, AllowMultiple = true)]
    public sealed class RequirePostImageAttribute : DynamicsPluginAttribute
    {
        private readonly string _imageName;

        public RequirePostImageAttribute(string imageName)
        {
            _imageName = imageName;
        }

        public override void Validate(DynamicsPluginConfiguration configuration, DynamicsPluginServices services)
        {
            if (!string.IsNullOrEmpty(_imageName))
            {
                if (!services.Context.PostEntityImages.ContainsKey(_imageName))
                {
                    Fail($"The plugin '{configuration.PluginType.Name}' must contain a post-entity image named '{_imageName}' to be invoked.");
                }
            }
        }
    }
}
