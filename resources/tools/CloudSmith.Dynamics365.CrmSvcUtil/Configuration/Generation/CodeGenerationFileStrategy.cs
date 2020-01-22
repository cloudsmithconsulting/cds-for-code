namespace CloudSmith.Dynamics365.CrmSvcUtil.Configuration.Generation
{
    public enum CodeGenerationFileStrategy
    {
        /// <summary>
        /// All code is generated into a single file as output.  This is the default behavior.
        /// </summary>
        SingleFile,

        /// <summary>
        /// All code of a given type (e.g. SdkRequest) is geneated into a single file as output.
        /// </summary>
        OneFilePerType,

        /// <summary>
        /// All code of a given type (e.g. SdkRequest) for a given item (e.g. SpecificActionRequest) is generated into seperate files.
        /// </summary>
        OneFilePerItem,
    }
}