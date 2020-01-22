using System;
using System.Diagnostics;
using CloudSmith.Dynamics365.CrmSvcUtil.Configuration;
using Microsoft.Crm.Services.Utility;
using Microsoft.Xrm.Sdk.Metadata;

namespace CloudSmith.Dynamics365.CrmSvcUtil.Filter
{
    public abstract class BaseFilterService : ICodeWriterFilterService, ICodeWriterMessageFilterService
    {
        protected BaseFilterService(BaseFilterService service)
        {
            DefaultServices = service.DefaultServices;
            Configuration = service.Configuration;
        }

        protected BaseFilterService(ICodeWriterFilterService defaultService)
            : this(defaultService, ServiceExtensionsConfigurationSection.Create())
        { }

        protected BaseFilterService(ICodeWriterFilterService defaultService, IServiceExtensionsConfiguration configuration)
            : base()
        {
            DefaultServices = new Tuple<ICodeWriterFilterService, ICodeWriterMessageFilterService>(defaultService, null);
            Configuration = configuration;
        }

        protected BaseFilterService(ICodeWriterMessageFilterService defaultService)
            : this(defaultService, ServiceExtensionsConfigurationSection.Create())
        { }

        protected BaseFilterService(ICodeWriterMessageFilterService defaultService, IServiceExtensionsConfiguration configuration)
            : base()
        {
            DefaultServices = new Tuple<ICodeWriterFilterService, ICodeWriterMessageFilterService>(null, defaultService);
            Configuration = configuration;
        }

        protected TraceSource Trace { get => new TraceSource(Constants.Diagnostics.TraceSource, SourceLevels.Information); }
        protected Tuple<ICodeWriterFilterService, ICodeWriterMessageFilterService> DefaultServices { get; }
        protected IServiceExtensionsConfiguration Configuration { get; }

        public virtual bool GenerateAttribute(AttributeMetadata attributeMetadata, IServiceProvider services)
        {
            return DefaultServices.Item1.GenerateAttribute(attributeMetadata, services);
        }

        public virtual bool GenerateEntity(EntityMetadata entityMetadata, IServiceProvider services)
        {
            return DefaultServices.Item1.GenerateEntity(entityMetadata, services);
        }

        public virtual bool GenerateOption(OptionMetadata optionMetadata, IServiceProvider services)
        {
            return DefaultServices.Item1.GenerateOption(optionMetadata, services);
        }

        public virtual bool GenerateOptionSet(OptionSetMetadataBase optionSetMetadata, IServiceProvider services)
        {
            return DefaultServices.Item1.GenerateOptionSet(optionSetMetadata, services);
        }

        public virtual bool GenerateRelationship(RelationshipMetadataBase relationshipMetadata, EntityMetadata otherEntityMetadata, IServiceProvider services)
        {
            return DefaultServices.Item1.GenerateRelationship(relationshipMetadata, otherEntityMetadata, services);
        }

        public virtual bool GenerateSdkMessage(SdkMessage sdkMessage, IServiceProvider services)
        {
            return DefaultServices.Item2.GenerateSdkMessage(sdkMessage, services);
        }

        public virtual bool GenerateSdkMessagePair(SdkMessagePair sdkMessagePair, IServiceProvider services)
        {
            return DefaultServices.Item2.GenerateSdkMessagePair(sdkMessagePair, services);
        }

        public virtual bool GenerateServiceContext(IServiceProvider services)
        {
            return DefaultServices.Item1.GenerateServiceContext(services);
        }
    }
}