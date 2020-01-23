using Microsoft.Crm.Sdk.Messages;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Messages;
using Microsoft.Xrm.Sdk.Metadata;
using Microsoft.Xrm.Sdk.Query;
using System;
using System.Collections.Generic;
using System.Linq;
using System.ServiceModel;

namespace #{Namespace}.Plugins
{
    public static class OrganizationServiceExtensions
    {
        /// <summary>
        /// Removes all related entities based on navigation property.
        /// </summary>
        /// <param name="organizationService">An instance of the <see cref="IOrganizationService"/>.</param>
        /// <param name="entity">The entity containing the navigation property.</param>
        /// <param name="navigationProperty">Name of the navigation property.</param>
        /// <returns>Total number of deleted records.</returns>        
        /// <exception cref="FaultException{OrganizationServiceFault}">Throw when a <see cref="OrganizationServiceFault"/> is returned as a result of one or more delete requests.</exception>
        public static int DeleteRelatedEntities(this IOrganizationService organizationService, EntityReference entity, string navigationProperty)
        {
            int count = 0;
            EntityCollection relatedEntities;

            var requests = new List<OrganizationRequest>();

            if (entity == null)
            {
                throw new ArgumentNullException(nameof(entity), $"The parameter {nameof(entity)} cannot be null.");
            }

            if (string.IsNullOrWhiteSpace(navigationProperty))
            {
                throw new ArgumentNullException(nameof(navigationProperty), $"The parameter {nameof(navigationProperty)} cannot be null.");
            }

            relatedEntities = GetRelatedEntities(organizationService, entity, new Relationship(navigationProperty), new ColumnSet(null));

            if (relatedEntities == null || relatedEntities.Entities.Count == 0)
            {
                return count;
            }

            count = relatedEntities.Entities.Count;

            foreach (var item in relatedEntities.Entities)
            {
                var deleteRequest = new DeleteRequest { Target = item.ToEntityReference() };
                requests.Add(deleteRequest);
            }

            ExecuteMultiple(organizationService, requests.ToArray());

            return count;
        }

        /// <summary>
        ///  Executes one or more message requests as a single batch operation and optionally return a collection of results.
        /// </summary>
        /// <param name="organizationService">An instance of the <see cref="IOrganizationService"/>.</param>
        /// <param name="requests">The collection of message requests to execute.</param>
        /// <param name="continueProcessingOnError">Whether further execution of message requests in the Requests collection should continue if a fault is returned for the current request being processed.</param>
        /// <param name="returnResponse"><c>True</c> if a response for each message request processed should be returned.</param>
        /// <param name="throwIfResponseHasFault">When a response is returned, <c>True</c> to throw a <see cref="FaultException{OrganizationServiceFault}"/> if at least one response is faulted.</param>
        /// <returns></returns>
        public static ExecuteMultipleResponse ExecuteMultiple(this IOrganizationService organizationService, OrganizationRequest[] requests, bool continueProcessingOnError = false, bool returnResponse = true, bool throwIfResponseHasFault = true)
        {
            if (requests == null)
            {
                throw new ArgumentNullException(nameof(requests), $"The parameter {nameof(requests)} cannot be null.");
            }

            if (requests.Length == 0)
            {
                throw new ArgumentException(nameof(requests), $"The parameter {nameof(requests)} cannot be empty.");
            }

            ExecuteMultipleRequest request;
            ExecuteMultipleResponse response;

            request = new ExecuteMultipleRequest
            {
                Settings = new ExecuteMultipleSettings
                {
                    ContinueOnError = continueProcessingOnError,
                    ReturnResponses = returnResponse
                },
                Requests = new OrganizationRequestCollection()
            };

            request.Requests.AddRange(requests);

            response = (ExecuteMultipleResponse)organizationService.Execute(request);

            if (returnResponse && response.Responses != null)
            {
                foreach (var responseItem in response.Responses)
                {
                    if (throwIfResponseHasFault && responseItem.Fault != null)
                    {
                        throw new FaultException<OrganizationServiceFault>(responseItem.Fault);
                    }
                }
            }

            return response;
        }

