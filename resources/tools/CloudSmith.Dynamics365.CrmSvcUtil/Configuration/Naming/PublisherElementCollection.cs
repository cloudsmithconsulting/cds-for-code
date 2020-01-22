namespace CloudSmith.Dynamics365.CrmSvcUtil.Configuration.Naming
{
    public sealed class PublisherElementCollection : MapConfigurationElementCollection<PublisherElement>
    {
        /// <inheritdoc />
        protected override object GetElementKey(PublisherElement element)
        {
            return element.Name;
        }
    }

    public enum PublisherNamingAction
    {
        Remove,
    }
}