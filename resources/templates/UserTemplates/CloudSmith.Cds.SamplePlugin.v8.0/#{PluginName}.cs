using System;
using Microsoft.Xrm.Sdk;

namespace #{Namespace}
{
    // Use attributes like this one to perform validation automatically in your plugin code.  This attribute
    // enforces that this plugin run in synchronous mode and will throw an InvalidPluginOperationException if it 
    // is not registered properly.  Mix and match, and have fun!
    [Plugins.RequireExecutionMode(Plugins.ExecutionMode.Synchronous)]
    public class SamplePlugin : Plugins.DynamicsPlugin
    {
        /// <summary>
        ///  Sample Execute method is invoked when plugin is run.
        /// </summary>
        public override void Execute()
        {
            var orgService = this.Plugin.CreateOrganizationService();

            this.Plugin.Trace("Created an organization service.");
        }
    }
}
