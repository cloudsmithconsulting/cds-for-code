using System;

namespace CloudSmith.Cds.CrmSvcUtil.Cache
{
    public interface IHaveCacheKey
    {
        Func<string> Key { get; }
    }
}
