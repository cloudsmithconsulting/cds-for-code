using System;
using System.Linq;
using CloudSmith.Dynamics365.CrmSvcUtil.Configuration.Naming;
using Microsoft.Xrm.Sdk.Metadata;

namespace CloudSmith.Dynamics365.CrmSvcUtil.Naming.Mapping
{
    internal class ConfigurationMapper : IMapper
    {
        private readonly MappingCollection _mapping;

        public ConfigurationMapper(MappingCollection mapping)
        {
            _mapping = mapping;
        }

        /// <inheritdoc />
        public bool GetNameFromMap(EntityMetadata entityMetadata, IServiceProvider serviceProvider, out string value)
        {
            Map map = _mapping.SingleOrDefault(m => m.Type == MapType.Entity && m.From.ToLowerInvariant() == entityMetadata.LogicalName);

            if (map != null)
            {
                value = map.To;
                return true;
            }

            value = null;
            return false;
        }

        /// <inheritdoc />
        public bool GetNameFromMap(EntityMetadata entityMetadata, AttributeMetadata attributeMetadata, IServiceProvider services, out string value)
        {
            string name = $"{attributeMetadata.EntityLogicalName}.{attributeMetadata.LogicalName}";
            Map map = _mapping.SingleOrDefault(m => m.Type == MapType.Attribute && m.From.ToLowerInvariant() == name);

            if (map != null)
            {
                value = map.To;
                return true;
            }

            value = null;
            return false;
        }
    }
}