        /// <summary>
        /// Executes a workflow.
        /// </summary>
        /// <param name="organizationService">An instance of the <see cref="IOrganizationService"/>.</param>        
        /// <param name="processId">The ID of the workflow to execute.</param>
        /// <param name="entityId">The ID of the record on which the workflow executes.</param>
        public static ExecuteWorkflowResponse ExecuteProcess(this IOrganizationService organizationService, Guid processId, Guid entityId)
        {
            var request = new ExecuteWorkflowRequest()
            {
                WorkflowId = processId,
                EntityId = entityId
            };

            return (ExecuteWorkflowResponse)organizationService.Execute(request);
        }

        /// <summary>
        /// Executes a workflow on related entities by navigation property.
        /// </summary>
        /// <param name="organizationService">An instance of the <see cref="IOrganizationService"/>.</param>     
        /// <param name="processId">The ID of the workflow to execute.</param>
        /// <param name="entity">The entity containing the navigation property.</param>
        /// <param name="navigationProperty">Navigation property (relationship) logical name.</param>
        /// <param name="continueOnError">When set to <c>true</c>, the inner <see cref="ExecuteMultipleRequest"/> will be set to continue execution even if one of the process return an error.</param>
        public static ExecuteMultipleResponseItemCollection ExecuteProcessOnChildRecords(this IOrganizationService organizationService, Guid processId, EntityReference entity, string navigationProperty, bool continueOnError)
        {
            if (entity == null)
            {
                throw new ArgumentNullException(nameof(entity), $"The parameter {nameof(entity)} cannot be null.");
            }

            if (string.IsNullOrWhiteSpace(navigationProperty))
            {
                throw new ArgumentNullException(nameof(navigationProperty), $"The parameter {nameof(navigationProperty)} cannot be null.");
            }

            var targets = GetRelatedEntities(organizationService, entity, navigationProperty);

            if (targets == null)
            {
                return null;
            }

            var requests = new List<OrganizationRequest>();

            foreach (var target in targets.Entities)
            {
                requests.Add(new ExecuteWorkflowRequest()
                {
                    WorkflowId = processId,
                    EntityId = target.Id
                });
            }

            var response = ExecuteMultiple(organizationService, requests.ToArray(),
                continueProcessingOnError: continueOnError,
                returnResponse: true,
                throwIfResponseHasFault: !continueOnError);

            return response.Responses;
        }

        /// <summary>
        /// Convert a query in FetchXML to a QueryExpression.
        /// </summary>
        /// <param name="organizationService">An instance of the <see cref="IOrganizationService"/>.</param>
        /// <param name="fetchXml">The query to convert.</param>
        /// <returns>The results of the query conversion.</returns>
        public static QueryExpression FetchXmlToQueryExpression(this IOrganizationService organizationService, string fetchXml)
        {
            if (string.IsNullOrWhiteSpace(fetchXml))
            {
                throw new ArgumentNullException(nameof(fetchXml), $"The parameter {nameof(fetchXml)} cannot be null.");
            }

            var response = (FetchXmlToQueryExpressionResponse)organizationService.Execute(new FetchXmlToQueryExpressionRequest
            {
                FetchXml = fetchXml
            });

            return response.Query;
        }

        /// <summary>
        /// Uses a <see cref="Relationship"/> to identify the logical name of a entity in a relationship.
        /// </summary>
        /// <param name="organizationService">An instance of the <see cref="IOrganizationService"/>.</param>
        /// <param name="entity">The entity containing the navigation property.</param>
        /// <param name="relationship">The <see cref="Relationship"/>.</param>
        /// <returns>The logical name of the entit in the relationship.</returns>
        public static string GetRelatedEntityName(this IOrganizationService organizationService, EntityReference entity, Relationship relationship)
        {
            RetrieveRelationshipRequest retrieveRelationshipRequest;
            RetrieveRelationshipResponse retrieveRelationshipResponse;
            OneToManyRelationshipMetadata relationshipMetadata;
            ManyToManyRelationshipMetadata manyToManyRelationshipMetadatum;

            if (entity == null)
            {
                throw new ArgumentNullException(nameof(entity), $"The parameter {nameof(entity)} cannot be null.");
            }

            if (relationship == null)
            {
                throw new ArgumentNullException(nameof(relationship), $"The parameter {nameof(relationship)} cannot be null.");
            }

            if (relationship.PrimaryEntityRole.HasValue)
            {
                return entity.LogicalName;
            }

            retrieveRelationshipRequest = new RetrieveRelationshipRequest()
            {
                Name = relationship.SchemaName
            };

            retrieveRelationshipResponse = organizationService.Execute(retrieveRelationshipRequest) as RetrieveRelationshipResponse;
            relationshipMetadata = retrieveRelationshipResponse.RelationshipMetadata as OneToManyRelationshipMetadata;

            if (relationshipMetadata != null)
            {
                if (relationshipMetadata.ReferencingEntity != entity.LogicalName)
                {
                    return relationshipMetadata.ReferencingEntity;
                }

                return relationshipMetadata.ReferencedEntity;
            }

            manyToManyRelationshipMetadatum = retrieveRelationshipResponse.RelationshipMetadata as ManyToManyRelationshipMetadata;

            if (manyToManyRelationshipMetadatum == null)
            {
                object[] schemaName = new object[] { relationship.SchemaName };

                throw new InvalidOperationException($"Unable to load relationship for {schemaName}");
            }

            if (manyToManyRelationshipMetadatum.Entity1LogicalName != entity.LogicalName)
            {
                return manyToManyRelationshipMetadatum.Entity1LogicalName;
            }

            return manyToManyRelationshipMetadatum.Entity2LogicalName;
        }

