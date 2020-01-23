using System;

namespace CloudSmith.Cds.CrmSvcUtil.Cache
{
    public interface IParseMetadata<T1>
    {
        Action<T1> ParseMetadata { get; }
    }
}
