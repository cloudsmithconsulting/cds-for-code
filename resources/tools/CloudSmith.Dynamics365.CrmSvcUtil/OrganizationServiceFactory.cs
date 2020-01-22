using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Tooling.Connector;

namespace CloudSmith.Dynamics365.CrmSvcUtil
{
    public class OrganizationServiceFactory
    {
        public IOrganizationService Create()
        {
            string authType, connectionString;

            authType = Arguments.GetArgument("authtype") ?? (!string.IsNullOrEmpty(Arguments.GetArgument("domain")) ? "AD" : "Office365");
            connectionString = (Arguments.GetArgument("connectionstring") ??
                                       Arguments.GetArgument("connstr")) ??
                                       $"AuthType={authType};Url={Arguments.GetArgument("url")};Username={Arguments.GetArgument("username")};Password={Arguments.GetArgument("password")};Domain={Arguments.GetArgument("Domain")};";

            var connection = new CrmServiceClient(connectionString);
            var service = connection.OrganizationWebProxyClient ?? (IOrganizationService)connection.OrganizationServiceProxy;

            return service;
        }
    }
}
