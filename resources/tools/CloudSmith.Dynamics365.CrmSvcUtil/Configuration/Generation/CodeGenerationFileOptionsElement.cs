using System.Configuration;

namespace CloudSmith.Dynamics365.CrmSvcUtil.Configuration.Generation
{
    public class CodeGenerationFileOptionsElement : ConfigurationElement
    {
        public CodeGenerationFileOptionsElement()
        {
        }

        public CodeGenerationFileOptionsElement(string name, CodeGenerationFileType type, CodeGenerationFileStrategy strategy)
        {
            Filename = name;
            FileType = type;
            Strategy = strategy;
        }

        [ConfigurationProperty("filename", IsRequired = true)]
        public string Filename
        {
            get => (string)this["filename"];
            set => this["filename"] = value;
        }

        [ConfigurationProperty("type", IsRequired = true)]
        public CodeGenerationFileType FileType
        {
            get => (CodeGenerationFileType)this["type"];
            set => this["type"] = value;
        }

        [ConfigurationProperty("generate", IsRequired = true)]
        public CodeGenerationFileStrategy Strategy
        {
            get => (CodeGenerationFileStrategy)this["generate"];
            set => this["generate"] = value;
        }
    }
}