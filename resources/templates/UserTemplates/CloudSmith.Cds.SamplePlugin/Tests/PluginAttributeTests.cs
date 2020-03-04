using <%=$this.parameters.Namespace%>.Plugins;
using System;
using System.Diagnostics;
using FakeXrmEasy;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Microsoft.Xrm.Sdk;

namespace <%=$this.parameters.Namespace%>.Tests
{
    [TestClass]
    public class PluginAttributeTests
    {
        #region AllowedEntityPlugin

        [TestMethod]
        public void TestAllowedEntityAttribute()
        {
            var fakeContext = new XrmFakedContext();
            var target = new Entity("account") { Id = Guid.NewGuid() };

            fakeContext.ExecutePluginWithTarget<AllowedEntityPlugin>(target);
        }

        [TestMethod]
        [ExpectedException(typeof(InvalidPluginExecutionException))]
        public void TestAllowedEntityAttributeFailure()
        {
            var fakeContext = new XrmFakedContext();
            var target = new Entity("contact") { Id = Guid.NewGuid() };

            fakeContext.ExecutePluginWithTarget<AllowedEntityPlugin>(target);
        }

        #endregion

        #region MultipleAllowedEntityPlugin

        [TestMethod]
        public void TestMultipleAllowedEntityAttribute()
        {
            var fakeContext = new XrmFakedContext();
            var target = new Entity("account") { Id = Guid.NewGuid() };

            fakeContext.ExecutePluginWithTarget<MultipleAllowedEntityPlugin>(target);
        }

        [TestMethod]
        [ExpectedException(typeof(InvalidPluginExecutionException))]
        public void TestMultipleAllowedEntityAttributeFailure()
        {
            var fakeContext = new XrmFakedContext();
            var target = new Entity("lead") { Id = Guid.NewGuid() };

            fakeContext.ExecutePluginWithTarget<MultipleAllowedEntityPlugin>(target);
        }

        #endregion

        #region AllowedMessagePlugin

        [TestMethod]
        public void TestAllowedMessageAttribute()
        {
            var fakeContext = new XrmFakedContext();
            var target = new Entity("account") { Id = Guid.NewGuid() };

            fakeContext.ExecutePluginWithTarget<AllowedMessagePlugin>(target);
        }

        [TestMethod]
        [ExpectedException(typeof(InvalidPluginExecutionException))]
        public void TestAllowedMessageAttributeFailure()
        {
            var fakeContext = new XrmFakedContext();
            var target = new Entity("account") { Id = Guid.NewGuid() };

            fakeContext.ExecutePluginWithTarget<AllowedMessagePlugin>(target, "Update", default);
        }

        #endregion

        #region MultipleAllowedMessagePlugin

        [TestMethod]
        public void TestMultipleAllowedMessageAttribute()
        {
            var fakeContext = new XrmFakedContext();
            var target = new Entity("account") { Id = Guid.NewGuid() };

            fakeContext.ExecutePluginWithTarget<MultipleAllowedMessagePlugin>(target);
        }

        [TestMethod]
        [ExpectedException(typeof(InvalidPluginExecutionException))]
        public void TestMultipleAllowedMessageAttributeFailure()
        {
            var fakeContext = new XrmFakedContext();
            var target = new Entity("account") { Id = Guid.NewGuid() };

            fakeContext.ExecutePluginWithTarget<MultipleAllowedMessagePlugin>(target, "Assign", default);
        }

        #endregion

        #region RequireSecureConfigurationPlugin

        [TestMethod]
        public void TestSecureConfigurationAttribute()
        {
            var fakeContext = new XrmFakedContext();
            var pluginContext = new XrmFakedPluginExecutionContext();

            fakeContext.ExecutePluginWithConfigurations<RequireSecureConfigurationPlugin>(pluginContext, string.Empty, "secure-config");
        }

