using System;
using Microsoft.Xrm.Sdk;

namespace SamplePlugin
{
    public class SamplePlugin : IPlugin
    {
        public void Execute(IServiceProvider serviceProvider)
        {
            var tracingService = (ITracingService)serviceProvider.GetService(typeof(ITracingService));
            var executionContext = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));

            tracingService.Trace("Plugin started");
        }
    }
}
