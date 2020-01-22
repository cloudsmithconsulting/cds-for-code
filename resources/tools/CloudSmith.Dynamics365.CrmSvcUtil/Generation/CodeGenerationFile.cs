using System.CodeDom;
using System.Collections.Generic;
using CloudSmith.Dynamics365.CrmSvcUtil.Configuration.Generation;

namespace CloudSmith.Dynamics365.CrmSvcUtil.Generation
{
    public class CodeGenerationFile
    {
        public CodeGenerationFile()
        {
            Imports = new List<string>();
            Items = new List<CodeTypeDeclaration>();
        }

        public CodeGenerationFileType Type { get; set; }
        public List<CodeTypeDeclaration> Items { get; set; }
        public string Namespace { get; set; }
        public List<string> Imports { get; set; }
    }
}