        [TestMethod]
        [ExpectedException(typeof(InvalidPluginExecutionException))]
        public void TestSecureConfigurationAttributeFailure()
        {
            var fakeContext = new XrmFakedContext();
            var pluginContext = new XrmFakedPluginExecutionContext();

            fakeContext.ExecutePluginWith<RequireSecureConfigurationPlugin>(pluginContext);
        }

        #endregion

        #region RequireUnsecureConfigurationPlugin

        [TestMethod]
        public void TestUnsecureConfigurationAttribute()
        {
            var fakeContext = new XrmFakedContext();
            var pluginContext = new XrmFakedPluginExecutionContext();

            fakeContext.ExecutePluginWithConfigurations<RequireUnsecureConfigurationPlugin>(pluginContext, "unsecure-config", string.Empty);
        }

        [TestMethod]
        [ExpectedException(typeof(InvalidPluginExecutionException))]
        public void TestUnsecureConfigurationAttributeFailure()
        {
            var fakeContext = new XrmFakedContext();
            var pluginContext = new XrmFakedPluginExecutionContext();

            fakeContext.ExecutePluginWith<RequireUnsecureConfigurationPlugin>(pluginContext);
        }

        #endregion

        #region RequireBothConfigurationsPlugin

        [TestMethod]
        public void TestBothConfigurationsAttribute()
        {
            var fakeContext = new XrmFakedContext();
            var pluginContext = new XrmFakedPluginExecutionContext();

            fakeContext.ExecutePluginWithConfigurations<RequireBothConfigurationsPlugin>(pluginContext, "unsecure-config", "secure-config");
        }

        [TestMethod]
        [ExpectedException(typeof(InvalidPluginExecutionException))]
        public void TestBothConfigurationsAttributeFailure()
        {
            var fakeContext = new XrmFakedContext();
            var pluginContext = new XrmFakedPluginExecutionContext();

            fakeContext.ExecutePluginWith<RequireBothConfigurationsPlugin>(pluginContext);
        }

        [TestMethod]
        [ExpectedException(typeof(InvalidPluginExecutionException))]
        public void TestBothConfigurationsAttributeFailure2()
        {
            var fakeContext = new XrmFakedContext();
            var pluginContext = new XrmFakedPluginExecutionContext();

            fakeContext.ExecutePluginWithConfigurations<RequireBothConfigurationsPlugin>(pluginContext, default, "secure-config");
        }

        #endregion

        #region RequireExecutionModeAsyncPlugin

        [TestMethod]
        public void TestExecutionModeAsyncAttribute()
        {
            var fakeContext = new XrmFakedContext();
            var pluginContext = new XrmFakedPluginExecutionContext() { Mode = (int)ExecutionMode.Asynchronous };

            fakeContext.ExecutePluginWith<RequireExecutionModeAsyncPlugin>(pluginContext);
        }

        [TestMethod]
        [ExpectedException(typeof(InvalidPluginExecutionException))]
        public void TestExecutionModeAsyncAttributeFailure()
        {
            var fakeContext = new XrmFakedContext();
            var pluginContext = new XrmFakedPluginExecutionContext() { Mode = (int)ExecutionMode.Synchronous };

            fakeContext.ExecutePluginWith<RequireExecutionModeAsyncPlugin>(pluginContext);
        }

        #endregion

        #region RequireExecutionModeSyncPlugin

        [TestMethod]
        public void TestExecutionModeSyncAttribute()
        {
            var fakeContext = new XrmFakedContext();
            var pluginContext = new XrmFakedPluginExecutionContext() { Mode = (int)ExecutionMode.Synchronous };

            fakeContext.ExecutePluginWith<RequireExecutionModeSyncPlugin>(pluginContext);
        }

        [TestMethod]
        [ExpectedException(typeof(InvalidPluginExecutionException))]
        public void TestExecutionModeSyncAttributeFailure()
        {
            var fakeContext = new XrmFakedContext();
            var pluginContext = new XrmFakedPluginExecutionContext() { Mode = (int)ExecutionMode.Asynchronous };

            fakeContext.ExecutePluginWith<RequireExecutionModeSyncPlugin>(pluginContext);
        }

        #endregion

