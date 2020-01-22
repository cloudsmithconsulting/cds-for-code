using System;
using CloudSmith.Dynamics365.CrmSvcUtil.Cache;
using CloudSmith.Dynamics365.CrmSvcUtil.Configuration;
using CloudSmith.Dynamics365.CrmSvcUtil.Configuration.Filter;
using Microsoft.Crm.Services.Utility;
using Microsoft.Xrm.Sdk.Metadata;

namespace CloudSmith.Dynamics365.CrmSvcUtil.Filter
{
    public class ExactMatchFilterService : FilterListFilterService
    {
        internal ExactMatchFilterService(BaseFilterService service, FilterListStrategy strategy)
            : base(service, strategy)
        { }

        public ExactMatchFilterService(ICodeWriterFilterService defaultService)
            : base(defaultService)
        { }

        internal ExactMatchFilterService(ICodeWriterFilterService defaultService, IServiceExtensionsConfiguration configuration)
            : base(defaultService, configuration)
        { }

        internal ExactMatchFilterService(ICodeWriterFilterService defaultService, IServiceExtensionsConfiguration configuration, FilterListStrategy strategy)
            : base(defaultService, configuration, strategy)
        { }

        public ExactMatchFilterService(ICodeWriterMessageFilterService defaultService)
            : base(defaultService)
        { }

        internal ExactMatchFilterService(ICodeWriterMessageFilterService defaultService, IServiceExtensionsConfiguration configuration)
            : base(defaultService, configuration)
        { }

        internal ExactMatchFilterService(ICodeWriterMessageFilterService defaultService, IServiceExtensionsConfiguration configuration, FilterListStrategy strategy)
            : base(defaultService, configuration, strategy)
        { }

        protected override bool? GenerateOptionSet(OptionSetMetadataBase optionSetMetadata)
        {
            var key = DynamicsMetadataCache.OptionSets.ParseKey(optionSetMetadata);

            if (FilterConfiguration?.OptionSets[key] != null)
                return true;

            return null;
        }

        protected override bool? GenerateEntity(EntityMetadata entityMetadata)
        {
            var key = DynamicsMetadataCache.Entities.ParseKey(entityMetadata);

            if (FilterConfiguration?.Entities[key] != null)
                return true;
 
            return null;
        }

        protected override bool? GenerateAttribute(AttributeMetadata attributeMetadata)
        {
            var key = DynamicsMetadataCache.Attributes.ParseKey(attributeMetadata);

            if (FilterConfiguration?.Attributes[key] != null)
                return true;

            return null;
        }

        protected override bool? GenerateRelationship(RelationshipMetadataBase relationshipMetadata, EntityMetadata otherEntityMetadata)
        {
            return null;
        }

        protected override bool? GenerateOption(OptionMetadata optionMetadata)
        {
            return null;
        }

        protected override bool? GenerateSdkMessage(SdkMessage sdkMessage)
        {
            return null;
        }

        protected override bool? GenerateSdkMessagePair(SdkMessagePair sdkMessagePair)
        {
            return null;
        }
    }
}