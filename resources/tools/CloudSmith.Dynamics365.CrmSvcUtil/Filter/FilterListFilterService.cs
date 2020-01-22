using CloudSmith.Dynamics365.CrmSvcUtil.Cache;
using CloudSmith.Dynamics365.CrmSvcUtil.Configuration;
using CloudSmith.Dynamics365.CrmSvcUtil.Configuration.Filter;
using Microsoft.Crm.Services.Utility;
using Microsoft.Xrm.Sdk.Metadata;
using System;
using System.Configuration;

namespace CloudSmith.Dynamics365.CrmSvcUtil.Filter
{
    public abstract class FilterListFilterService : BaseFilterService
    {
        protected FilterListFilterService(BaseFilterService service, FilterListStrategy strategy)
            : base(service)
        {
            Strategy = strategy;
        }

        protected FilterListFilterService(ICodeWriterFilterService defaultService)
            : base(defaultService)
        { }

        protected FilterListFilterService(ICodeWriterFilterService defaultService, IServiceExtensionsConfiguration configuration)
            : base(defaultService, configuration)
        { }

        protected FilterListFilterService(ICodeWriterFilterService defaultService, IServiceExtensionsConfiguration configuration, FilterListStrategy strategy)
            : base(defaultService, configuration)
        {
            Strategy = strategy;
        }

        protected FilterListFilterService(ICodeWriterMessageFilterService defaultService)
            : base(defaultService)
        { }

        protected FilterListFilterService(ICodeWriterMessageFilterService defaultService, IServiceExtensionsConfiguration configuration)
            : base(defaultService, configuration)
        { }

        protected FilterListFilterService(ICodeWriterMessageFilterService defaultService, IServiceExtensionsConfiguration configuration, FilterListStrategy strategy)
            : base(defaultService, configuration)
        {
            Strategy = strategy;
        }

        protected FilterListElement FilterConfiguration
        {
            get
            {
                switch (Strategy)
                {
                    case FilterListStrategy.Whitelist:
                        return Configuration.Filtering.Whitelist;
                    case FilterListStrategy.Blacklist:
                        return Configuration.Filtering.Blacklist;
                    default:
                        throw new ConfigurationErrorsException("No configuration could be loaded for the filter service because a strategy was not set.");
                }
            }
        }

        protected FilterListStrategy Strategy { get; }
        protected IServiceProvider Services { get; private set; }

        protected abstract bool? GenerateOptionSet(OptionSetMetadataBase optionSetMetadata);
        public override bool GenerateOptionSet(OptionSetMetadataBase optionSetMetadata, IServiceProvider services)
        {
            if (DynamicsMetadataCache.OptionSets.HasBy(optionSetMetadata))
                return true;

            Services = services;
            bool? value = GenerateOptionSet(optionSetMetadata);

            switch (Strategy)
            {
                case FilterListStrategy.Whitelist:
                    var whitelistConfig = FilterConfiguration as WhitelistElement;

                    if (value.HasValue)
                    {
                        if (value.Value)
                        {
                            DynamicsMetadataCache.OptionSets.AddBy(optionSetMetadata);
                        }

                        return value.Value;
                    }
                    else
                    {
                        var cacheItem = DynamicsMetadataCache.OptionSets.Parse(optionSetMetadata);

                        // We said that we want to generate the entity, so by default we'll cache the option sets for the entity as well.
                        if (!string.IsNullOrEmpty(cacheItem.EntityLogicalName) 
                            && DynamicsMetadataCache.Entities.HasBy(cacheItem.EntityLogicalName))
                        {
                            DynamicsMetadataCache.OptionSets.AddOrGetExisting(cacheItem);
                        }
                    }

                    return whitelistConfig.Filter == WhitelistFilter.Inclusive;
                case FilterListStrategy.Blacklist:
                    return !value.HasValue ? true : !value.Value;
            }

            // never gets here.
            return value.Value;
        }

        protected abstract bool? GenerateOption(OptionMetadata optionMetadata);
        public override bool GenerateOption(OptionMetadata optionMetadata, IServiceProvider services)
        {
            if (DynamicsMetadataCache.Options.HasBy(optionMetadata))
                return true;

            Services = services;
            bool? value = GenerateOption(optionMetadata);

            switch (Strategy)
            {
                case FilterListStrategy.Whitelist:
                    var whitelistConfig = FilterConfiguration as WhitelistElement;

                    if (value.HasValue)
                    {
                        if (value.Value)
                        {
                            DynamicsMetadataCache.Options.AddBy(optionMetadata);
                        }

                        return value.Value;
                    }
                    else
                    {
                        if (whitelistConfig.Filter == WhitelistFilter.Inclusive)
                            DynamicsMetadataCache.Options.AddBy(optionMetadata);
                    }

                    return whitelistConfig.Filter == WhitelistFilter.Inclusive;
                case FilterListStrategy.Blacklist:
                    return !value.HasValue ? true : !value.Value;
            }

            // never gets here.
            return value.Value;
        }

        protected abstract bool? GenerateAttribute(AttributeMetadata attributeMetadata);
        public override bool GenerateAttribute(AttributeMetadata attributeMetadata, IServiceProvider services)
        {
            if (DynamicsMetadataCache.Attributes.HasBy(attributeMetadata))
                return true;

            Services = services;
            bool? value = GenerateAttribute(attributeMetadata);

            switch (Strategy)
            {
                case FilterListStrategy.Whitelist:
                    var whitelistConfig = FilterConfiguration as WhitelistElement;

                    if (value.HasValue)
                    {
                        if (value.Value)
                        {
                            DynamicsMetadataCache.Attributes.AddBy(attributeMetadata);
                        }

                        return value.Value;
                    }
                    else
                    {
                        // We said that we want to generate the entity, so by default we'll cache the attributes for the entity as well.
                        if (DynamicsMetadataCache.Entities.HasBy(attributeMetadata.EntityLogicalName))
                        {
                            DynamicsMetadataCache.Attributes.AddBy(attributeMetadata);
                        }
                    }

                    return whitelistConfig.Filter == WhitelistFilter.Inclusive;
                case FilterListStrategy.Blacklist:
                    return !value.HasValue ? true : !value.Value;
            }

            // never gets here.
            return value.Value;
        }