        /// <summary>
        /// Retrieves a collection of related entities using a collection-valued navigation property (one-to-many or many-to-many relationships).
        /// </summary>
        /// <param name="organizationService">An instance of the <see cref="IOrganizationService"/>.</param>
        /// <param name="entity">The entity containing the collection-valued navigation property.</param>
        /// <param name="navigationProperty">Name of the navigation property.</param>
        /// <returns>An <see cref="EntityCollection"/> containing the related entities.</returns>
        public static EntityCollection GetRelatedEntities(this IOrganizationService organizationService, EntityReference entity, string navigationProperty)
        {
            if (entity == null)
            {
                throw new ArgumentNullException(nameof(entity), $"The parameter {nameof(entity)} cannot be null.");
            }

            if (string.IsNullOrWhiteSpace(navigationProperty))
            {
                throw new ArgumentNullException(nameof(navigationProperty), $"The parameter {nameof(navigationProperty)} cannot be null.");
            }

            return GetRelatedEntities(organizationService, entity, new Relationship(navigationProperty), new ColumnSet(true));
        }

        /// <summary>
        /// Retrieves a collection of related entities using a collection-valued navigation property (one-to-many or many-to-many relationships).
        /// </summary>
        /// <param name="organizationService">An instance of the <see cref="IOrganizationService"/>.</param>
        /// <param name="entity">The entity containing the collection-valued navigation property.</param>
        /// <param name="relationship">The <see cref="Relationship"/>.</param>
        /// <returns>An <see cref="EntityCollection"/> containing the related entities.</returns>
        public static EntityCollection GetRelatedEntities(this IOrganizationService organizationService, EntityReference entity, Relationship relationship)
        {
            return GetRelatedEntities(organizationService, entity, relationship, new ColumnSet(true));
        }

        /// <summary>
        /// Retrieves a collection of related entities using a collection-valued navigation property (one-to-many or many-to-many relationships).
        /// </summary>
        /// <param name="organizationService">An instance of the <see cref="IOrganizationService"/>.</param>
        /// <param name="entity">The entity containing the collection-valued navigation property.</param>
        /// <param name="relationship">The <see cref="Relationship"/>.</param>
        /// <param name="columnSet">The set of columns or attributes to retrieve. Pass an instance of <see cref="ColumnSet"/> with a null argument to retrieve only the primary key.</param>
        /// <returns>An <see cref="EntityCollection"/> containing the related entities.</returns>
        public static EntityCollection GetRelatedEntities(this IOrganizationService organizationService, EntityReference entity, Relationship relationship, ColumnSet columnSet)
        {
            RelationshipQueryCollection relationshipQueryCollection;
            RelatedEntityCollection relatedEntities;
            EntityReference entityReference;
            RetrieveRequest retrieveRequest;

            string relatedEntityName;

            if (entity == null)
            {
                throw new ArgumentNullException(nameof(entity), $"The parameter {nameof(entity)} cannot be null.");
            }

            if (relationship == null)
            {
                throw new ArgumentNullException(nameof(entity), $"The parameter {nameof(relationship)} cannot be null.");
            }

            if (columnSet == null)
            {
                throw new ArgumentNullException(nameof(entity), $"The parameter {nameof(columnSet)} cannot be null.");
            }

            relatedEntityName = organizationService.GetRelatedEntityName(entity, relationship);
            relationshipQueryCollection = new RelationshipQueryCollection();

            QueryExpression queryExpression = new QueryExpression(relatedEntityName)
            {
                ColumnSet = columnSet
            };

            relationshipQueryCollection.Add(relationship, queryExpression);
            entityReference = new EntityReference(entity.LogicalName, entity.Id);

            retrieveRequest = new RetrieveRequest()
            {
                Target = entityReference,
                ColumnSet = new ColumnSet(),
                RelatedEntitiesQuery = relationshipQueryCollection
            };

            relatedEntities = (organizationService.Execute(retrieveRequest) as RetrieveResponse).Entity.RelatedEntities;

            if (!relatedEntities.Contains(relationship))
            {
                return new EntityCollection();
            }

            return relatedEntities[relationship];
        }

