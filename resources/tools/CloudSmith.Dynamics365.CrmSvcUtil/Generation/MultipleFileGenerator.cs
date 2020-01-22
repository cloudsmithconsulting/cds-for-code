using System;
using System.CodeDom;
using System.CodeDom.Compiler;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CloudSmith.Dynamics365.CrmSvcUtil.Cache;
using CloudSmith.Dynamics365.CrmSvcUtil.Configuration;
using CloudSmith.Dynamics365.CrmSvcUtil.Configuration.Generation;
using Microsoft.CSharp;
using Microsoft.VisualBasic;

namespace CloudSmith.Dynamics365.CrmSvcUtil.Generation
{
    public sealed class MultipleFileGenerator
    {
        public MultipleFileGenerator(IServiceExtensionsConfiguration config)
        {
            Files = new Dictionary<string, CodeGenerationFile>();
            Options = new MultipleFileGeneratorOptions(config);
            GeneratedTypes = new List<string>();
        }

        public Dictionary<string, CodeGenerationFile> Files { get; }
        public MultipleFileGeneratorOptions Options { get; }
        private List<string> GeneratedTypes { get; }

        public void InitializeFileSystem()
        {
            EnsurePath(new string[] {
                Path.GetDirectoryName(Options.RootPath),
                Options.OutputPaths[CodeGenerationFileType.Entities],
                Options.OutputPaths[CodeGenerationFileType.AttributeConstants],
                Options.OutputPaths[CodeGenerationFileType.OptionSets],
                Options.OutputPaths[CodeGenerationFileType.Requests]
            });
        }

        internal void RemoveGeneratedTypes(CodeCompileUnit codeUnit)
        {
            for (var i = codeUnit.Namespaces.Count - 1; i >= 0; i--)
            {
                var @namespace = codeUnit.Namespaces[i];
                var removePositions = new List<int>();

                for (var j = @namespace.Types.Count - 1; j >= 0; j--)
                {
                    var type = @namespace.Types[j];
                    var typeName = $"{@namespace.Name}.{type.Name}";

                    if (GeneratedTypes.Count(t => t == typeName) > 0)
                    {
                        removePositions.Add(j);
                    }
                }

                foreach (int removePosition in removePositions)
                    @namespace.Types.RemoveAt(removePosition);
            }

            GeneratedTypes.Clear();
        }

