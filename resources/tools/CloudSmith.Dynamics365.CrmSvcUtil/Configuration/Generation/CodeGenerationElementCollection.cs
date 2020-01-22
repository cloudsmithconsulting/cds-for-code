using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CloudSmith.Dynamics365.CrmSvcUtil.Configuration.Generation
{
    public class CodeGenerationBehaviorsCollection : MapConfigurationElementCollection<CodeGenerationBehaviorElement>
    {
        /// <inheritdoc />
        protected override object GetElementKey(CodeGenerationBehaviorElement element)
        {
            return element.Name;
        }
    }

    public class CodeGenerationFileOptionsCollection : MapConfigurationElementCollection<CodeGenerationFileOptionsElement>
    {
        /// <inheritdoc />
        protected override object GetElementKey(CodeGenerationFileOptionsElement element)
        {
            return element.FileType.ToString();
        }
    }
}
