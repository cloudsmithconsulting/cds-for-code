using CloudSmith.Dynamics365.CrmSvcUtil.Cache;
using CloudSmith.Dynamics365.CrmSvcUtil.Configuration;
using CloudSmith.Dynamics365.CrmSvcUtil.Configuration.Filter;
using CloudSmith.Dynamics365.CrmSvcUtil.Filter;
using Microsoft.Crm.Services.Utility;
using Microsoft.Xrm.Sdk.Metadata;
using System;
using System.Linq;

namespace CloudSmith.Dynamics365.CrmSvcUtil
{
    public class CompositeFilterService : BaseFilterService
    {
        private FilterListFilterService[] _blacklistFilters;
        private FilterListFilterService[] _whitelistFilters;

        public CompositeFilterService(ICodeWriterFilterService defaultService)
            : base(defaultService)
        {
            InitializeFilters();
        }

        public CompositeFilterService(ICodeWriterFilterService defaultService, IServiceExtensionsConfiguration configuration)
            : base(defaultService, configuration)
        {
            InitializeFilters();
        }

        public CompositeFilterService(ICodeWriterMessageFilterService defaultService)
            : base(defaultService)
        {
            InitializeFilters();
        }

        public CompositeFilterService(ICodeWriterMessageFilterService defaultService, IServiceExtensionsConfiguration configuration)
            : base(defaultService, configuration)
        {
            InitializeFilters();
        }

        private void InitializeFilters()
        {
            _whitelistFilters = new FilterListFilterService[]
            {
                new ExactMatchFilterService(this, FilterListStrategy.Whitelist),
                new RegExFilterService(this, FilterListStrategy.Whitelist),
                new SolutionFilterService(this, FilterListStrategy.Whitelist),
                new CustomEntitiesFilterService(this, FilterListStrategy.Whitelist)
            };
            _blacklistFilters = new FilterListFilterService[]
            {
                new ExactMatchFilterService(this, FilterListStrategy.Blacklist),
                new RegExFilterService(this, FilterListStrategy.Blacklist),
                new SolutionFilterService(this, FilterListStrategy.Blacklist),
                new CustomEntitiesFilterService(this, FilterListStrategy.Blacklist)
            };
        }

        public override bool GenerateAttribute(AttributeMetadata attributeMetadata, IServiceProvider services)
        {
            bool whitelist, blacklist = false;

            whitelist = _whitelistFilters.Any(filter => filter.GenerateAttribute(attributeMetadata, services));

            if (whitelist)
            {
                Trace.TraceInformation($"Whitelist: {attributeMetadata.EntityLogicalName}.{attributeMetadata.LogicalName} is on the whitelist and will be generated.");
            }
            else
            {
                if (Configuration.Filtering.HasWhitelist && Configuration.Filtering.Whitelist.Filter == WhitelistFilter.Exclusive)
                    return false;

                blacklist = _blacklistFilters.Any(filter => filter.GenerateAttribute(attributeMetadata, services));

                if (!blacklist)
                {
                    Trace.TraceInformation($"Blacklist: {attributeMetadata.EntityLogicalName}.{attributeMetadata.LogicalName} is on the blacklist and will not be generated.");
                }
            }

            return whitelist || blacklist;
        }

        public override bool GenerateEntity(EntityMetadata entityMetadata, IServiceProvider services)
        {
            bool whitelist, blacklist = false;

            whitelist = _whitelistFilters.Any(filter => filter.GenerateEntity(entityMetadata, services));

            if (whitelist)
            {
                Trace.TraceInformation($"Whitelist: {entityMetadata.LogicalName} is on the whitelist and will be generated.");
            }
            else
            {
                if (Configuration.Filtering.HasWhitelist && Configuration.Filtering.Whitelist.Filter == WhitelistFilter.Exclusive)
                    return false;

                blacklist = _blacklistFilters.Any(filter => filter.GenerateEntity(entityMetadata, services));

                if (!blacklist)
                {
                    Trace.TraceInformation($"Blacklist: {entityMetadata.LogicalName} is on the blacklist and will not be generated.");
                }
            }

            return whitelist || blacklist;
        }

        public override bool GenerateOption(OptionMetadata optionMetadata, IServiceProvider services)
        {
            bool whitelist, blacklist = false;

            whitelist = _whitelistFilters.Any(filter => filter.GenerateOption(optionMetadata, services));

            if (!whitelist)
            {
                blacklist = _blacklistFilters.Any(filter => filter.GenerateOption(optionMetadata, services));
            }

            return whitelist || blacklist;
        }

