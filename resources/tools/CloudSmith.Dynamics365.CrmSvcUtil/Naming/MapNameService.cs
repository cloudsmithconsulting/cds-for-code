using System;
using System.Diagnostics;
using CloudSmith.Dynamics365.CrmSvcUtil.Configuration;
using CloudSmith.Dynamics365.CrmSvcUtil.Naming.Mapping;
using Microsoft.Crm.Services.Utility;
using Microsoft.Xrm.Sdk;
using Microsoft.Xrm.Sdk.Metadata;

namespace CloudSmith.Dynamics365.CrmSvcUtil.Naming
{
    public class MapNameService : BaseNamingService
    {
        public MapNameService(BaseNamingService service) : base(service) { InitializeMapper(); }
        public MapNameService(INamingService defaultService) : base(defaultService) { InitializeMapper(); }
        public MapNameService(INamingService defaultService, IServiceExtensionsConfiguration configuration) : base(defaultService, configuration) { InitializeMapper(); }

        private IMapper _mapper;

        private void InitializeMapper()
        {
            _mapper = new ConfigurationMapper(Configuration.Naming.Mapping);
        }

        /// <inheritdoc />
        public override string GetNameForEntity(EntityMetadata entityMetadata, IServiceProvider services)
        {
            if (_mapper.GetNameFromMap(entityMetadata, services, out string value))
            {
                return value;
            }

            value = base.GetNameForEntity(entityMetadata, services);

            return value;
        }

        /// <inheritdoc />
        public override string GetNameForAttribute(EntityMetadata entityMetadata, AttributeMetadata attributeMetadata, IServiceProvider services)
        {
            if (_mapper.GetNameFromMap(entityMetadata, attributeMetadata, services, out string value))
            {
                return value;
            }

            value = base.GetNameForAttribute(entityMetadata, attributeMetadata, services);

            return value;
        }
    }
}
