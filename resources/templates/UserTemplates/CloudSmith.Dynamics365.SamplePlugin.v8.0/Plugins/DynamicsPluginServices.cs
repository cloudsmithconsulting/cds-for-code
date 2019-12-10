using Microsoft.Xrm.Sdk;
using System;
using System.Collections.Generic;
using System.Diagnostics;

namespace #{Namespace}.Plugins
{
    public sealed class DynamicsPluginServices
    {
        /// <summary>
        /// Creates an instance of DynamicsPluginServices that can be used inside a plugin.
        /// </summary>
        /// <param name="serviceProvider">The serviceProvider instance that locates services to use.</param>
        public DynamicsPluginServices(IServiceProvider serviceProvider)
        {
            Tracing = (ITracingService)serviceProvider.GetService(typeof(ITracingService));
            Context = (IPluginExecutionContext)serviceProvider.GetService(typeof(IPluginExecutionContext));
            ServiceFactory = (IOrganizationServiceFactory)serviceProvider.GetService(typeof(IOrganizationServiceFactory));
            NotificationService = (IServiceEndpointNotificationService)serviceProvider.GetService(typeof(IServiceEndpointNotificationService));
            ValidationErrors = new Dictionary<string, IList<string>>();
        }

        private MembershipService _membershipService;
        private MetadataService _metadataService;
        private IOrganizationService _organizationService;
        internal IOrganizationServiceFactory ServiceFactory { get; private set; }
        internal ITracingService Tracing { get; private set; }

        /// <summary>
        /// Gets the <see cref="IPluginExecutionContext"/> for the current plugin execution.
        /// </summary>
        public IPluginExecutionContext Context { get; private set; }

        /// <summary>
        /// Gets the <see cref="MembershipService"/> that can be used to interrogate user membership or security roles.
        /// </summary>
        public MembershipService MembershipService
        {
            get
            {
                if (_membershipService == null)
                {
                    _membershipService = new MembershipService(OrganizationService);
                }

                return _membershipService;
            }
        }

        /// <summary>
        /// Gets the <see cref="MetadataService"/> that can be used to interrogate entity metadata.
        /// </summary>
        public MetadataService MetadataService
        {
            get
            {
                if (_metadataService == null)
                {
                    _metadataService = new MetadataService(OrganizationService);
                }

                return _metadataService;
            }
        }

        /// <summary>
        /// Gets the <see cref="IServiceEndpointNotificationService"/> that can be used to communicate with Azure Service Bus.
        /// </summary>
        public IServiceEndpointNotificationService NotificationService { get; private set; }

        /// <summary>
        /// Gets the <see cref="IOrganizationService"/> under the current user context that can be used to communicate with Dynamics CRM.
        /// </summary>
        /// <remarks>
        /// By default, the service will lazy load with the context of the user specified in plugin registration.  Use the
        /// SetUserContext method to change the context.
        /// </remarks>
        public IOrganizationService OrganizationService
        {
            get
            {
                if (_organizationService == null)
                {
                    _organizationService = CreateOrganizationService();
                }

                return _organizationService;
            }
        }

        /// <summary>
        /// Gets a list of ValidationErrors that were collected before the plugin was executed.
        /// </summary>
        public IDictionary<string, IList<string>> ValidationErrors { get; private set; }

        internal IOrganizationService CreateOrganizationService()
        {
            return ServiceFactory.CreateOrganizationService(Context.UserId);
        }

        internal IOrganizationService CreateOrganizationService(Guid userId)
        {
            return ServiceFactory.CreateOrganizationService(userId);
        }

        /// <summary>
        /// Gets an entity pre-image by name.
        /// </summary>
        /// <typeparam name="T">The type of entity to return</typeparam>
        /// <param name="imageName">The name of the pre-image.</param>
        /// <returns>An entity image.</returns>
        public T GetPreImage<T>(string imageName)
            where T : Entity
        {
            if (Context.PreEntityImages != null 
                && Context.PreEntityImages.ContainsKey(imageName) 
                && Context.PreEntityImages[imageName] is Entity)
            {
                return Context.PreEntityImages[imageName] as T;
            }

            return default;
        }

        /// <summary>
        /// Gets an entity post-image by name.
        /// </summary>
        /// <typeparam name="T">The type of entity to return</typeparam>
        /// <param name="imageName">The name of the post-image.</param>
        /// <returns>An entity image.</returns>
        public T GetPostImage<T>(string imageName)
            where T : Entity
        {
            if (Context.PostEntityImages != null 
                && Context.PostEntityImages.ContainsKey(imageName) 
                && Context.PostEntityImages[imageName] is Entity)
            {
                return Context.PostEntityImages[imageName] as T;
            }

            return default;
        }

        /// <summary>
        /// Gets the Target entity from the InputParameters collection.
        /// </summary>
        /// <typeparam name="T">The type of entity to return</typeparam>
        /// <returns>An entity image.</returns>
        public T GetTarget<T>()
            where T : Entity
        {
            if (Context.InputParameters != null 
                && Context.InputParameters.ContainsKey("Target") 
                && Context.InputParameters["Target"] is Entity)
            {
                return Context.InputParameters["Target"] as T;
            }

            return null;
        }

        /// <summary>
        /// Gets the Target entity reference from the InputParameters collection.
        /// </summary>
        /// <returns>An entity reference.</returns>
        public EntityReference GetTargetReference()
        {
            if (Context.InputParameters != null 
                && Context.InputParameters.ContainsKey("Target") 
                && Context.InputParameters["Target"] is EntityReference)
            {
                return Context.InputParameters["Target"] as EntityReference;
            }

            return null;
        }

        /// <summary>
        /// Changes the user context for the current <see cref="IOrganizationService"/>.
        /// </summary>
        /// <param name="userId">The new userId to use.</param>
        public void SetUserContext(Guid userId)
        {
            _organizationService = CreateOrganizationService(userId);
        }

        /// <summary>
        /// Emits a message to the trace log.
        /// </summary>
        /// <param name="message">The message to emit.</param>
        public void Trace(string message)
        {
            Trace(TraceLevel.Info, message);
        }

        /// <summary>
        /// Emits a message to the trace log with a specific severity.
        /// </summary>
        /// <param name="level">The severity of the message.</param>
        /// <param name="message">The message to emit.</param>
        public void Trace(TraceLevel level, string message)
        {
            Tracing.Trace("[{0}] {1}: {2}\n", DateTime.Now.ToString("u"), level.ToString().ToUpper(), message);
        }

        /// <summary>
        /// Throws an exception and stops further plugin processing.
        /// </summary>
        /// <param name="message">The message to be displayed in the exception.</param>
        public void Fail(string message)
        {
            throw new InvalidPluginExecutionException(message);
        }

        /// <summary>
        /// Throws an exception and stops further plugin processing.
        /// </summary>
        /// <param name="status">The status of the plugin upon processing the exception.</param>
        /// <param name="message">The message to be displayed in the exception.</param>
        public void Fail(OperationStatus status, string message)
        {
            throw new InvalidPluginExecutionException(status, message);
        }
    }
}