        #region RequireInitiatingUserPlugin

        [TestMethod]
        public void TestInitiatingUserAttribute()
        {
            var fakeContext = new XrmFakedContext();
            var pluginContext = new XrmFakedPluginExecutionContext() { InitiatingUserId = Guid.Parse("EC8DAEB6-FF3B-478B-88AB-6058A00B7818") };

            fakeContext.ExecutePluginWith<RequireInitiatingUserPlugin>(pluginContext);
        }

        [TestMethod]
        [ExpectedException(typeof(InvalidPluginExecutionException))]
        public void TestInitiatingUserAttributeFailure()
        {
            var fakeContext = new XrmFakedContext();
            var pluginContext = new XrmFakedPluginExecutionContext() { InitiatingUserId = Guid.Parse("00000000-0000-0000-0000-000000000000") };

            fakeContext.ExecutePluginWith<RequireInitiatingUserPlugin>(pluginContext);
        }

        #endregion

        #region RequireInvalidInitiatingUserPlugin

        [TestMethod]
        [ExpectedException(typeof(InvalidPluginExecutionException))]
        public void TestInvalidInitiatingUserAttributeFailure()
        {
            var fakeContext = new XrmFakedContext();
            var pluginContext = new XrmFakedPluginExecutionContext() { InitiatingUserId = Guid.Parse("00000000-0000-0000-0000-000000000000") };

            fakeContext.ExecutePluginWith<RequireInvalidInitiatingUserPlugin>(pluginContext);
        }

        #endregion

        #region RequirePreImagePlugin

        [TestMethod]
        [Obsolete]
        public void TestPreImageAttribute()
        {
            var fakeContext = new XrmFakedContext();
            var target = new Entity("account") { Id = Guid.NewGuid() };
            var entityImages = new EntityImageCollection();

            entityImages.Add("PreImage", target);

            fakeContext.ExecutePluginWithTargetAndPreEntityImages<RequirePreImagePlugin>(target, entityImages, default, default);
        }

        [TestMethod]
        [ExpectedException(typeof(InvalidPluginExecutionException))]
        public void TestPreImageAttributeFailure()
        {
            var fakeContext = new XrmFakedContext();
            var target = new Entity("account") { Id = Guid.NewGuid() };

            // Run the plugin without pre-entity images.
            fakeContext.ExecutePluginWithTarget<RequirePreImagePlugin>(target, default, 10);
        }

        #endregion

        #region RequirePostImagePlugin

        [TestMethod]
        [Obsolete]
        public void TestPostImageAttribute()
        {
            var fakeContext = new XrmFakedContext();
            var target = new Entity("account") { Id = Guid.NewGuid() };
            var entityImages = new EntityImageCollection();

            entityImages.Add("PostImage", target);

            fakeContext.ExecutePluginWithTargetAndPostEntityImages<RequirePostImagePlugin>(target, entityImages, default, default);
        }

        [TestMethod]
        [ExpectedException(typeof(InvalidPluginExecutionException))]
        public void TestPostImageAttributeFailure()
        {
            var fakeContext = new XrmFakedContext();
            var target = new Entity("account") { Id = Guid.NewGuid() };

            // Run the plugin without pre-entity images.
            fakeContext.ExecutePluginWithTarget<RequirePostImagePlugin>(target, default, 10);
        }

        #endregion

        #region RequireStagePlugin

        [TestMethod]
        public void TestStageAttribute()
        {
            var fakeContext = new XrmFakedContext();
            var target = new Entity("account") { Id = Guid.NewGuid() };

            // Run the plugin in stage 10 (required)
            fakeContext.ExecutePluginWithTarget<RequireStagePlugin>(target, default, 10);
        }

        [TestMethod]
        [ExpectedException(typeof(InvalidPluginExecutionException))]
        public void TestStageAttributeFailure()
        {
            var fakeContext = new XrmFakedContext();
            var target = new Entity("account") { Id = Guid.NewGuid() };

            // Run the plugin in stage 40.
            fakeContext.ExecutePluginWithTarget<RequireStagePlugin>(target, default, 40);
        }

