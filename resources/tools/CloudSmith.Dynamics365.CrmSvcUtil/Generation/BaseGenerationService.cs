using CloudSmith.Dynamics365.CrmSvcUtil.Configuration;
using Microsoft.Crm.Services.Utility;
using Microsoft.Xrm.Sdk.Metadata;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CloudSmith.Dynamics365.CrmSvcUtil.Generation
{
    public abstract class BaseGenerationService : ICodeGenerationService
    {
        internal BaseGenerationService(BaseGenerationService service)
        {
            Configuration = service.Configuration;
        }

        protected BaseGenerationService(ICodeGenerationService defaultService)
            : this(defaultService, ServiceExtensionsConfigurationSection.Create())
        { }

        protected BaseGenerationService(ICodeGenerationService defaultService, IServiceExtensionsConfiguration configuration)
            : base()
        {
            DefaultService = defaultService;
            Configuration = configuration;
        }

        protected TraceSource Trace { get => new TraceSource(Constants.Diagnostics.TraceSource, SourceLevels.Information); }
        protected ICodeGenerationService DefaultService { get; }
        protected IServiceExtensionsConfiguration Configuration { get; }

        public virtual CodeGenerationType GetTypeForAttribute(EntityMetadata entityMetadata, AttributeMetadata attributeMetadata, IServiceProvider services)
        {
            return (DefaultService != null) 
                ? DefaultService.GetTypeForAttribute(entityMetadata, attributeMetadata, services)
                : CodeGenerationType.Property;
        }

        public CodeGenerationType GetTypeForEntity(EntityMetadata entityMetadata, IServiceProvider services)
        {
            return (DefaultService != null) 
                ? DefaultService.GetTypeForEntity(entityMetadata, services)
                : CodeGenerationType.Class;
        }

        public CodeGenerationType GetTypeForMessagePair(SdkMessagePair messagePair, IServiceProvider services)
        {
            return (DefaultService != null)
                ? DefaultService.GetTypeForMessagePair(messagePair, services)
                : CodeGenerationType.Class;
        }

        public CodeGenerationType GetTypeForOption(OptionSetMetadataBase optionSetMetadata, OptionMetadata optionMetadata, IServiceProvider services)
        {
            return (DefaultService != null)
                ? DefaultService.GetTypeForOption(optionSetMetadata, optionMetadata, services)
                : CodeGenerationType.Field;
        }

        public CodeGenerationType GetTypeForOptionSet(EntityMetadata entityMetadata, OptionSetMetadataBase optionSetMetadata, IServiceProvider services)
        {
            return (DefaultService != null)
                ? DefaultService.GetTypeForOptionSet(entityMetadata, optionSetMetadata, services)
                : CodeGenerationType.Enum;
        }

        public CodeGenerationType GetTypeForRequestField(SdkMessageRequest request, SdkMessageRequestField requestField, IServiceProvider services)
        {
            return (DefaultService != null)
                ? DefaultService.GetTypeForRequestField(request, requestField, services)
                : CodeGenerationType.Property;
        }

        public CodeGenerationType GetTypeForResponseField(SdkMessageResponse response, SdkMessageResponseField responseField, IServiceProvider services)
        {
            return (DefaultService != null)
                ? DefaultService.GetTypeForResponseField(response, responseField, services)
                : CodeGenerationType.Property;
        }

        public abstract void Write(IOrganizationMetadata organizationMetadata, string language, string outputFile, string targetNamespace, IServiceProvider services);
    }
}
