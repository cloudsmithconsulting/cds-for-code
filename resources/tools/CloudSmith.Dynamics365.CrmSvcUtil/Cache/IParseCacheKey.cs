using System;

namespace CloudSmith.Dynamics365.CrmSvcUtil.Cache
{
    public interface IParseCacheKey<T1>
    {
        Func<T1, string> ParseKey { get; }
    }

    public interface IParseCacheKey<T1, T2>
    {
        Func<T1, T2, string> ParseKey { get; }
    }
}
