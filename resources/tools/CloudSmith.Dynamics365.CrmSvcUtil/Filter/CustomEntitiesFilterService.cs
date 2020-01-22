using CloudSmith.Dynamics365.CrmSvcUtil.Configuration;
using CloudSmith.Dynamics365.CrmSvcUtil.Configuration.Filter;
using Microsoft.Crm.Services.Utility;
using Microsoft.Xrm.Sdk.Metadata;
using System;
using System.Diagnostics;

namespace CloudSmith.Dynamics365.CrmSvcUtil.Filter
{
    public class CustomEntitiesFilterService : FilterListFilterService
    {
        internal CustomEntitiesFilterService(BaseFilterService service, FilterListStrategy strategy)
            : base(service, strategy)
        { }

        public CustomEntitiesFilterService(ICodeWriterFilterService defaultService)
            : base(defaultService)
        { }

        internal CustomEntitiesFilterService(ICodeWriterFilterService defaultService, IServiceExtensionsConfiguration configuration)
            : base(defaultService, configuration)
        { }

        internal CustomEntitiesFilterService(ICodeWriterFilterService defaultService, IServiceExtensionsConfiguration configuration, FilterListStrategy strategy)
            : base(defaultService, configuration, strategy)
        { }

        public CustomEntitiesFilterService(ICodeWriterMessageFilterService defaultService)
            : base(defaultService)
        { }

        internal CustomEntitiesFilterService(ICodeWriterMessageFilterService defaultService, IServiceExtensionsConfiguration configuration)
            : base(defaultService, configuration)
        { }

        internal CustomEntitiesFilterService(ICodeWriterMessageFilterService defaultService, IServiceExtensionsConfiguration configuration, FilterListStrategy strategy)
            : base(defaultService, configuration, strategy)
        { }

        protected override bool? GenerateOptionSet(OptionSetMetadataBase optionSetMetadata)
        {
            if (optionSetMetadata.IsCustomOptionSet.HasValue && optionSetMetadata.IsCustomOptionSet.Value && FilterConfiguration.Customizations.CustomizationStrategy == CustomizationStrategy.UncustomizedOnly)
                return false;
            else if (optionSetMetadata.IsCustomOptionSet.HasValue && !optionSetMetadata.IsCustomOptionSet.Value && FilterConfiguration.Customizations.CustomizationStrategy == CustomizationStrategy.CustomOnly)
                return false;

            return FilterConfiguration.Customizations.CustomizationStrategy == CustomizationStrategy.Default ? (bool?)null : true;
        }

        protected override bool? GenerateEntity(EntityMetadata entityMetadata)
        {
            if (entityMetadata.IsCustomEntity.HasValue && entityMetadata.IsCustomEntity.Value && FilterConfiguration.Customizations.CustomizationStrategy == CustomizationStrategy.UncustomizedOnly)
                return false;
            else if (entityMetadata.IsCustomEntity.HasValue && !entityMetadata.IsCustomEntity.Value && FilterConfiguration.Customizations.CustomizationStrategy == CustomizationStrategy.CustomOnly)
                return false;

            return FilterConfiguration.Customizations.CustomizationStrategy == CustomizationStrategy.Default ? (bool?)null : true;
        }

        protected override bool? GenerateAttribute(AttributeMetadata attributeMetadata)
        {
            if (attributeMetadata.IsCustomAttribute.HasValue && attributeMetadata.IsCustomAttribute.Value && FilterConfiguration.Customizations.CustomizationStrategy == CustomizationStrategy.UncustomizedOnly)
                return false;
            else if (attributeMetadata.IsCustomAttribute.HasValue && !attributeMetadata.IsCustomAttribute.Value && FilterConfiguration.Customizations.CustomizationStrategy == CustomizationStrategy.CustomOnly)
                return false;

            return FilterConfiguration.Customizations.CustomizationStrategy == CustomizationStrategy.Default ? (bool?)null : true;
        }

        protected override bool? GenerateRelationship(RelationshipMetadataBase relationshipMetadata, EntityMetadata otherEntityMetadata)
        {
            if (relationshipMetadata.IsCustomRelationship.HasValue && relationshipMetadata.IsCustomRelationship.Value && FilterConfiguration.Customizations.CustomizationStrategy == CustomizationStrategy.UncustomizedOnly)
                return false;
            else if (relationshipMetadata.IsCustomRelationship.HasValue && !relationshipMetadata.IsCustomRelationship.Value && FilterConfiguration.Customizations.CustomizationStrategy == CustomizationStrategy.CustomOnly)
                return false;

            return FilterConfiguration.Customizations.CustomizationStrategy == CustomizationStrategy.Default ? (bool?)null : true;
        }

        protected override bool? GenerateOption(OptionMetadata optionMetadata)
        {
            return null;
        }

        protected override bool? GenerateSdkMessage(SdkMessage sdkMessage)
        {
            if (sdkMessage.IsCustomAction && FilterConfiguration.Customizations.CustomizationStrategy == CustomizationStrategy.UncustomizedOnly)
                return false;
            else if (!sdkMessage.IsCustomAction && FilterConfiguration.Customizations.CustomizationStrategy == CustomizationStrategy.CustomOnly)
                return false;

            return FilterConfiguration.Customizations.CustomizationStrategy == CustomizationStrategy.Default ? (bool?)null : true;
        }

        protected override bool? GenerateSdkMessagePair(SdkMessagePair sdkMessagePair)
        {
            if (sdkMessagePair.Message.IsCustomAction && FilterConfiguration.Customizations.CustomizationStrategy == CustomizationStrategy.UncustomizedOnly)
                return false;
            else if (!sdkMessagePair.Message.IsCustomAction && FilterConfiguration.Customizations.CustomizationStrategy == CustomizationStrategy.CustomOnly)
                return false;

            return FilterConfiguration.Customizations.CustomizationStrategy == CustomizationStrategy.Default ? (bool?)null : true;
        }
    }
}