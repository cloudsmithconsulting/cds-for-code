using System;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Crm.Services.Utility;
using Microsoft.Xrm.Sdk.Metadata;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using Microsoft.Xrm.Sdk.Messages;
using CloudSmith.Dynamics365.CrmSvcUtil.Configuration;
using CloudSmith.Dynamics365.CrmSvcUtil.Configuration.Filter;

namespace CloudSmith.Dynamics365.CrmSvcUtil.Filter
{
    /// <summary>
    /// When applied, this extension instructs CrmSvcUtil to only generates 
    /// entities/attributes/option sets that are part of a solution.
    /// </summary>
    public class SolutionFilterService : FilterListFilterService
    {
        internal SolutionFilterService(BaseFilterService service, FilterListStrategy strategy)
            : base(service, strategy)
        { InitializeSolutionFilterService(); }

        public SolutionFilterService(ICodeWriterFilterService defaultService)
            : base(defaultService)
        { InitializeSolutionFilterService(); }

        internal SolutionFilterService(ICodeWriterFilterService defaultService, IServiceExtensionsConfiguration configuration)
            : base(defaultService, configuration)
        { InitializeSolutionFilterService(); }

        internal SolutionFilterService(ICodeWriterFilterService defaultService, IServiceExtensionsConfiguration configuration, FilterListStrategy strategy)
            : base(defaultService, configuration, strategy)
        { InitializeSolutionFilterService(); }

        public SolutionFilterService(ICodeWriterMessageFilterService defaultService)
            : base(defaultService)
        { InitializeSolutionFilterService(); }

        internal SolutionFilterService(ICodeWriterMessageFilterService defaultService, IServiceExtensionsConfiguration configuration)
            : base(defaultService, configuration)
        { InitializeSolutionFilterService(); }

        internal SolutionFilterService(ICodeWriterMessageFilterService defaultService, IServiceExtensionsConfiguration configuration, FilterListStrategy strategy)
            : base(defaultService, configuration, strategy)
        { InitializeSolutionFilterService(); }

        private IEnumerable<EntityMetadata> solutionEntities;

        internal void InitializeSolutionFilterService()
        {
            var solutions = FilterConfiguration.Solutions
                .Where(s => !string.IsNullOrEmpty(s.SolutionName))
                .Select(s => s.SolutionName)
                .ToArray();

            if (solutions?.Length > 0)
            {
                var service = new OrganizationServiceFactory().Create();
                solutionEntities = GetSolutionEntities(solutions, service);
            }
        }

        protected override bool? GenerateEntity(EntityMetadata entityMetadata)
        {
            if (solutionEntities == null || solutionEntities.Count() == 0)
                return null;

            return solutionEntities.Count(e => e.LogicalName == entityMetadata.LogicalName) > 0;
        }

        protected override bool? GenerateAttribute(AttributeMetadata attributeMetadata)
        {
            return null;
        }

        protected override bool? GenerateOptionSet(OptionSetMetadataBase optionSetMetadata)
        {
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

        private IEnumerable<EntityMetadata> GetSolutionEntities(string[] solutionNames, IOrganizationService service)
        {
            if (solutionNames == null || solutionNames.Length == 0)
            {
                return new EntityMetadata[] { };
            }

            var componentsQuery = new QueryExpression
            {
                EntityName = "solutioncomponent",
                ColumnSet = new ColumnSet("objectid"),
                Criteria = new FilterExpression()
                {
                    Conditions =
                    {
                        new ConditionExpression("componenttype", ConditionOperator.Equal, 1)
                    }
                },
                LinkEntities =
                {
                    new LinkEntity("solutioncomponent", "solution", "solutionid", "solutionid", JoinOperator.Inner)
                    {
                        LinkCriteria = new FilterExpression()
                        {
                            Conditions =
                            {
                                new ConditionExpression("uniquename", ConditionOperator.In, solutionNames)
                            }
                        }
                    }
                }
            };

            Trace.LogInformation($"Querying Dynamics for solution components in: {string.Join(",", solutionNames)}.");
            var componentCollection = service.RetrieveMultiple(componentsQuery);

            Trace.LogInformation($"Querying Dynamics for all entities.");
            var allEntitiesResponse = (RetrieveAllEntitiesResponse)service.Execute(new RetrieveAllEntitiesRequest()
            {
                EntityFilters = EntityFilters.Entity,
                RetrieveAsIfPublished = true
            });

            var entitiesInSolution = allEntitiesResponse.EntityMetadata.Join(
                componentCollection.Entities.Select(x => x.Attributes["objectid"]),
                x => x.MetadataId, 
                y => y, 
                (x, y) => x)
                .ToList();

            if (entitiesInSolution.Any(a => a.IsActivity.HasValue && a.IsActivity.Value))
            {
                entitiesInSolution.Add(GetEntityMetadata("activityparty", service));
            }

            if (entitiesInSolution.Any(a => a.LogicalName == "service"))
            {
                entitiesInSolution.Add(GetEntityMetadata("calendarrule", service));
            }

            return entitiesInSolution;
        }

        private EntityMetadata GetEntityMetadata(string entityLogicalName, IOrganizationService service)
        {
            var response = (RetrieveEntityResponse)service.Execute(new RetrieveEntityRequest
            {
                EntityFilters = EntityFilters.Entity,
                LogicalName = entityLogicalName,
                RetrieveAsIfPublished = true
            });

            return response.EntityMetadata;
        }
    }
}