        #endregion

        #region RequireMultipleStagePlugin

        [TestMethod]
        public void TestMultipleStageAttribute()
        {
            var fakeContext = new XrmFakedContext();
            var target = new Entity("account") { Id = Guid.NewGuid() };

            // Run the plugin in stage 10 (required)
            fakeContext.ExecutePluginWithTarget<RequireMultipleStagePlugin>(target, default, 20);
            fakeContext.ExecutePluginWithTarget<RequireMultipleStagePlugin>(target, default, 40);
        }

        [TestMethod]
        [ExpectedException(typeof(InvalidPluginExecutionException))]
        public void TestMultipleStageAttributeFailure()
        {
            var fakeContext = new XrmFakedContext();
            var target = new Entity("account") { Id = Guid.NewGuid() };

            // Run the plugin in stage 40.
            fakeContext.ExecutePluginWithTarget<RequireMultipleStagePlugin>(target, default, 10);
        }

        #endregion

        #region RequireTargetEntityPlugin

        [TestMethod]
        public void TestNoTargetAttribute()
        {
            var fakeContext = new XrmFakedContext();
            var pluginContext = new XrmFakedPluginExecutionContext();

            fakeContext.ExecutePluginWith<RequireNoTargetPlugin>(pluginContext);
        }

        [TestMethod]
        [ExpectedException(typeof(InvalidPluginExecutionException))]
        public void TestNoTargetAttributeFailure()
        {
            var fakeContext = new XrmFakedContext();
            var target = new Entity("account") { Id = Guid.NewGuid() };

            fakeContext.ExecutePluginWithTarget<RequireNoTargetPlugin>(target);
        }

        #endregion

        #region RequireTargetEntityPlugin

        [TestMethod]
        public void TestTargetEntityAttribute()
        {
            var fakeContext = new XrmFakedContext();
            var target = new Entity("account") { Id = Guid.NewGuid() };

            fakeContext.ExecutePluginWithTarget<RequireTargetEntityPlugin>(target);
        }

        [TestMethod]
        [ExpectedException(typeof(InvalidPluginExecutionException))]
        public void TestTargetEntityAttributeFailure()
        {
            var fakeContext = new XrmFakedContext();
            var pluginContext = new XrmFakedPluginExecutionContext();

            fakeContext.ExecutePluginWith<RequireTargetEntityPlugin>(pluginContext);
        }

        #endregion

        #region RequireTargetEntityReferencePlugin

        [TestMethod]
        public void TestTargetEntityReferenceAttribute()
        {
            var fakeContext = new XrmFakedContext();
            var target = new EntityReference("account") { Id = Guid.NewGuid() };

            fakeContext.ExecutePluginWithTargetReference<RequireTargetEntityReferencePlugin>(target);
        }

        [TestMethod]
        [ExpectedException(typeof(InvalidPluginExecutionException))]
        public void TestTargetEntityReferenceAttributeFailure()
        {
            var fakeContext = new XrmFakedContext();
            var pluginContext = new XrmFakedPluginExecutionContext();

            fakeContext.ExecutePluginWith<RequireTargetEntityReferencePlugin>(pluginContext);
        }

        #endregion

        #region RequireTargetEntityReferencePlugin

        [TestMethod]
        public void TestTargetEntityOrEntityReferenceAttribute()
        {
            var fakeContext = new XrmFakedContext();
            var entityTarget = new Entity("account") { Id = Guid.NewGuid() };
            var entityReferencetarget = new EntityReference("account") { Id = Guid.NewGuid() };

            fakeContext.ExecutePluginWithTarget<RequireTargetEntityOrEntityReferencePlugin>(entityTarget);
            fakeContext.ExecutePluginWithTargetReference<RequireTargetEntityOrEntityReferencePlugin>(entityReferencetarget);
        }

