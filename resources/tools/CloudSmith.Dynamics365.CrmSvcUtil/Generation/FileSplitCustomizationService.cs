using System;
using System.CodeDom;
using CloudSmith.Dynamics365.CrmSvcUtil.Configuration;

namespace CloudSmith.Dynamics365.CrmSvcUtil.Generation
{
    public sealed class FileSplitCustomizationService : BaseCustomizationService
    {
        public FileSplitCustomizationService(BaseCustomizationService service) : base(service)
        {
            Generator = new MultipleFileGenerator(service.Configuration);
        }
        public FileSplitCustomizationService() : this(ServiceExtensionsConfigurationSection.Create()) { }
        public FileSplitCustomizationService(IServiceExtensionsConfiguration configuration) : base(configuration)
        {
            Generator = new MultipleFileGenerator(configuration);
        }

        private MultipleFileGenerator Generator { get; }

        /// <summary>
        /// Remove the unnecessary classes that we generated for entities. 
        /// </summary>
        public override void CustomizeCodeDom(CodeCompileUnit codeUnit, IServiceProvider services)
        {
            Generator.InitializeFileSystem();

            for (var i = 0; i < codeUnit.Namespaces.Count; ++i)
            {
                Generator.Split(codeUnit.Namespaces[i]);
            }

            Generator.Generate();
            Generator.RemoveGeneratedTypes(codeUnit);
        }
    }
}