        /// <summary>
        /// Retrieves an entity based on a single-valued navigation property (many-to-one relationships).
        /// </summary>
        /// <param name="organizationService">An instance of the <see cref="IOrganizationService"/>.</param>
        /// <param name="entity">The entity containing the single-valued navigation property.</param>
        /// <param name="navigationProperty">Name of the navigation property.</param>
        /// <returns>The corresponding entity.</returns>
        public static Entity GetRelatedEntity(this IOrganizationService organizationService, EntityReference entity, string navigationProperty)
        {
            if (entity == null)
            {
                throw new ArgumentNullException(nameof(entity), $"The parameter {nameof(entity)} cannot be null.");
            }

            if (string.IsNullOrWhiteSpace(navigationProperty))
            {
                throw new ArgumentNullException(nameof(navigationProperty), $"The parameter {nameof(navigationProperty)} cannot be null.");
            }

            return GetRelatedEntity(organizationService, entity, new Relationship(navigationProperty));
        }

        /// <summary>
        /// Retrieves an entity based on a single-valued navigation property (many-to-one relationships).
        /// </summary>
        /// <param name="organizationService">An instance of the <see cref="IOrganizationService"/>.</param>
        /// <param name="entity">The entity containing the single-valued navigation property.</param>
        /// <param name="relationship">The <see cref="Relationship"/>.</param>
        /// <returns>The corresponding entity.</returns>
        public static Entity GetRelatedEntity(this IOrganizationService organizationService, EntityReference entity, Relationship relationship)
        {
            if (entity == null)
            {
                throw new ArgumentNullException(nameof(entity), $"The parameter {nameof(entity)} cannot be null.");
            }

            if (relationship == null)
            {
                throw new ArgumentNullException(nameof(entity), $"The parameter {nameof(relationship)} cannot be null.");
            }

            var results = GetRelatedEntities(organizationService, entity, relationship);

            if (results == null)
            {
                return null;
            }

            if (results.Entities.Count > 1)
            {
                throw new ArgumentException("Multiple records were returned when attempting to find related entities.");
            }

            return results.Entities.FirstOrDefault();
        }

        /// <summary>
        /// Uses a security role name to retrieve its ID.
        /// </summary>
        /// <param name="organizationService">An instance of the <see cref="IOrganizationService"/>.</param>
        /// <param name="roleName">The security role name.</param>
        /// <returns>The security role unique identifier or an emoty Guid if security role cannot be found.</returns>
        public static Guid GetSecurityRoleId(this IOrganizationService organizationService, string roleName)
        {
            if (string.IsNullOrWhiteSpace(roleName))
            {
                throw new ArgumentNullException(nameof(roleName), $"The parameter {nameof(roleName)} cannot be null.");
            }

            var query = new QueryExpression("role")
            {
                ColumnSet = new ColumnSet("roleid"),
                Criteria = new FilterExpression(LogicalOperator.And)
                {
                    Conditions =
                    {
                        new ConditionExpression("name", ConditionOperator.Equal, roleName)
                    }
                }
            };

            var results = organizationService.RetrieveMultiple(query);

            if (results.Entities == null || results.Entities.Count == 0)
            {
                return Guid.Empty;
            }

            return results.Entities.First().GetAttributeValue<Guid>("roleid");
        }