        [TestMethod]
        [ExpectedException(typeof(InvalidPluginExecutionException))]
        public void TestTargetEntityOrEntityReferenceAttributeFailure()
        {
            var fakeContext = new XrmFakedContext();
            var pluginContext = new XrmFakedPluginExecutionContext();

            fakeContext.ExecutePluginWith<RequireTargetEntityOrEntityReferencePlugin>(pluginContext);
        }

        #endregion

        #region RequireTransactionPlugin

        [TestMethod]
        public void TestTransactionAttribute()
        {
            var fakeContext = new XrmFakedContext();
            var target = new Entity("account") { Id = Guid.NewGuid() };

            // Run the plugin in stage 40 (default)
            fakeContext.ExecutePluginWithTarget<RequireTransactionPlugin>(target);
        }

        [TestMethod]
        [ExpectedException(typeof(InvalidPluginExecutionException))]
        public void TestTransactionAttributeFailure()
        {
            var fakeContext = new XrmFakedContext();
            var target = new Entity("account") { Id = Guid.NewGuid() };

            // Run the plugin in stage 10 (outside the transaction)
            fakeContext.ExecutePluginWithTarget<RequireTransactionPlugin>(target, default, 10);
        }

        #endregion
    }

    #region Plugin Examples

    [AllowedEntity("account", PluginEntityType.Primary)]
    public class AllowedEntityPlugin : DynamicsPlugin
    {
        public override void Execute()
        {
            Plugin.Trace(TraceLevel.Info, $"Plugin {Configuration.PluginType.Name} executed successfully");
        }
    }

    [AllowedEntity("account", PluginEntityType.Primary)]
    [AllowedEntity("contact", PluginEntityType.Primary)]
    public class MultipleAllowedEntityPlugin : DynamicsPlugin
    {
        public override void Execute()
        {
            Plugin.Trace(TraceLevel.Info, $"Plugin {Configuration.PluginType.Name} executed successfully");
        }
    }

    [AllowedMessage("Create")]
    public class AllowedMessagePlugin : DynamicsPlugin
    {
        public override void Execute()
        {
            Plugin.Trace(TraceLevel.Info, $"Plugin {Configuration.PluginType.Name} executed successfully");
        }
    }

    [AllowedMessage("Create")]
    [AllowedMessage("Update")]
    public class MultipleAllowedMessagePlugin : DynamicsPlugin
    {
        public override void Execute()
        {
            Plugin.Trace(TraceLevel.Info, $"Plugin {Configuration.PluginType.Name} executed successfully");
        }
    }

    [RequireConfiguration(PluginConfigurationType.Secure)]
    public class RequireSecureConfigurationPlugin : DynamicsPlugin
    {
        public RequireSecureConfigurationPlugin()
            : base()
        {
        }

        public RequireSecureConfigurationPlugin(string unsecure, string secure)
            : base(unsecure, secure)
        {
        }

        public override void Execute()
        {
            Plugin.Trace(TraceLevel.Info, $"Plugin {Configuration.PluginType.Name} executed successfully");
        }
    }

    [RequireConfiguration(PluginConfigurationType.Unsecure)]
    public class RequireUnsecureConfigurationPlugin : DynamicsPlugin
    {
        public RequireUnsecureConfigurationPlugin()
            : base()
        {
        }
        public RequireUnsecureConfigurationPlugin(string unsecure, string secure)
            : base(unsecure, secure)
        {
        }
        public override void Execute()
        {
            Plugin.Trace(TraceLevel.Info, $"Plugin {Configuration.PluginType.Name} executed successfully");
        }
    }

    [RequireConfiguration(PluginConfigurationType.Both)]
    public class RequireBothConfigurationsPlugin : DynamicsPlugin
    {
        public RequireBothConfigurationsPlugin()
            : base()
        {
        }

        public RequireBothConfigurationsPlugin(string unsecure, string secure)
            : base(unsecure, secure)
        {
        }

        public override void Execute()
        {
            Plugin.Trace(TraceLevel.Info, $"Plugin {Configuration.PluginType.Name} executed successfully");
        }
    }

