using System;
using System.CodeDom;
using System.Reflection;

namespace CloudSmith.Dynamics365.CrmSvcUtil.Generation
{
    public static class CodeTypeDeclarationExtensions
    {
        public static CodeNamespace Using(this CodeNamespace @this, params string[] usings)
        {
            foreach (var @using in usings)
            {
                var hasUsing = @this.HasUsing(@using);

                if (!hasUsing)
                    @this.Imports.Add(new CodeNamespaceImport(@using));
            }

            return @this;
        }

        public static CodeTypeReferenceCollection ResolveUsings(this CodeTypeReferenceCollection @this, params string[] usings)
        {
            foreach (CodeTypeReference reference in @this)
            {
                ResolveUsings(reference, usings);
            }

            return @this;
        }

        public static CodeAttributeDeclarationCollection ResolveUsings(this CodeAttributeDeclarationCollection @this, params string[] usings)
        {
            foreach (CodeTypeReference reference in @this)
            {
                ResolveUsings(reference, usings);
            }

            return @this;
        }

        public static CodeTypeReference ResolveUsings(this CodeTypeReference @this, params string[] usings)
        {
            foreach (var @using in usings)
            {
                if (@this.BaseType.StartsWith(@using))
                {
                    var newBaseType = @this.BaseType.Replace($"{@using}.", "");

                    if (newBaseType.IndexOf('.') < 0)
                        @this.BaseType = newBaseType;
                }
            }

            return @this;
        }

        public static bool HasUsing(this CodeNamespace @this, string @using)
        {
            for (var i = 0; i < @this.Imports.Count; i++)
            {
                var usings = @this.Imports[i];

                if (string.Compare(usings.Namespace, @using, StringComparison.InvariantCultureIgnoreCase) == 0)
                {
                    return true;
                }
            }

            return false;
        }

        public static bool HasBaseType(this CodeTypeDeclaration @this, string typeName)
        {
            for (var i = 0; i < @this.BaseTypes.Count; i++)
            {
                var baseType = @this.BaseTypes[i];

                if (string.Compare(baseType.BaseType, typeName, StringComparison.InvariantCultureIgnoreCase) == 0)
                {
                    return true;
                }
            }

            return false;
        }
    }
}
