using CloudSmith.Dynamics365.CrmSvcUtil.Configuration;
using Microsoft.Crm.Services.Utility;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Metadata;
using System;
using System.Diagnostics;

namespace CloudSmith.Dynamics365.CrmSvcUtil.Naming
{
    public abstract class BaseNamingService : INamingService
    {
        protected BaseNamingService(BaseNamingService service)
        {
            DefaultService = service.DefaultService;
            Configuration = service.Configuration;
        }

        protected BaseNamingService(INamingService defaultService)
            : this(defaultService, ServiceExtensionsConfigurationSection.Create())
        { }

        protected BaseNamingService(INamingService defaultService, IServiceExtensionsConfiguration configuration)
            : base()
        {
            DefaultService = defaultService;
            Configuration = configuration;
        }

        protected TraceSource Trace { get => new TraceSource(Constants.Diagnostics.TraceSource, SourceLevels.Information); }
        protected INamingService DefaultService { get; }
        protected IServiceExtensionsConfiguration Configuration { get; }

        public virtual string GetNameForAttribute(EntityMetadata entityMetadata, AttributeMetadata attributeMetadata, IServiceProvider services)
        {
            return DefaultService.GetNameForAttribute(entityMetadata, attributeMetadata, services);
        }

        public virtual string GetNameForEntity(EntityMetadata entityMetadata, IServiceProvider services)
        {
            return DefaultService.GetNameForEntity(entityMetadata, services);  
        }

        public virtual string GetNameForEntitySet(EntityMetadata entityMetadata, IServiceProvider services)
        {
            return DefaultService.GetNameForEntitySet(entityMetadata, services);
        }

        public virtual string GetNameForMessagePair(SdkMessagePair messagePair, IServiceProvider services)
        {
            return DefaultService.GetNameForMessagePair(messagePair, services);
        }

        public virtual string GetNameForOption(OptionSetMetadataBase optionSetMetadata, OptionMetadata optionMetadata, IServiceProvider services)
        {
            return DefaultService.GetNameForOption(optionSetMetadata, optionMetadata, services);
        }

        public virtual string GetNameForOptionSet(EntityMetadata entityMetadata, OptionSetMetadataBase optionSetMetadata, IServiceProvider services)
        {
            return DefaultService.GetNameForOptionSet(entityMetadata, optionSetMetadata, services);
        }

        public virtual string GetNameForRelationship(EntityMetadata entityMetadata, RelationshipMetadataBase relationshipMetadata, EntityRole? reflexiveRole, IServiceProvider services)
        {
            return DefaultService.GetNameForRelationship(entityMetadata, relationshipMetadata, reflexiveRole, services);
        }

        public virtual string GetNameForRequestField(SdkMessageRequest request, SdkMessageRequestField requestField, IServiceProvider services)
        {
            return DefaultService.GetNameForRequestField(request, requestField, services);
        }

        public virtual string GetNameForResponseField(SdkMessageResponse response, SdkMessageResponseField responseField, IServiceProvider services)
        {
            return DefaultService.GetNameForResponseField(response, responseField, services);
        }

        public virtual string GetNameForServiceContext(IServiceProvider services)
        {
            return DefaultService.GetNameForServiceContext(services);
        }
    }
}