    [RequireExecutionMode(ExecutionMode.Asynchronous)]
    public class RequireExecutionModeAsyncPlugin : DynamicsPlugin
    {
        public override void Execute()
        {
            Plugin.Trace(TraceLevel.Info, $"Plugin {Configuration.PluginType.Name} executed successfully");
        }
    }

    [RequireExecutionMode(ExecutionMode.Synchronous)]
    public class RequireExecutionModeSyncPlugin : DynamicsPlugin
    {
        public override void Execute()
        {
            Plugin.Trace(TraceLevel.Info, $"Plugin {Configuration.PluginType.Name} executed successfully");
        }
    }

    [RequireInitiatingUser("EC8DAEB6-FF3B-478B-88AB-6058A00B7818")]
    public class RequireInitiatingUserPlugin : DynamicsPlugin
    {
        public override void Execute()
        {
            Plugin.Trace(TraceLevel.Info, $"Plugin {Configuration.PluginType.Name} executed successfully");
        }
    }

    [RequireInitiatingUser("invalid")]
    public class RequireInvalidInitiatingUserPlugin : DynamicsPlugin
    {
        public override void Execute()
        {
            Plugin.Trace(TraceLevel.Error, $"Plugin {Configuration.PluginType.Name} will never be able to execute.");
        }
    }

    [RequirePreImage("PreImage")]
    public class RequirePreImagePlugin : DynamicsPlugin
    {
        public override void Execute()
        {
            Plugin.Trace(TraceLevel.Info, $"Plugin {Configuration.PluginType.Name} executed successfully");
        }
    }

    [RequirePostImage("PostImage")]
    public class RequirePostImagePlugin : DynamicsPlugin
    {
        public override void Execute()
        {
            Plugin.Trace(TraceLevel.Info, $"Plugin {Configuration.PluginType.Name} executed successfully");
        }
    }

    [RequireStage(PluginStage.PreValidation)]
    public class RequireStagePlugin : DynamicsPlugin
    {
        public override void Execute()
        {
            Plugin.Trace(TraceLevel.Info, $"Plugin {Configuration.PluginType.Name} executed successfully");
        }
    }

    [RequireStage(PluginStage.PreOperation | PluginStage.PostOperation)]
    public class RequireMultipleStagePlugin : DynamicsPlugin
    {
        public override void Execute()
        {
            Plugin.Trace(TraceLevel.Info, $"Plugin {Configuration.PluginType.Name} executed successfully");
        }
    }

    [RequireTarget(PluginContextTargetType.None)]
    public class RequireNoTargetPlugin : DynamicsPlugin
    {
        public override void Execute()
        {
            Plugin.Trace(TraceLevel.Info, $"Plugin {Configuration.PluginType.Name} executed successfully");
        }
    }

    [RequireTarget(PluginContextTargetType.Entity)]
    public class RequireTargetEntityPlugin : DynamicsPlugin
    {
        public override void Execute()
        {
            Plugin.Trace(TraceLevel.Info, $"Plugin {Configuration.PluginType.Name} executed successfully");
        }
    }

    [RequireTarget(PluginContextTargetType.EntityReference)]
    public class RequireTargetEntityReferencePlugin : DynamicsPlugin
    {
        public override void Execute()
        {
            Plugin.Trace(TraceLevel.Info, $"Plugin {Configuration.PluginType.Name} executed successfully");
        }
    }

    [RequireTarget(PluginContextTargetType.Entity | PluginContextTargetType.EntityReference)]
    public class RequireTargetEntityOrEntityReferencePlugin : DynamicsPlugin
    {
        public override void Execute()
        {
            Plugin.Trace(TraceLevel.Info, $"Plugin {Configuration.PluginType.Name} executed successfully");
        }
    }

    [RequireTransaction()]
    public class RequireTransactionPlugin : DynamicsPlugin
    {
        public override void Execute()
        {
            Plugin.Trace(TraceLevel.Info, $"Plugin {Configuration.PluginType.Name} executed successfully");
        }
    }

    #endregion
}
