using CloudSmith.Dynamics365.CrmSvcUtil.Cache;
using CloudSmith.Dynamics365.CrmSvcUtil.Configuration;
using CloudSmith.Dynamics365.CrmSvcUtil.Naming;
using Microsoft.Crm.Services.Utility;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Metadata;
using System;
using System.Diagnostics;
using System.Linq;

namespace CloudSmith.Dynamics365.CrmSvcUtil
{
    public class CompositeNamingService : BaseNamingService
    {
        private INamingService[] _namers;

        public CompositeNamingService(BaseNamingService service) : base(service) { InitalizeNamers(); }
        public CompositeNamingService(INamingService defaultService) : base(defaultService) { InitalizeNamers(); }
        public CompositeNamingService(INamingService defaultService, IServiceExtensionsConfiguration configuration) : base(defaultService, configuration) { InitalizeNamers(); }

        internal void InitalizeNamers()
        {
            _namers = new INamingService[]
            {
                new PublisherNameService(this),
                new MapNameService(this)
            };
        }

        public override string GetNameForAttribute(EntityMetadata entityMetadata, AttributeMetadata attributeMetadata, IServiceProvider services)
        {
            string returnValue = string.Empty;

            foreach (var namer in _namers)
            {
                Trace.Debug($"Executing naming rule {nameof(GetNameForAttribute)} using {namer.GetType().FullName}");

                returnValue = namer.GetNameForAttribute(entityMetadata, attributeMetadata, services);

                if (!string.IsNullOrEmpty(returnValue))
                {
                    var cacheItem = DynamicsMetadataCache.Attributes.GetOrParse(attributeMetadata);

                    if (cacheItem != null)
                        cacheItem.GeneratedTypeName = returnValue;

                    DynamicsMetadataCache.Attributes.Set(cacheItem);
                }
            }

            return returnValue;
        }

        public override string GetNameForEntity(EntityMetadata entityMetadata, IServiceProvider services)
        {
            string returnValue = string.Empty;

            foreach (var namer in _namers)
            {
                Trace.Debug($"Executing naming rule {nameof(GetNameForEntity)} using {namer.GetType().FullName}");

                returnValue = namer.GetNameForEntity(entityMetadata, services);

                if (!string.IsNullOrEmpty(returnValue))
                {
                    var cacheItem = DynamicsMetadataCache.Entities.GetOrParse(entityMetadata);

                    if (cacheItem != null)
                        cacheItem.GeneratedTypeName = returnValue;

                    DynamicsMetadataCache.Entities.Set(cacheItem);
                }
            }

            return returnValue;
        }

        public override string GetNameForEntitySet(EntityMetadata entityMetadata, IServiceProvider services)
        {
            string returnValue = string.Empty;

            foreach (var namer in _namers)
            {
                Trace.Debug($"Executing naming rule {nameof(GetNameForEntity)} using {namer.GetType().FullName}");

                returnValue = namer.GetNameForEntity(entityMetadata, services);

                if (!string.IsNullOrEmpty(returnValue))
                {
                    var cacheItem = DynamicsMetadataCache.Entities.GetOrParse(entityMetadata);

                    if (cacheItem != null)
                        cacheItem.GeneratedSetName = returnValue;

                    DynamicsMetadataCache.Entities.Set(cacheItem);
                }
            }

            return returnValue;
        }

        public override string GetNameForMessagePair(SdkMessagePair messagePair, IServiceProvider services)
        {
            string returnValue = string.Empty;
            string defaultValue = base.GetNameForMessagePair(messagePair, services);

            foreach (var namer in _namers)
            {
                Trace.Debug($"Executing naming rule {nameof(GetNameForMessagePair)} using {namer.GetType().FullName}");

                returnValue = namer.GetNameForMessagePair(messagePair, services);

                if (!string.IsNullOrEmpty(returnValue))
                {
                    var cacheItem = DynamicsMetadataCache.SdkMessagePairs.GetOrParse(messagePair);

                    if (cacheItem != null)
                        cacheItem.GeneratedTypeName = returnValue;

                    DynamicsMetadataCache.SdkMessagePairs.Set(cacheItem);
                }
            }

            return returnValue;
        }