        /// <summary>
        /// Convert a query, which is represented as a QueryExpression class, to its equivalent query, which is represented as FetchXML.
        /// </summary>
        /// <param name="organizationService">An instance of the <see cref="IOrganizationService"/>.</param>
        /// <param name="query">The query to convert.</param>
        /// <returns>The results of the query conversion.</returns>
        public static string QueryExpressionToFetchXml(this IOrganizationService organizationService, QueryExpression query)
        {
            if (query == null)
            {
                throw new ArgumentNullException(nameof(query), $"The parameter {nameof(query)} cannot be null.");
            }

            var response = (QueryExpressionToFetchXmlResponse)organizationService.Execute(new QueryExpressionToFetchXmlRequest
            {
                Query = query
            });

            return response.FetchXml;
        }

        /// <summary>
        /// Retrieves a record.
        /// </summary>
        /// <param name="organizationService">An instance of the <see cref="IOrganizationService"/>.</param>
        /// <param name="entityName">The logical name of the entity that is specified in the entityId parameter.</param>
        /// <param name="id">The ID of the record that you want to retrieve.</param>
        /// <param name="columnSet">The set of columns or attributes to retrieve. Pass an instance of <see cref="ColumnSet"/> with a null argument to retrieve only the primary key.</param>
        /// <param name="allowNull">When set to true, a null value is returned if the entity is not found. Otherwise an exception will be thrown.</param>
        /// <returns>The specified record.</returns>
        public static Entity Retrieve(this IOrganizationService organizationService, string entityName, Guid id, ColumnSet columnSet, bool allowNull)
        {
            if (string.IsNullOrWhiteSpace(entityName))
            {
                throw new ArgumentNullException(nameof(entityName), $"The parameter {nameof(entityName)} cannot be null.");
            }

            if (allowNull == false)
            {
                return organizationService.Retrieve(entityName, id, columnSet);
            }

            var mds = new MetadataService(organizationService);
            var md = mds.GetEntityMetadata(entityName);

            var query = new QueryExpression(entityName)
            {
                ColumnSet = columnSet,
                Criteria = new FilterExpression(LogicalOperator.And)
                {
                    Conditions =
                    {
                        new ConditionExpression(md.PrimaryIdAttribute, ConditionOperator.Equal, id)
                    }
                }
            };

            var results = organizationService.RetrieveMultiple(query);

            return results.Entities.FirstOrDefault();
        }

        /// <summary>
        /// Retrieve all entities returned from a query. WARNING: a call to this method can potentially take several minutes to complete and return a large volumne of records (not limited to the inital 5000 records of RetrieveMultiple).
        /// </summary>
        /// <param name="organizationService">An instance of the <see cref="IOrganizationService"/>.</param>
        /// <param name="query">The query criteria for the retrieval.</param>
        /// <returns>The collection of entities returned from the query.</returns>
        public static IEnumerable<Entity> RetrieveAll(this IOrganizationService organizationService, QueryExpression query, int pageSize = 50)
        {
            if (query == null)
            {
                throw new ArgumentNullException(nameof(query), $"The parameter {nameof(query)} cannot be null.");
            }

            var results = new List<Entity>();
            int pageNumber = 1;
            string pagingCookie = null;
            bool moreRecords = true;

            while (moreRecords)
            {
                var collection = organizationService.RetrievePage(query, pageSize, pageNumber, pagingCookie);

                if (collection.Entities != null)
                {
                    results.AddRange(collection.Entities);
                }

                if (collection.MoreRecords)
                {
                    pagingCookie = collection.PagingCookie;
                    pageNumber++;
                }

                moreRecords = collection.MoreRecords;
            }

            return results;
        }

        /// <summary>
        /// Retrieves a collection of records.
        /// </summary>
        /// <param name="organizationService">An instance of the <see cref="IOrganizationService"/>.</param>
        /// <param name="fetchXml">The FetchXml query string.</param>
        /// <returns>The collection of entities returned from the query.</returns>
        public static EntityCollection RetrieveMultiple(this IOrganizationService organizationService, string fetchXml)
        {
            if (string.IsNullOrWhiteSpace(fetchXml))
            {
                throw new ArgumentNullException(nameof(fetchXml), $"The parameter {nameof(fetchXml)} cannot be null.");
            }

            var query = new FetchExpression(fetchXml);
            var response = organizationService.RetrieveMultiple(query);

            return response;
        }

