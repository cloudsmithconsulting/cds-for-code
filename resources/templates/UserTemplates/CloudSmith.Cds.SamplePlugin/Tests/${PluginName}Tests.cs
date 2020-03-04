using FakeXrmEasy;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.Xrm.Sdk;
using System;

namespace <%=$this.parameters.Namespace%>.Tests
{
    [TestClass]
    public class <%=$this.parameters.PluginName%>Tests
    {
        [TestMethod]
        public void <%=$this.parameters.PluginName%>Test()
        {
            var fakeContext = new XrmFakedContext();
            Entity target = null; //new Entity("account") { Id = Guid.NewGuid() };

            fakeContext.ExecutePluginWithTarget<<%=$this.parameters.PluginName%>>(target);
        }
    }
}
