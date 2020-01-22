using System;
using System.Configuration;
using System.IO;
using System.Linq;

namespace CloudSmith.Dynamics365.CrmSvcUtil.Configuration.Generation
{
    public class CodeGenerationElement : ConfigurationElement
    {
        [ConfigurationProperty("Files")]
        [ConfigurationCollection(typeof(CodeGenerationFileOptionsCollection),
          AddItemName = "add",
          ClearItemsName = "clear",
          RemoveItemName = "remove")]
        public CodeGenerationFileOptionsCollection Files
        {
            get => (CodeGenerationFileOptionsCollection)base["Files"];
            set => base["Files"] = value;
        }

        [ConfigurationProperty("Behaviors")]
        [ConfigurationCollection(typeof(CodeGenerationBehaviorsCollection),
          AddItemName = "add",
          ClearItemsName = "clear",
          RemoveItemName = "remove")]
        public CodeGenerationBehaviorsCollection Behaviors
        {
            get => (CodeGenerationBehaviorsCollection)base["Behaviors"];
            set => base["Behaviors"] = value;
        }

        [ConfigurationProperty("language")]
        public CodeGenerationLanguage? Language
        {
            get => (CodeGenerationLanguage?)base["language"];
            set => base["language"] = value;
        }

        [ConfigurationProperty("path")]
        public string Path
        {
            get => (string)base["path"];
            set => base["path"] = value;
        }
    }
}