        public override string GetNameForOption(OptionSetMetadataBase optionSetMetadata, OptionMetadata optionMetadata, IServiceProvider services)
        {
            string returnValue = string.Empty;
            string defaultValue = base.GetNameForOption(optionSetMetadata, optionMetadata, services);

            foreach (var namer in _namers)
            {
                Trace.Debug($"Executing naming rule {nameof(GetNameForOption)} using {namer.GetType().FullName}");

                returnValue = namer.GetNameForOption(optionSetMetadata, optionMetadata, services);

                if (!string.IsNullOrEmpty(returnValue))
                {
                    var cacheItem = DynamicsMetadataCache.Options.GetOrParse(optionMetadata);

                    if (cacheItem != null)
                        cacheItem.GeneratedTypeName = returnValue;

                    DynamicsMetadataCache.Options.Set(cacheItem);
                }
            }

            return returnValue;
        }

        public override string GetNameForOptionSet(EntityMetadata entityMetadata, OptionSetMetadataBase optionSetMetadata, IServiceProvider services)
        {
            string returnValue = string.Empty;
            string defaultValue = base.GetNameForOptionSet(entityMetadata, optionSetMetadata, services);

            foreach (var namer in _namers)
            {
                Trace.Debug($"Executing naming rule {nameof(GetNameForOptionSet)} using {namer.GetType().FullName}");

                returnValue = namer.GetNameForOptionSet(entityMetadata, optionSetMetadata, services);

                if (!string.IsNullOrEmpty(returnValue))
                {
                    var cacheItem = DynamicsMetadataCache.OptionSets.GetOrParse(optionSetMetadata);

                    if (cacheItem != null)
                        cacheItem.GeneratedTypeName = returnValue;

                    DynamicsMetadataCache.OptionSets.Set(cacheItem);
                }
            }

            return returnValue;
        }

        public override string GetNameForRelationship(EntityMetadata entityMetadata, RelationshipMetadataBase relationshipMetadata, EntityRole? reflexiveRole, IServiceProvider services)
        {
            string returnValue = string.Empty;
            string defaultValue = base.GetNameForRelationship(entityMetadata, relationshipMetadata, reflexiveRole, services);

            foreach (var namer in _namers)
            {
                Trace.Debug($"Executing naming rule {nameof(GetNameForRelationship)} using {namer.GetType().FullName}");

                returnValue = namer.GetNameForRelationship(entityMetadata, relationshipMetadata, reflexiveRole, services);

                if (!string.IsNullOrEmpty(returnValue))
                {
                    var cacheItem = DynamicsMetadataCache.Relationships.GetOrParse(relationshipMetadata);

                    if (cacheItem != null)
                        cacheItem.GeneratedTypeName = returnValue;

                    DynamicsMetadataCache.Relationships.Set(cacheItem);
                }
            }

            return string.IsNullOrEmpty(returnValue) ? defaultValue : returnValue;
        }

        public override string GetNameForRequestField(SdkMessageRequest request, SdkMessageRequestField requestField, IServiceProvider services)
        {
            string returnValue = string.Empty;
            string defaultValue = base.GetNameForRequestField(request, requestField, services);

            foreach (var namer in _namers)
            {
                Trace.Debug($"Executing naming rule {nameof(GetNameForRequestField)} using {namer.GetType().FullName}");

                returnValue = namer.GetNameForRequestField(request, requestField, services);

                if (!string.IsNullOrEmpty(returnValue))
                {
                    var cacheItem = DynamicsMetadataCache.SdkMessagePairs.GetOrParse(request.MessagePair);

                    if (cacheItem != null)
                        cacheItem.GeneratedRequestTypeName = returnValue;

                    DynamicsMetadataCache.SdkMessagePairs.Set(cacheItem);
                }
            }

            return string.IsNullOrEmpty(returnValue) ? defaultValue : returnValue;
        }

        public override string GetNameForResponseField(SdkMessageResponse response, SdkMessageResponseField responseField, IServiceProvider services)
        {
            string returnValue = string.Empty;
            string defaultValue = base.GetNameForResponseField(response, responseField, services);

            foreach (var namer in _namers)
            {
                Trace.Debug($"Executing naming rule {nameof(GetNameForResponseField)} using {namer.GetType().FullName}");

                returnValue = namer.GetNameForResponseField(response, responseField, services);

                if (returnValue != defaultValue)
                    break;
            }

            return string.IsNullOrEmpty(returnValue) ? defaultValue : returnValue;
        }

        public override string GetNameForServiceContext(IServiceProvider services)
        {
            string returnValue = string.Empty;
            string defaultValue = base.GetNameForServiceContext(services);

            foreach (var namer in _namers)
            {
                Trace.Debug($"Executing naming rule {nameof(GetNameForServiceContext)} using {namer.GetType().FullName}");

                returnValue = namer.GetNameForServiceContext(services);

                if (returnValue != defaultValue)
                    break;
            }

            return string.IsNullOrEmpty(returnValue) ? defaultValue : returnValue;
        }
    }
}
