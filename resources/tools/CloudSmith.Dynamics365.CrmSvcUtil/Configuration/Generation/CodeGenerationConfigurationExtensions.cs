using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CloudSmith.Dynamics365.CrmSvcUtil.Configuration.Generation
{
    public static class CodeGenerationConfigurationExtensions
    {
        public static string GetComputedPath(this CodeGenerationFileOptionsElement @this, string rootPath)
        {
            return Path.GetPathRoot(GetComputedPath(@this, rootPath));
        }

        public static string GetComputedFile(this CodeGenerationFileOptionsElement @this, string rootPath)
        {
            if (string.IsNullOrEmpty(rootPath))
                rootPath = Environment.CurrentDirectory;

            if (!Path.IsPathRooted(rootPath))
                rootPath = Path.Combine(Environment.CurrentDirectory, rootPath);

            string fullPath = Path.Combine(Path.GetDirectoryName(rootPath), @this.Filename);

            // replace the pattern "\.\" with just "\", as in "C:\Files\.\Another.cs"
            fullPath = fullPath.Replace("\\.\\", "\\");

            return fullPath;
        }

        public static CodeGenerationFileOptionsElement GetOutputOptions(this CodeGenerationElement @this, CodeGenerationFileType fileType)
        {
            var options = @this.Files.FirstOrDefault(f => f.FileType == fileType);
            var path = GetOutputPath(@this);

            return options ?? new CodeGenerationFileOptionsElement() { FileType = fileType, Filename = GetOutputFile(@this), Strategy = CodeGenerationFileStrategy.SingleFile };
        }

        public static CodeGenerationLanguage GetLanguage(this CodeGenerationElement @this)
        {
            if (@this.Language.HasValue)
                return @this.Language.Value;

            string language = Arguments.GetArgument("language", "l");

            if (!string.IsNullOrEmpty(language))
            {
                switch (language.ToLower())
                {
                    case "c#":
                    case "cs":
                    case "csharp":
                        return CodeGenerationLanguage.CSharp;
                    case "vb":
                    case "visualbasic":
                        return CodeGenerationLanguage.VisualBasic;
                    case "f#":
                    case "fs":
                    case "fsharp":
                        return CodeGenerationLanguage.FSharp;
                    case "ts":
                    case "typescript":
                        return CodeGenerationLanguage.TypeScript;
                }
            }

            return CodeGenerationLanguage.CSharp;
        }

        public static string GetOutputPath(this CodeGenerationElement @this)
        {
            string output = Arguments.GetArgument("out", "o");
            string path = @this.Path;

            if (string.IsNullOrEmpty(output))
            {
                if (string.IsNullOrEmpty(path))
                {
                    return Environment.CurrentDirectory;
                }
                else
                {
                    if (Path.IsPathRooted(path))
                        return Path.GetFullPath(path);
                    else
                        return Path.Combine(Environment.CurrentDirectory, path);
                }
            }
            else
            {
                if (string.IsNullOrEmpty(path))
                {
                    return Path.Combine(Environment.CurrentDirectory, output);
                }
                else
                {
                    var combinedPath = Path.Combine(path, output);

                    if (Path.IsPathRooted(combinedPath))
                        return combinedPath;
                    else
                        return Path.Combine(Environment.CurrentDirectory, combinedPath);
                }
            }
        }

        public static string GetOutputFile(this CodeGenerationElement @this)
        {
            string output = GetOutputPath(@this);

            if (string.IsNullOrEmpty(output))
            {
                return "Xrm.cs";
            }
            else
            {
                return Path.GetFileName(output);
            }
        }

        public static CodeGenerationBehaviorElement GetBehavior(this CodeGenerationBehaviorsCollection @this, string name)
        {
            return @this.FirstOrDefault(b => b.Name == name);
        }

        public static bool HasBehavior(this CodeGenerationBehaviorsCollection @this, string name)
        {
            return @this.Count(b => b.Name == name && b.IsEnabled) > 0;
        }
    }
}
