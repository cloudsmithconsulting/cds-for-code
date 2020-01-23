using CloudSmith.Cds.CrmSvcUtil.Configuration.Filter;
using CloudSmith.Cds.CrmSvcUtil.Configuration.Generation;
using CloudSmith.Cds.CrmSvcUtil.Configuration.Naming;
using System.Configuration;

namespace CloudSmith.Cds.CrmSvcUtil.Configuration
{
    public interface IServiceExtensionsConfiguration
    {
        FilterContainerElement Filtering { get; set; }
        NamingElement Naming { get; set; }
        CodeGenerationElement CodeGeneration { get; set; }
    }

    public sealed class ServiceExtensionsConfigurationSection : ConfigurationSection, IServiceExtensionsConfiguration
    {
        private static readonly string ServiceExtensionsSectionKey = "ServiceExtensions";

        public static ServiceExtensionsConfigurationSection Create()
        {
            if (!(ConfigurationManager.GetSection(ServiceExtensionsSectionKey) is ServiceExtensionsConfigurationSection section))
            {
                section = new ServiceExtensionsConfigurationSection();
            }

            return section;
        }

        [ConfigurationProperty("Filtering")]
        public FilterContainerElement Filtering
        {
            get => (FilterContainerElement)base["Filtering"];
            set => base["Filtering"] = value;
        }

        [ConfigurationProperty("Naming")]
        public NamingElement Naming
        {
            get => (NamingElement)base["Naming"];
            set => base["Naming"] = value;
        }

        [ConfigurationProperty("CodeGeneration")]
        public CodeGenerationElement CodeGeneration
        {
            get => (CodeGenerationElement)base["CodeGeneration"];
            set => base["CodeGeneration"] = value;
        }
    }
}
