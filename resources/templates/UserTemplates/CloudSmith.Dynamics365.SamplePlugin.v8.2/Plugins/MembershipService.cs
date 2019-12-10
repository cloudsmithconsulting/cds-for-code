using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Query;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace #{Namespace}.Plugins
{
    public class MembershipService
    {
        public const string AdminRoleTemplateId = "627090FF-40A3-4053-8790-584EDC5BE201";

        private IOrganizationService _organizationService;

        public MembershipService(IOrganizationService organizationService)
        {
            _organizationService = organizationService ?? throw new ArgumentNullException(nameof(organizationService), $"The parameter {nameof(organizationService)} cannot be null.");
        }

        /// <summary>
        /// Checks whether an user has the System Administrator role.
        /// </summary>
        /// <param name="userId">The user to verify.</param>
        /// <returns>True if user is System Administrator, otherwise false.</returns>
        public bool IsSystemAdministrator(Guid userId)
        {
            bool isAdmin = false;

            var query = new QueryExpression("role")
            {
                Criteria = new FilterExpression(LogicalOperator.And)
                {
                    Conditions =
                    {
                        new ConditionExpression("roletemplateid", ConditionOperator.Equal, new Guid(AdminRoleTemplateId))
                    }
                }
            };

            var link = query.AddLink("systemuserroles", "roleid", "roleid");
            link.LinkCriteria.AddCondition("systemuserid", ConditionOperator.Equal, userId);

            var results = _organizationService.RetrieveMultiple(query);

            if (results.Entities != null)
            {
                isAdmin = results.Entities.Count > 0;
            }

            return isAdmin;
        }

        /// <summary>
        /// Checks whether user is non Interactive User or Delegated Admin (available on CRM online).
        /// </summary>
        /// <param name="userId">The user to check.</param>
        /// <returns>True if user is non Interactive User or Delegated Admin, otherwise false.</returns>
        public bool IsNonInteractiveOrDelegatedUser(Guid userId)
        {
            bool isDisabled;

            return IsNonInteractiveOrDelegatedUser(userId, out isDisabled);
        }

        /// <summary>
        /// Checks whether user is non Interactive User or Delegated Admin (available on CRM online).
        /// </summary>
        /// <param name="userId">The user to check.</param>
        /// <param name="disabled">Returns True if user is disabled.</param>
        /// <returns>True if user is non Interactive User or Delegated Admin, otherwise false.</returns>
        public bool IsNonInteractiveOrDelegatedUser(Guid userId, out bool disabled)
        {
            /*
             * 0 : Read-Write
             * 1 : Administrative
             * 2 : Read
             * 3 : Support User
             * 4 : Non-interactive
             * 5 : Delegated Admin 
             */

            Entity user = _organizationService.Retrieve("systemuser", userId, new ColumnSet("accessmode", "isdisabled"));

            var accessMode = user.GetAttributeValue<OptionSetValue>("accessmode").Value;
            disabled = user.GetAttributeValue<bool>("isdisabled");

            if (accessMode == 4 || accessMode == 5 || disabled) // non interactive, delegate admin, system, integration
            {
                return true;
            }

            return false;
        }

        /// <summary>
        /// Cheks whether a security role is assinged to an user.
        /// </summary>
        /// <param name="userId">The user to check.</param>
        /// <param name="roleId">The role to check.</param>
        /// <returns>True if user is assgined the security role, otherwhise false.</returns>
        public bool UserHasRole(Guid userId, Guid roleId)
        {
            bool hasRole = false;
            var query = new QueryExpression("systemuserroles")
            {
                Criteria = new FilterExpression(LogicalOperator.And)
                {
                    Conditions =
                    {
                        new ConditionExpression("roleid", ConditionOperator.Equal, roleId),
                        new ConditionExpression("systemuserid", ConditionOperator.Equal, userId)
                    }
                }
            };

            var results = _organizationService.RetrieveMultiple(query);

            if (results.Entities != null)
            {
                hasRole = results.Entities.Count > 0;
            }

            return hasRole;
        }

        /// <summary>
        /// Cheks whether a security role is assinged to an user.
        /// </summary>
        /// <param name="userId">The user to check.</param>
        /// <param name="roleName">Security role name.</param>
        /// <returns>True if user is assgined the security role, otherwhise false.</returns>
        public bool UserHasRole(Guid userId, string roleName)
        {
            bool isAdmin = false;

            var query = new QueryExpression("role")
            {
                Criteria = new FilterExpression(LogicalOperator.And)
                {
                    Conditions =
                    {
                        new ConditionExpression("name", ConditionOperator.Equal, roleName)
                    }
                }
            };

            var link = query.AddLink("systemuserroles", "roleid", "roleid");
            link.LinkCriteria.AddCondition("systemuserid", ConditionOperator.Equal, userId);

            var results = _organizationService.RetrieveMultiple(query);

            if (results.Entities != null)
            {
                isAdmin = results.Entities.Count > 0;
            }

            return isAdmin;
        }
    }
}