namespace CloudSmith.Cds.CrmSvcUtil.Configuration.Filter
{
    public interface IFilterElement
    {
        string Expression { get; set; }
        bool IgnoreCase { get; set; }
    }
}