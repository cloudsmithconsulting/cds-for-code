using System;
using System.Collections.Generic;
using System.Linq;
using CloudSmith.Dynamics365.CrmSvcUtil.Configuration;
using CloudSmith.Dynamics365.CrmSvcUtil.Configuration.Naming;
using Microsoft.Crm.Services.Utility;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Metadata;

namespace CloudSmith.Dynamics365.CrmSvcUtil.Naming
{
    public class PublisherNameService : BaseNamingService
    {
        public PublisherNameService(BaseNamingService service) : base(service) { }
        public PublisherNameService(INamingService defaultService) : base(defaultService) { }
        public PublisherNameService(INamingService defaultService, IServiceExtensionsConfiguration configuration) : base(defaultService, configuration) { }

        private IEnumerable<PublisherElement> _publishers => Configuration.Naming.Publisher.Where(p => p.Action == PublisherNamingAction.Remove);

        /// <inheritdoc />
        public override string GetNameForOptionSet(EntityMetadata entityMetadata, OptionSetMetadataBase optionSetMetadata, IServiceProvider services)
        {
            string value = base.GetNameForOptionSet(entityMetadata, optionSetMetadata, services);
            value = ModifyPublisher(value);

            return value;
        }

        /// <inheritdoc />
        public override string GetNameForOption(OptionSetMetadataBase optionSetMetadata, OptionMetadata optionMetadata, IServiceProvider services)
        {
            string value = base.GetNameForOption(optionSetMetadata, optionMetadata, services);
            value = ModifyPublisher(value);

            return value;
        }

        /// <inheritdoc />
        public override string GetNameForEntity(EntityMetadata entityMetadata, IServiceProvider services)
        {
            string value = base.GetNameForEntity(entityMetadata, services);
            value = ModifyPublisher(value);

            return value;
        }

        /// <inheritdoc />
        public override string GetNameForAttribute(EntityMetadata entityMetadata, AttributeMetadata attributeMetadata, IServiceProvider services)
        {
            string value = base.GetNameForAttribute(entityMetadata, attributeMetadata, services);
            value = ModifyPublisher(value);

            return value;
        }

        /// <inheritdoc />
        public override string GetNameForRelationship(EntityMetadata entityMetadata, RelationshipMetadataBase relationshipMetadata, EntityRole? reflexiveRole, IServiceProvider services)
        {
            string value = base.GetNameForRelationship(entityMetadata, relationshipMetadata, reflexiveRole, services);
            value = ModifyPublisher(value);

            return value;
        }

        /// <inheritdoc />
        public override string GetNameForServiceContext(IServiceProvider services)
        {
            string value = base.GetNameForServiceContext(services);
            value = ModifyPublisher(value);

            return value;
        }

        /// <inheritdoc />
        public override string GetNameForEntitySet(EntityMetadata entityMetadata, IServiceProvider services)
        {
            string value = base.GetNameForEntitySet(entityMetadata, services);
            value = ModifyPublisher(value);

            return value;
        }

        /// <inheritdoc />
        public override string GetNameForMessagePair(SdkMessagePair messagePair, IServiceProvider services)
        {
            string value = base.GetNameForMessagePair(messagePair, services);
            value = ModifyPublisher(value);

            return value;
        }

        /// <inheritdoc />
        public override string GetNameForRequestField(SdkMessageRequest request, SdkMessageRequestField requestField, IServiceProvider services)
        {
            string value = base.GetNameForRequestField(request, requestField, services);
            value = ModifyPublisher(value);

            return value;
        }

        /// <inheritdoc />
        public override string GetNameForResponseField(SdkMessageResponse response, SdkMessageResponseField responseField, IServiceProvider services)
        {
            string value = base.GetNameForResponseField(response, responseField, services);
            value = ModifyPublisher(value);

            return value;
        }

        private string ModifyPublisher(string name)
        {
            foreach (PublisherElement publisherElement in _publishers)
            {
                if (name?.StartsWith(publisherElement.Name) ?? false)
                {
                    name = name.Substring(publisherElement.Name.Length);
                }
            }

            return name;
        }
    }
}
