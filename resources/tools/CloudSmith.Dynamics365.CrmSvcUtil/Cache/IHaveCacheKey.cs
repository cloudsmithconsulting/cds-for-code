using System;

namespace CloudSmith.Dynamics365.CrmSvcUtil.Cache
{
    public interface IHaveCacheKey
    {
        Func<string> Key { get; }
    }
}
