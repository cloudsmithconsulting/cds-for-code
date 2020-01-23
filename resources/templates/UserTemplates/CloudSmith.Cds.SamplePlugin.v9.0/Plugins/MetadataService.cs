using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Messages;
using Microsoft.Xrm.Sdk.Metadata;
using Microsoft.Xrm.Sdk.Metadata.Query;
using Microsoft.Xrm.Sdk.Query;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace #{Namespace}.Plugins
{
    /// <summary>
    ///     A service that can obtain metadata from a Dynamics organization.
    /// </summary>
    public class MetadataService
    {
        private IOrganizationService _organizationService;

        public MetadataService(IOrganizationService organizationService)
        {
            _organizationService = organizationService ?? throw new ArgumentNullException(nameof(organizationService), $"The parameter {nameof(organizationService)} cannot be null.");
        }

        /// <summary>
        ///     Checks whether an entity exists.
        /// </summary>
        /// <param name="entityName">Entity logical name</param>
        /// <returns>
        ///     True if it entity exists, otherwhise false.
        /// </returns>
        public bool EntityExists(string entityName)
        {
            if (string.IsNullOrWhiteSpace(entityName))
            {
                throw new ArgumentNullException(nameof(entityName), $"The parameter {nameof(entityName)} cannot be null.");
            }

            var entityQueryExpression = new EntityQueryExpression()
            {
                Criteria = new MetadataFilterExpression(LogicalOperator.And)
                {
                    Conditions =
                    {
                        new MetadataConditionExpression("LogicalName", MetadataConditionOperator.Equals, entityName)
                    }
                },
                Properties = new MetadataPropertiesExpression("ObjectTypeCode")
            };

            var response = (RetrieveMetadataChangesResponse)_organizationService.Execute(new RetrieveMetadataChangesRequest
            {
                Query = entityQueryExpression
            });

            return (response.EntityMetadata != null && response.EntityMetadata.Count > 0);
        }

        /// <summary>
        ///     Gets an attribute metadata.
        /// </summary>
        /// <param name="entityName">Entity logical name. </param>
        /// <param name="attributeName">Name of the attribute to retrieve.</param>
        /// <returns>
        ///     The attribute metadata.
        /// </returns>
        public AttributeMetadata GetAttributeMetadata(string entityName, string attributeName)
        {
            if (string.IsNullOrWhiteSpace(entityName))
            {
                throw new ArgumentNullException(nameof(entityName), $"The parameter {nameof(entityName)} cannot be null.");
            }

            if (string.IsNullOrWhiteSpace(attributeName))
            {
                throw new ArgumentNullException(nameof(attributeName), $"The parameter {nameof(attributeName)} cannot be null.");
            }

            var response = (RetrieveAttributeResponse)_organizationService.Execute(new RetrieveAttributeRequest()
            {
                EntityLogicalName = entityName,
                LogicalName = attributeName
            });

            return response.AttributeMetadata;
        }

        /// <summary>
        ///     Gets entity metadata.
        /// </summary>
        /// <param name="entityName">Entity logical name.</param>
        /// <returns>
        ///     The entity metadata.
        /// </returns>
        public EntityMetadata GetEntityMetadata(string entityName)
        {
            return GetEntityMetadata(entityName, EntityFilters.Entity);
        }

        /// <summary>
        ///     Gets entity metadata.
        /// </summary>
        /// <param name="entityName">Entity logical name.</param>
        /// <param name="entityFilters">Describes the type of entity metadata to receive.Default value: EntityFilters.Entity</param>
        /// <returns>
        ///     The entity metadata.
        /// </returns>
        public EntityMetadata GetEntityMetadata(string entityName, EntityFilters entityFilters)
        {
            if (string.IsNullOrWhiteSpace(entityName))
            {
                throw new ArgumentNullException(nameof(entityName), $"The parameter {nameof(entityName)} cannot be null.");
            }

            var response = (RetrieveEntityResponse)_organizationService.Execute(new RetrieveEntityRequest()
            {
                LogicalName = entityName,
                EntityFilters = entityFilters
            });

            return response.EntityMetadata;
        }

        /// <summary>
        ///     Gets entity metadata.
        /// </summary>
        /// <param name="entityTypeCode">The entity type code.</param>
        /// <param name="entityFilters">Describes the type of entity metadata to receive.Default value: EntityFilters.Entity</param>
        /// <returns>
        ///     The entity metadata.
        /// </returns>
        public EntityMetadata GetEntityMetadata(int entityTypeCode, EntityFilters entityFilters)
        {
            string logicalName = GetEntityLogicalName(entityTypeCode);

            if (string.IsNullOrWhiteSpace(logicalName))
            {
                throw new KeyNotFoundException($"No logical name could be found for type code {entityTypeCode.ToString()}");
            }

            return GetEntityMetadata(logicalName, entityFilters);
        }

        /// <summary>
        ///     Gets entity logical name from a type code.
        /// </summary>
        /// <param name="entityTypeCode">The entity type code.</param>
        /// <returns>
        ///     The entity logical name.
        /// </returns>
        public string GetEntityLogicalName(int entityTypeCode)
        {
            string logicalName = null;

            EntityQueryExpression entityQueryExpression = new EntityQueryExpression()
            {
                Criteria = new MetadataFilterExpression(LogicalOperator.And)
                {
                    Conditions =
                {
                    new MetadataConditionExpression("ObjectTypeCode", MetadataConditionOperator.Equals, entityTypeCode)
                }
                },
                Properties = new MetadataPropertiesExpression("DisplayName", "ObjectTypeCode", "PrimaryIdAttribute", "PrimaryNameAttribute")
            };

            var response = (RetrieveMetadataChangesResponse)_organizationService.Execute(new RetrieveMetadataChangesRequest
            {
                Query = entityQueryExpression
            });

            if (response.EntityMetadata != null && response.EntityMetadata.Count > 0)
            {
                logicalName = response.EntityMetadata.First().LogicalName;
            }

            return logicalName;
        }

        /// <summary>
        /// Gets metadata for all global option sets.
        /// </summary>
        public OptionSetMetadataBase[] GetGlobalOptionSets()
        {
            var response = (RetrieveAllOptionSetsResponse)_organizationService.Execute(new RetrieveAllOptionSetsRequest());

            return response.OptionSetMetadata;
        }
    }
}