        protected abstract bool? GenerateEntity(EntityMetadata entityMetadata);
        public override bool GenerateEntity(EntityMetadata entityMetadata, IServiceProvider services)
        {
            if (DynamicsMetadataCache.Entities.HasBy(entityMetadata))
                return true;

            Services = services;
            bool? value = GenerateEntity(entityMetadata);

            switch (Strategy)
            {
                case FilterListStrategy.Whitelist:
                    var whitelistConfig = FilterConfiguration as WhitelistElement;

                    if (value.HasValue)
                    {
                        if (value.Value)
                        {
                            DynamicsMetadataCache.Entities.AddBy(entityMetadata);
                        }

                        return value.Value;
                    }
                    else
                    {
                        if (whitelistConfig.Filter == WhitelistFilter.Inclusive)
                            DynamicsMetadataCache.Entities.AddBy(entityMetadata);
                    }

                    return whitelistConfig.Filter == WhitelistFilter.Inclusive;
                case FilterListStrategy.Blacklist:
                    return !value.HasValue ? true : !value.Value;
            }

            // never gets here.
            return value.Value;
        }

        protected abstract bool? GenerateRelationship(RelationshipMetadataBase relationshipMetadata, EntityMetadata otherEntityMetadata);
        public override bool GenerateRelationship(RelationshipMetadataBase relationshipMetadata, EntityMetadata otherEntityMetadata, IServiceProvider services)
        {
            if (DynamicsMetadataCache.Relationships.HasBy(relationshipMetadata))
                return true;

            Services = services;
            bool? value = GenerateRelationship(relationshipMetadata, otherEntityMetadata);

            switch (Strategy)
            {
                case FilterListStrategy.Whitelist:
                    var whitelistConfig = FilterConfiguration as WhitelistElement;

                    if (value.HasValue)
                    {
                        if (value.Value)
                        {
                            DynamicsMetadataCache.Relationships.AddBy(relationshipMetadata);
                        }

                        return value.Value;
                    }
                    else
                    {
                        var cacheItem = DynamicsMetadataCache.Relationships.Parse(relationshipMetadata);

                        // We said that we want to generate the entity, so by default we'll cache the relationships for the entity as well.
                        if ((!string.IsNullOrEmpty(cacheItem.FromEntity) 
                            && DynamicsMetadataCache.Entities.HasBy(cacheItem.FromEntity)) ||
                            (!string.IsNullOrEmpty(cacheItem.ToEntity)
                            && DynamicsMetadataCache.Entities.HasBy(cacheItem.ToEntity)))
                        {
                            DynamicsMetadataCache.Relationships.AddBy(relationshipMetadata);
                        }
                    }

                    return whitelistConfig.Filter == WhitelistFilter.Inclusive;
                case FilterListStrategy.Blacklist:
                    return !value.HasValue ? true : !value.Value;
            }

            // never gets here.
            return value.Value;
        }

        protected abstract bool? GenerateSdkMessage(SdkMessage sdkMessage);
        public override bool GenerateSdkMessage(SdkMessage sdkMessage, IServiceProvider services)
        {
            if (DynamicsMetadataCache.SdkMessages.HasBy(sdkMessage))
                return true;

            Services = services;
            bool? value = GenerateSdkMessage(sdkMessage);

            switch (Strategy)
            {
                case FilterListStrategy.Whitelist:
                    var whitelistConfig = FilterConfiguration as WhitelistElement;

                    if (value.HasValue)
                    {
                        if (value.Value)
                        {
                            DynamicsMetadataCache.SdkMessages.AddBy(sdkMessage);
                        }

                        return value.Value;
                    }
                    else
                    {
                        if (whitelistConfig.Filter == WhitelistFilter.Inclusive)
                            DynamicsMetadataCache.SdkMessages.AddBy(sdkMessage);
                    }

                    return whitelistConfig.Filter == WhitelistFilter.Inclusive;
                case FilterListStrategy.Blacklist:
                    return !value.HasValue ? true : !value.Value;
            }

            // never gets here.
            return value.Value;
        }

        protected abstract bool? GenerateSdkMessagePair(SdkMessagePair sdkMessagePair);
        public override bool GenerateSdkMessagePair(SdkMessagePair sdkMessagePair, IServiceProvider services)
        {
            if (DynamicsMetadataCache.SdkMessagePairs.HasBy(sdkMessagePair))
                return true;

            Services = services;
            bool? value = GenerateSdkMessagePair(sdkMessagePair);

            switch (Strategy)
            {
                case FilterListStrategy.Whitelist:
                    var whitelistConfig = FilterConfiguration as WhitelistElement;

                    if (value.HasValue)
                    {
                        if (value.Value)
                        {
                            DynamicsMetadataCache.SdkMessagePairs.AddBy(sdkMessagePair);
                        }

                        return value.Value;
                    }
                    else
                    {
                        if (whitelistConfig.Filter == WhitelistFilter.Inclusive)
                            DynamicsMetadataCache.SdkMessagePairs.AddBy(sdkMessagePair);
                    }

                    return whitelistConfig.Filter == WhitelistFilter.Inclusive;
                case FilterListStrategy.Blacklist:
                    return !value.HasValue ? true : !value.Value;
            }

            // never gets here.
            return value.Value;
        }
    }
}