        /// <summary>
        /// Retrieves a collection of records.
        /// </summary>
        /// <param name="organizationService">An instance of the <see cref="IOrganizationService"/>.</param>
        /// <param name="entityName">Logical name of the entity to retrieve.</param>
        /// <param name="conditions">A list of <see cref="ConditionExpression"/> used to filter the request. All conditions will be combined with an And operator.</param>
        /// <param name="columnSet">The set of columns or attributes to retrieve. Pass an instance of <see cref="ColumnSet"/> with a null argument to retrieve only the primary key.</param>
        /// <returns>The collection of entities returned from the query.</returns>
        public static EntityCollection RetrieveMultiple(this IOrganizationService organizationService, string entityName, List<ConditionExpression> conditions, ColumnSet columnSet)
        {
            FilterExpression criteria;
            QueryExpression query;

            if (string.IsNullOrWhiteSpace(entityName))
            {
                throw new ArgumentNullException(nameof(entityName), $"The parameter {nameof(entityName)} cannot be null.");
            }

            if (conditions == null)
            {
                throw new ArgumentNullException(nameof(conditions), $"The parameter {nameof(conditions)} cannot be null.");
            }

            if (conditions.Count == 0)
            {
                throw new ArgumentException(nameof(conditions), $"The parameter {nameof(conditions)} cannot be empty.");
            }

            if (columnSet == null)
            {
                throw new ArgumentNullException(nameof(columnSet), $"The parameter {nameof(columnSet)} cannot be null.");
            }

            criteria = new FilterExpression(LogicalOperator.And);

            foreach (var item in conditions)
            {
                criteria.Conditions.Add(item);
            }

            query = new QueryExpression(entityName)
            {
                ColumnSet = columnSet,
                Criteria = criteria
            };

            return organizationService.RetrieveMultiple(query);
        }

        /// <summary>
        /// Retrieves a collection of records based on a query and allows for pagination on large data sets. You should Inspect the <see cref="EntityCollection.MoreRecords"/> to determine whether or not additional pages are available.
        /// </summary>
        /// <param name="organizationService">An instance of the <see cref="IOrganizationService"/>.</param>
        /// <param name="query">The query criteria for the retrieval.</param>
        /// <param name="pageSize">The number of entity instances returned per page,</param>
        /// <param name="pageNumber">The number of the page returned from the query.</param>
        /// <param name="pagingCookie">The info used to page large result sets. This value is returned by the <see cref="EntityCollection"/>.</param>
        /// <returns>The collection of entities returned from the query.</returns>
        public static EntityCollection RetrievePage(this IOrganizationService organizationService, QueryExpression query, int pageSize, int pageNumber, string pagingCookie)
        {
            if (query == null)
            {
                throw new ArgumentNullException(nameof(query), $"The parameter {nameof(query)} cannot be null.");
            }

            query.PageInfo = new PagingInfo();
            query.PageInfo.Count = pageSize;
            query.PageInfo.PageNumber = pageNumber;
            query.PageInfo.PagingCookie = pagingCookie;

            return organizationService.RetrieveMultiple(query);
        }

        /// <summary>
        /// Creates a new record or update it if record already exists.
        /// </summary>
        /// <param name="organizationService"></param>
        /// <param name="entity">An entity instance that contains the properties to set into a new or existing record.</param>
        /// <returns>The <see cref="UpsertResponse"/>.</returns>
        public static UpsertResponse Upsert(this IOrganizationService organizationService, Entity entity)
        {
            if (entity == null)
            {
                throw new ArgumentNullException(nameof(entity), $"The parameter {nameof(entity)} cannot be null.");
            }

            var response = (UpsertResponse)organizationService.Execute(new UpsertRequest()
            {
                Target = entity
            });

            return response;
        }

        /// <summary>
        /// Sends a <see cref="Microsoft.Crm.Sdk.Messages.WhoAmIRequest"/>.
        /// </summary>
        /// <param name="organizationService">An instance of the <see cref="IOrganizationService"/>.</param>
        /// <returns>A <see cref="Microsoft.Crm.Sdk.Messages.WhoAmIResponse"/>.</returns>
        public static WhoAmIResponse WhoAmI(this IOrganizationService organizationService)
        {
            return (WhoAmIResponse)organizationService.Execute(new WhoAmIRequest());
        }
    }
}