using System;

namespace CloudSmith.Dynamics365.CrmSvcUtil.Cache
{
    public interface IParseMetadata<T1>
    {
        Action<T1> ParseMetadata { get; }
    }
}
