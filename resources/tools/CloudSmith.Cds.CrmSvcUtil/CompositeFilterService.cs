using CloudSmith.Cds.CrmSvcUtil.Cache;
using CloudSmith.Cds.CrmSvcUtil.Configuration;
using CloudSmith.Cds.CrmSvcUtil.Configuration.Filter;
using CloudSmith.Cds.CrmSvcUtil.Filter;
using Microsoft.Crm.Services.Utility;
using Microsoft.Xrm.Sdk.Metadata;
using System;
using System.Linq;

namespace CloudSmith.Cds.CrmSvcUtil
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
            bool baseResponse = base.GenerateAttribute(attributeMetadata, services);
            bool whitelist, blacklist = false;

            whitelist = _whitelistFilters.Any(filter => filter.GenerateAttribute(attributeMetadata, services));

            if (whitelist)
            {
                Trace.TraceInformation($"Whitelist: {attributeMetadata.EntityLogicalName}.{attributeMetadata.LogicalName} is on the whitelist and will be generated.");
            }
            else
            {
                if (!baseResponse)
                    return false;

                if (Configuration.Filtering.HasWhitelist && Configuration.Filtering.Whitelist.Filter == WhitelistFilter.Exclusive && !DynamicsMetadataCache.Entities.HasBy(attributeMetadata.EntityLogicalName))
                    return false;

                blacklist = _blacklistFilters.All(filter => filter.GenerateAttribute(attributeMetadata, services));

                if (!blacklist)
                {
                    Trace.TraceInformation($"Blacklist: {attributeMetadata.EntityLogicalName}.{attributeMetadata.LogicalName} is on the blacklist and will not be generated.");
                }
            }

            return whitelist || blacklist;
        }

        public override bool GenerateEntity(EntityMetadata entityMetadata, IServiceProvider services)
        {
            bool baseResponse = base.GenerateEntity(entityMetadata, services);
            bool whitelist, blacklist = false;

            whitelist = _whitelistFilters.Any(filter => filter.GenerateEntity(entityMetadata, services));

            if (whitelist)
            {
                Trace.TraceInformation($"Whitelist: {entityMetadata.LogicalName} is on the whitelist and will be generated.");
            }
            else
            {
                if (!baseResponse)
                    return false;

                if (Configuration.Filtering.HasWhitelist && Configuration.Filtering.Whitelist.Filter == WhitelistFilter.Exclusive)
                    return false;

                blacklist = _blacklistFilters.All(filter => filter.GenerateEntity(entityMetadata, services));

                if (!blacklist)
                {
                    Trace.TraceInformation($"Blacklist: {entityMetadata.LogicalName} is on the blacklist and will not be generated.");
                }
            }

            return whitelist || blacklist;
        }

        public override bool GenerateOption(OptionMetadata optionMetadata, IServiceProvider services)
        {
            bool baseResponse = base.GenerateOption(optionMetadata, services);
            bool whitelist, blacklist = false;

            whitelist = _whitelistFilters.Any(filter => filter.GenerateOption(optionMetadata, services));

            if (!whitelist)
            {
                if (!baseResponse)
                    return false;

                blacklist = _blacklistFilters.All(filter => filter.GenerateOption(optionMetadata, services));
            }

            return whitelist || blacklist;
        }

        public override bool GenerateOptionSet(OptionSetMetadataBase optionSetMetadata, IServiceProvider services)
        {
            bool baseResponse = base.GenerateOptionSet(optionSetMetadata, services);
            bool whitelist, blacklist = false;

            whitelist = _whitelistFilters.Any(filter => filter.GenerateOptionSet(optionSetMetadata, services));

            if (whitelist)
            {
                Trace.TraceInformation($"Whitelist: {optionSetMetadata.Name} is on the whitelist and will be generated.");
            }
            else
            {
                if (!baseResponse)
                    return false;

                if (Configuration.Filtering.HasWhitelist && Configuration.Filtering.Whitelist.Filter == WhitelistFilter.Exclusive)
                    return false;

                blacklist = _blacklistFilters.All(filter => filter.GenerateOptionSet(optionSetMetadata, services));

                if (!blacklist)
                {
                    Trace.TraceInformation($"Blacklist: {optionSetMetadata.Name} is on the blacklist and will not be generated.");
                }
            }

            return whitelist || blacklist;
        }

        public override bool GenerateRelationship(RelationshipMetadataBase relationshipMetadata, EntityMetadata otherEntityMetadata, IServiceProvider services)
        {
            bool baseResponse = base.GenerateRelationship(relationshipMetadata, otherEntityMetadata, services);
            bool whitelist, blacklist = false;

            whitelist = _whitelistFilters.Any(filter => filter.GenerateRelationship(relationshipMetadata, otherEntityMetadata, services));

            if (whitelist)
            {
                Trace.TraceInformation($"Whitelist: {relationshipMetadata.SchemaName} is on the whitelist and will be generated.");
            }
            else
            {
                if (!baseResponse)
                    return false;

                if (Configuration.Filtering.HasWhitelist && Configuration.Filtering.Whitelist.Filter == WhitelistFilter.Exclusive)
                    return false;

                blacklist = _blacklistFilters.All(filter => filter.GenerateRelationship(relationshipMetadata, otherEntityMetadata, services));

                if (!blacklist)
                {
                    Trace.TraceInformation($"Blacklist: {relationshipMetadata.SchemaName} is on the blacklist and will not be generated.");
                }
            }

            return whitelist || blacklist;
        }

        public override bool GenerateSdkMessage(SdkMessage sdkMessage, IServiceProvider services)
        {
            bool baseResponse = base.GenerateSdkMessage(sdkMessage, services);
            bool whitelist, blacklist = false;

            whitelist = _whitelistFilters.Any(filter => filter.GenerateSdkMessage(sdkMessage, services));

            if (whitelist)
            {
                Trace.TraceInformation($"Whitelist: {sdkMessage.Name} is on the whitelist and will be generated.");
            }
            else
            {
                if (!baseResponse)
                    return false;

                if (Configuration.Filtering.HasWhitelist && Configuration.Filtering.Whitelist.Filter == WhitelistFilter.Exclusive)
                    return false;

                blacklist = _blacklistFilters.All(filter => filter.GenerateSdkMessage(sdkMessage, services));

                if (!blacklist)
                {
                    Trace.TraceInformation($"Blacklist: {sdkMessage.Name} is on the blacklist and will not be generated.");
                }
            }

            return whitelist || blacklist;
        }

        public override bool GenerateSdkMessagePair(SdkMessagePair sdkMessagePair, IServiceProvider services)
        {
            bool baseResponse = base.GenerateSdkMessagePair(sdkMessagePair, services);
            bool whitelist, blacklist = false;

            whitelist = _whitelistFilters.Any(filter => filter.GenerateSdkMessagePair(sdkMessagePair, services));

            if (whitelist)
            {
                Trace.TraceInformation($"Whitelist: {sdkMessagePair.Id} is on the whitelist and will be generated.");
            }
            else
            {
                if (!baseResponse)
                    return false;

                if (Configuration.Filtering.HasWhitelist && Configuration.Filtering.Whitelist.Filter == WhitelistFilter.Exclusive)
                    return false;

                blacklist = _blacklistFilters.All(filter => filter.GenerateSdkMessagePair(sdkMessagePair, services));

                if (!blacklist)
                {
                    Trace.TraceInformation($"Blacklist: {sdkMessagePair.Id} is on the blacklist and will not be generated.");
                }
            }

            return whitelist || blacklist;
        }

        public override bool GenerateServiceContext(IServiceProvider services)
        {
            bool baseResponse = base.GenerateServiceContext(services);
            bool whitelist, blacklist = false;

            whitelist = _whitelistFilters.Any(filter => filter.GenerateServiceContext(services));

            if (!whitelist)
            {
                if (!baseResponse)
                    return false;

                blacklist = _blacklistFilters.All(filter => filter.GenerateServiceContext(services));
            }

            return whitelist || blacklist;
        }
    }
}
