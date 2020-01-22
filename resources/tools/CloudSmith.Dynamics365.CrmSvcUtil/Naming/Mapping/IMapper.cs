using System;
using Microsoft.Xrm.Sdk.Metadata;

namespace CloudSmith.Dynamics365.CrmSvcUtil.Naming.Mapping
{
    internal interface IMapper
    {
        bool GetNameFromMap(EntityMetadata entityMetadata, IServiceProvider serviceProvider, out string value);
        bool GetNameFromMap(EntityMetadata entityMetadata, AttributeMetadata attributeMetadata, IServiceProvider services, out string value);
    }
}