using System;
using System.Linq;
using System.Text.RegularExpressions;
using CloudSmith.Dynamics365.CrmSvcUtil.Configuration;
using CloudSmith.Dynamics365.CrmSvcUtil.Configuration.Filter;
using Microsoft.Crm.Services.Utility;
using Microsoft.Xrm.Sdk.Metadata;

namespace CloudSmith.Dynamics365.CrmSvcUtil.Filter
{
    public class RegExFilterService : FilterListFilterService
    {
        internal RegExFilterService(BaseFilterService service, FilterListStrategy strategy)
            : base(service, strategy)
        { }

        public RegExFilterService(ICodeWriterFilterService defaultService)
            : base(defaultService)
        { }

        internal RegExFilterService(ICodeWriterFilterService defaultService, IServiceExtensionsConfiguration configuration)
            : base(defaultService, configuration)
        { }

        internal RegExFilterService(ICodeWriterFilterService defaultService, IServiceExtensionsConfiguration configuration, FilterListStrategy strategy)
            : base(defaultService, configuration, strategy)
        { }

        public RegExFilterService(ICodeWriterMessageFilterService defaultService)
            : base(defaultService)
        { }

        internal RegExFilterService(ICodeWriterMessageFilterService defaultService, IServiceExtensionsConfiguration configuration)
            : base(defaultService, configuration)
        { }

        internal RegExFilterService(ICodeWriterMessageFilterService defaultService, IServiceExtensionsConfiguration configuration, FilterListStrategy strategy)
            : base(defaultService, configuration, strategy)
        { }

        protected override bool? GenerateEntity(EntityMetadata entityMetadata)
        {
            var filters = FilterConfiguration.Filters.GetFilters(FilterMember.Entity);

            if (filters?.Length == 0)
            {
                return null;
            }

            return DoesMatchSettings(entityMetadata.LogicalName, "entity", filters);
        }

        protected override bool? GenerateAttribute(AttributeMetadata attributeMetadata)
        {
            var filters = FilterConfiguration.Filters.GetFilters(FilterMember.Attribute);

            if (filters?.Length == 0)
            {
                return null;
            }

            return DoesMatchSettings(attributeMetadata.LogicalName, "attribute", filters);
        }

        protected override bool? GenerateOptionSet(OptionSetMetadataBase optionSetMetadata)
        {
            var filters = FilterConfiguration.Filters.GetFilters(FilterMember.Attribute);

            if (filters?.Length == 0)
            {
                return null;
            }

            return DoesMatchSettings(optionSetMetadata.Name, "optionSet", filters);
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

        private bool DoesMatchSettings(string logicalName, string kind, IFilterElement[] filters)
        {
            bool result = filters.Length == 0;

            for (int index = 0; index < filters.Length && !result; index++)
            {
                IFilterElement filterElement = filters[index];
                Trace.Debug($"Match {kind} filter: {filterElement.Expression} on logical name: {logicalName}");

                try
                {
                    RegexOptions options = filterElement.IgnoreCase ? RegexOptions.IgnoreCase : ~RegexOptions.IgnoreCase;
                    Regex regex = new Regex(filterElement.Expression, options);
                    bool isMatch = regex.IsMatch(kind == "entity" ? logicalName : logicalName.Replace("*.", ""));

                    Trace.Debug("{0} {1}", filterElement.Expression, isMatch ? "matches" : "does not match");
                    result |= isMatch;
                }
                catch (ArgumentException ex)
                {
                    Trace.LogExceptionWarning(ex);
                }
            }

            return result;
        }
    }
}