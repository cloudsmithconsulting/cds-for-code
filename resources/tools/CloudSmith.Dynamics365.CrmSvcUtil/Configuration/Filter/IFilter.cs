namespace CloudSmith.Dynamics365.CrmSvcUtil.Configuration.Filter
{
    public interface IFilterElement
    {
        string Expression { get; set; }
        bool IgnoreCase { get; set; }
    }
}