        public override bool GenerateOptionSet(OptionSetMetadataBase optionSetMetadata, IServiceProvider services)
        {
            bool whitelist, blacklist = false;

            whitelist = _whitelistFilters.Any(filter => filter.GenerateOptionSet(optionSetMetadata, services));

            if (whitelist)
            {
                Trace.TraceInformation($"Whitelist: {optionSetMetadata.Name} is on the whitelist and will be generated.");
            }
            else
            {
                if (Configuration.Filtering.HasWhitelist && Configuration.Filtering.Whitelist.Filter == WhitelistFilter.Exclusive)
                    return false;

                blacklist = _blacklistFilters.Any(filter => filter.GenerateOptionSet(optionSetMetadata, services));

                if (!blacklist)
                {
                    Trace.TraceInformation($"Blacklist: {optionSetMetadata.Name} is on the blacklist and will not be generated.");
                }
            }

            return whitelist || blacklist;
        }

        public override bool GenerateRelationship(RelationshipMetadataBase relationshipMetadata, EntityMetadata otherEntityMetadata, IServiceProvider services)
        {
            bool whitelist, blacklist = false;

            whitelist = _whitelistFilters.Any(filter => filter.GenerateRelationship(relationshipMetadata, otherEntityMetadata, services));

            if (whitelist)
            {
                Trace.TraceInformation($"Whitelist: {relationshipMetadata.SchemaName} is on the whitelist and will be generated.");
            }
            else
            {
                if (Configuration.Filtering.HasWhitelist && Configuration.Filtering.Whitelist.Filter == WhitelistFilter.Exclusive)
                    return false;

                blacklist = _blacklistFilters.Any(filter => filter.GenerateRelationship(relationshipMetadata, otherEntityMetadata, services));

                if (!blacklist)
                {
                    Trace.TraceInformation($"Blacklist: {relationshipMetadata.SchemaName} is on the blacklist and will not be generated.");
                }
            }

            return whitelist || blacklist;
        }

        public override bool GenerateSdkMessage(SdkMessage sdkMessage, IServiceProvider services)
        {
            bool whitelist, blacklist = false;

            whitelist = _whitelistFilters.Any(filter => filter.GenerateSdkMessage(sdkMessage, services));

            if (whitelist)
            {
                Trace.TraceInformation($"Whitelist: {sdkMessage.Name} is on the whitelist and will be generated.");
            }
            else
            {
                if (Configuration.Filtering.HasWhitelist && Configuration.Filtering.Whitelist.Filter == WhitelistFilter.Exclusive)
                    return false;

                blacklist = _blacklistFilters.Any(filter => filter.GenerateSdkMessage(sdkMessage, services));

                if (!blacklist)
                {
                    Trace.TraceInformation($"Blacklist: {sdkMessage.Name} is on the blacklist and will not be generated.");
                }
            }

            return whitelist || blacklist;
        }

        public override bool GenerateSdkMessagePair(SdkMessagePair sdkMessagePair, IServiceProvider services)
        {
            bool whitelist, blacklist = false;

            whitelist = _whitelistFilters.Any(filter => filter.GenerateSdkMessagePair(sdkMessagePair, services));

            if (whitelist)
            {
                Trace.TraceInformation($"Whitelist: {sdkMessagePair.Id} is on the whitelist and will be generated.");
            }
            else
            {
                if (Configuration.Filtering.HasWhitelist && Configuration.Filtering.Whitelist.Filter == WhitelistFilter.Exclusive)
                    return false;

                blacklist = _blacklistFilters.Any(filter => filter.GenerateSdkMessagePair(sdkMessagePair, services));

                if (!blacklist)
                {
                    Trace.TraceInformation($"Blacklist: {sdkMessagePair.Id} is on the blacklist and will not be generated.");
                }
            }

            return whitelist || blacklist;
        }

        public override bool GenerateServiceContext(IServiceProvider services)
        {
            bool whitelist, blacklist = false;

            whitelist = _whitelistFilters.Any(filter => filter.GenerateServiceContext(services));

            if (!whitelist)
            {
                blacklist = _blacklistFilters.Any(filter => filter.GenerateServiceContext(services));
            }

            return whitelist || blacklist;
        }
    }
}
