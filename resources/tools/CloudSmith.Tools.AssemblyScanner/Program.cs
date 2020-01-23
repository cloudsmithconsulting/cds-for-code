using System;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace AssemblyScanner
{
    public class AssemblyInfo
    {
        public string FullName { get; set; }
        public string PublicKeyToken { get; set; }
        public string Name { get; set; }
        public string Location { get; set; }
        public string ImageRuntimeVersion { get; set; }
        public bool GlobalAssemblyCache { get; set; }
        public Version Version { get; set; }
        public string Title { get; set; }
        public string Configuration { get; set; }
        public string Description { get; set; }
        public string Company { get; set; }
        public string Product { get; set; }
        public string Copyright { get; set; }
        public string Trademark { get; set; }
        public string DelaySign { get; set; }
        public string KeyName { get; set; }
        public string ClsCompliant { get; set; }
        public string ComVisible { get; set; }
        public string IsJITTrackingEnabled { get; set; }
        public string IsJITOptimizerDisabled { get; set; }
        public string DebuggingFlags { get; set; }
        public string CompilationRelaxations { get; set; }
        public string WrapNonExceptionThrows { get; set; }
        public TypeInfo[] Types { get; set; }
    }

    public class Error
    {
        public string Message { get; set; }
        public int Code { get; set; }
    }

    public class TypeInfo
    {
        public string Name { get; set; }
        public string BaseType { get; set; }
        public string[] Interfaces { get; set; }
    }

    static class Program
    {
        static string Error(int code, string message)
        {
            string json = JsonSerializer.Serialize(new Error() { Code = code, Message = message });

            return json;
        }

        static void Main(string[] args)
        {
            if (args.Length == 0)
            {
                Console.WriteLine(Error(100, "No command line parameters present"));

                return;
            }

            var file = args[0];

            if (!File.Exists(file))
            {
                Console.WriteLine(Error(200, $"File {file} could not be found."));
                
                return;
            }
            
            var assembly = Assembly.LoadFrom(Path.GetFullPath(file));
            {
                var returnObject = new AssemblyInfo()
                {
                    FullName = assembly.FullName.ToString(),
                    PublicKeyToken = assembly.FullName.Substring(assembly.FullName.IndexOf("PublicKeyToken="))?.Replace("PublicKeyToken=", ""),
                    Name = assembly.ManifestModule?.Name,
                    Location = assembly.Location,
                    ImageRuntimeVersion = assembly.ImageRuntimeVersion,
                    GlobalAssemblyCache = assembly.GlobalAssemblyCache,
                    Version = assembly.GetName().Version,
                    Title = assembly.GetCustomProperty("Title", "Title"),
                    Configuration = assembly.GetCustomProperty("Configuration", "Configuration"),
                    Description = assembly.GetCustomProperty("Description", "Description"),
                    Company = assembly.GetCustomProperty("Company", "Company"),
                    Product = assembly.GetCustomProperty("Product", "Product"),
                    Copyright = assembly.GetCustomProperty("Copyright", "Copyright"),
                    Trademark = assembly.GetCustomProperty("Trademark", "Trademark"),
                    DelaySign = assembly.GetCustomProperty("DelaySign", "DelaySign"),
                    KeyName = assembly.GetCustomProperty("KeyName", "KeyName"),
                    ClsCompliant = assembly.GetCustomProperty("ClsCompliant", "IsCompliant"),
                    ComVisible = assembly.GetCustomProperty("ComVisible", "Value"),
                    IsJITTrackingEnabled = assembly.GetCustomProperty("System.Diagnostics.DebuggableAttribute", "IsJITTrackingEnabled"),
                    IsJITOptimizerDisabled = assembly.GetCustomProperty("System.Diagnostics.DebuggableAttribute", "IsJITOptimizerDisabled"),
                    DebuggingFlags = assembly.GetCustomProperty("System.Diagnostics.DebuggableAttribute", "DebuggingFlags"),
                    CompilationRelaxations = assembly.GetCustomProperty("CompilationRelaxations", "CompilationRelaxations"),
                    WrapNonExceptionThrows = assembly.GetCustomProperty("System.Runtime.CompilerServices.RuntimeCompatibilityAttribute", "WrapNonExceptionThrows"),
                    Types = assembly.GetExportedTypes()
                        .Select(t => new TypeInfo()
                        {
                            Name = t.FullName,
                            BaseType = t.BaseType.Name,
                            Interfaces = t.GetInterfaces().Select(i => i.FullName).ToArray()
                        }).ToArray()
                };

                string json = JsonSerializer.Serialize(returnObject);
                Console.WriteLine(json);
            }
        }

        private static string GetCustomProperty(this Assembly assembly, string typeName, string property)
        {
            foreach (var attribute in assembly.GetCustomAttributes(false))
            {
                if (attribute.GetType().ToString().Contains(typeName))
                {
                    if (!string.IsNullOrEmpty(property))
                    {
                        try
                        {
                            return attribute.GetType().GetProperty(property).GetValue(attribute).ToString();
                        }
                        catch (Exception)
                        {
                            return null;
                        }
                    } 
                    else
                    {
                        return attribute.ToString();
                    }
                }
            }

            return null;
        }
    }
}
