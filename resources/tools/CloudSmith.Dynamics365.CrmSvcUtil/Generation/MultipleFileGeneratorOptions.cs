using System.Collections.Generic;
using System.IO;
using System.Linq;
using CloudSmith.Dynamics365.CrmSvcUtil.Configuration;
using CloudSmith.Dynamics365.CrmSvcUtil.Configuration.Generation;

namespace CloudSmith.Dynamics365.CrmSvcUtil.Generation
{
    public class MultipleFileGeneratorOptions
    {
        public MultipleFileGeneratorOptions(IServiceExtensionsConfiguration config)
        {
            Configuration = config;
            OutputPaths = new Dictionary<CodeGenerationFileType, string>();
            OutputFiles = new Dictionary<CodeGenerationFileType, string>();

            LoadDefaults();
        }

        private IServiceExtensionsConfiguration Configuration { get; }
        public Dictionary<CodeGenerationFileType, string> OutputPaths { get; }
        public Dictionary<CodeGenerationFileType, string> OutputFiles { get; }
        public CodeGenerationLanguage Language { get; private set; }
        public string RootPath { get; private set; }
        public string RootFile { get; private set; }

        public CodeGenerationFileStrategy GetStrategy(CodeGenerationFileType type)
        {
            return Configuration.CodeGeneration.Files.FirstOrDefault(f => f.FileType == type)?.Strategy ?? CodeGenerationFileStrategy.SingleFile;
        }

        private void LoadDefaults()
        {
            Language = Configuration.CodeGeneration.GetLanguage();
            RootPath = Configuration.CodeGeneration.GetOutputPath();
            RootFile = Configuration.CodeGeneration.GetOutputFile();

            RootPath = RootPath.Replace("\\.\\", "\\");

            CodeGenerationFileType[] types = {
                CodeGenerationFileType.AttributeConstants,
                CodeGenerationFileType.Entities,
                CodeGenerationFileType.OptionSets,
                CodeGenerationFileType.Requests,
                CodeGenerationFileType.Responses,
                CodeGenerationFileType.ServiceContext
            };

            foreach (var type in types)
            {
                var options = Configuration.CodeGeneration.GetOutputOptions(type);
                string file = options.GetComputedFile(RootPath);
                string path = Path.GetDirectoryName(file);

                OutputFiles.Add(type, file);
                OutputPaths.Add(type, path);
            }
        }
    }
}