        public void Split(CodeNamespace @namespace)
        {
            var imports = new List<string>();

            for (var i = 0; i < @namespace.Imports.Count; i++)
            {
                imports.Add(@namespace.Imports[i].Namespace);
            }

            foreach (CodeTypeDeclaration type in @namespace.Types)
            {
                CodeGenerationFileType? fileType = null;
                bool isEntity = false, isOptionSet = false, isRequest = false, isResponse = false, isAttributes = false, isContext = false;
                OptionSetCacheItem optionSet;
                string entityTypeName = null, rootFile = Path.GetFileNameWithoutExtension(Options.RootFile);

                if (type.IsClass)
                {
                    isEntity = type.HasBaseType("Microsoft.Xrm.Sdk.Entity") || type.HasBaseType("Entity");
                    isContext = type.HasBaseType("Microsoft.Xrm.Sdk.Client.OrganizationServiceContext") || type.HasBaseType("OrganizationServiceContext");
                    isRequest = type.HasBaseType("Microsoft.Xrm.Sdk.OrganizationRequest") || type.HasBaseType("OrganizationRequest");
                    isResponse = type.HasBaseType("Microsoft.Xrm.Sdk.OrganizationResponse") || type.HasBaseType("OrganizationResponse");

                    entityTypeName = isEntity ? type.Name : string.Empty;
                }

                if (type.IsEnum)
                {
                    optionSet = DynamicsMetadataCache.OptionSets.Where(o => o.Value.GeneratedTypeName == type.Name).Select(o => o.Value).FirstOrDefault();
                    isOptionSet = optionSet != null;

                    entityTypeName = isOptionSet && !string.IsNullOrEmpty(optionSet.EntityLogicalName) && optionSet.EntityLogicalName != "*"
                        ? DynamicsMetadataCache.Entities.First(e => e.Value.LogicalName == optionSet.EntityLogicalName).Value.GeneratedTypeName
                        : string.Empty;
                }

                if (type.IsStruct)
                {
                    isAttributes = true;
                    entityTypeName = type.Name.Replace("Attributes", "");
                }

                if (isEntity)
                    fileType = CodeGenerationFileType.Entities;
                else if (isOptionSet)
                    fileType = CodeGenerationFileType.OptionSets;
                else if (isRequest)
                    fileType = CodeGenerationFileType.Requests;
                else if (isResponse)
                    fileType = CodeGenerationFileType.Responses;
                else if (isContext)
                    fileType = CodeGenerationFileType.ServiceContext;
                else if (isAttributes)
                    fileType = CodeGenerationFileType.AttributeConstants;

                string file = Options.RootPath;

                if (fileType.HasValue)
                {
                    CodeGenerationFileStrategy strategy;
                   
                    // OptionSets tied to entities are treated as entities.
                    if (fileType == CodeGenerationFileType.OptionSets
                        && !string.IsNullOrEmpty(entityTypeName))
                    {
                        fileType = CodeGenerationFileType.Entities;
                    }

                    file = Options.OutputFiles[fileType.Value];
                    strategy = Options.GetStrategy(fileType.Value);

                    switch (strategy)
                    {
                        case CodeGenerationFileStrategy.OneFilePerItem:
                            file = string.Format(file, rootFile, fileType.ToString(), string.IsNullOrEmpty(entityTypeName) ? type.Name : entityTypeName);

                            break;
                        case CodeGenerationFileStrategy.OneFilePerType:
                            file = string.Format(file, rootFile, fileType.ToString());

                            break;
                        case CodeGenerationFileStrategy.SingleFile:
                            file = string.Format(file, rootFile);
    
                            break;
                    }
                }

                AddTypeToFile(file, type, @namespace.Name, imports.Count > 0 ? imports.ToArray() : null);
            }
        }

        public void AddTypeToFile(string filename, CodeTypeDeclaration type, string @namespace)
        {
            AddTypeToFile(filename, type, @namespace, null);
        }

        public void AddTypeToFile(string filename, CodeTypeDeclaration type, string @namespace, string[] imports)
        {
            if (!Files.ContainsKey(filename))
            {
                Files.Add(filename, new CodeGenerationFile()
                {
                    Namespace = @namespace
                });
            }

            if (imports != null && imports.Length > 0)
            {
                foreach (var import in imports)
                {
                    if (!Files[filename].Imports.Contains(import))
                        Files[filename].Imports.Add(import);
                }
            }

            Files[filename].Items.Add(type);
        }

        public void Generate(CodeGeneratorOptions options = null)
        {
            var provider = GetProvider(Options.Language, null);

            if (provider != null)
            {
                options = options ?? new CodeGeneratorOptions();

                foreach (var artifact in Files)
                {
                    var @namespace = new CodeNamespace() { Name = artifact.Value.Namespace };

                    foreach (var import in artifact.Value.Imports)
                    {
                        @namespace.Imports.Add(new CodeNamespaceImport(import));
                    }

                    foreach (var type in artifact.Value.Items)
                    {
                        @namespace.Types.Add(type);

                        GeneratedTypes.Add($"{@namespace.Name}.{type.Name}");
                    }

                    using (TextWriter output = new StreamWriter(artifact.Key, false))
                    {
                        provider.GenerateCodeFromNamespace(@namespace, output, options);
                    }
                }
            }
        }

        private void EnsurePath(string[] paths)
        {
            foreach (var path in paths)
                EnsurePath(path);
        }

        private void EnsurePath(string path)
        {
            if (!Directory.Exists(path))
                Directory.CreateDirectory(path);
        }

        private CodeDomProvider GetProvider(CodeGenerationLanguage language, IDictionary<string, string> options)
        {
            switch (language)
            {
                case CodeGenerationLanguage.CSharp:
                    return options == null || options.Count == 0 ? new CSharpCodeProvider() : new CSharpCodeProvider(options);
                case CodeGenerationLanguage.VisualBasic:
                    return options == null || options.Count == 0 ? new VBCodeProvider() : new VBCodeProvider(options);
            }

            return null;
        }
    }
}
