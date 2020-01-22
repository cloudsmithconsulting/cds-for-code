using System;
using System.CodeDom;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace CloudSmith.Dynamics365.CrmSvcUtil.Generation
{
    public class CodeVisitor
    {
        public CodeVisitor(CodeCompileUnit unit) { Unit = unit; }

        protected CodeCompileUnit Unit { get; }
        protected Action<CodeNamespace> VisitNamespace { get; private set; }
        protected Action<CodeNamespaceImport> VisitUsing { get; private set; }
        protected Action<CodeTypeDeclaration> VisitClass { get; private set; }
        protected Action<CodeTypeDeclaration> VisitInterface { get; private set; }
        protected Action<CodeTypeDeclaration> VisitEnum { get; private set; }
        protected Action<CodeTypeDeclaration> VisitStruct { get; private set; }
        protected Action<CodeTypeDeclaration, CodeAttributeDeclaration> VisitAttribute { get; private set; }
        protected Action<CodeTypeDeclaration, CodeTypeParameter> VisitTypeParameter { get; private set; }
        protected Action<CodeTypeDeclaration, CodeTypeMember> VisitMember { get; private set; }
        protected Action<CodeTypeMember, CodeAttributeDeclaration> VisitMemberAttribute { get; private set; }
        protected Action<CodeTypeMember, CodeTypeParameter> VisitMemberTypeParameter { get; private set; }
        protected Action<CodeTypeMember, CodeConstructor> VisitConstructor { get; private set; }
        protected Action<CodeTypeMember, CodeMemberField> VisitField { get; private set; }
        protected Action<CodeTypeMember, CodeMemberProperty> VisitProperty { get; private set; }
        protected Action<CodeTypeMember, CodeMemberMethod> VisitMethod { get; private set; }

        public CodeVisitor Namespace(Action<CodeNamespace> action)
        {
            VisitNamespace = action;

            return this;
        }
        public CodeVisitor Using(Action<CodeNamespaceImport> action)
        {
            VisitUsing = action;

            return this;
        }
        public CodeVisitor Class(Action<CodeTypeDeclaration> action)
        {
            VisitClass = action;

            return this;
        }
        public CodeVisitor Interface(Action<CodeTypeDeclaration> action)
        {
            VisitInterface = action;

            return this;
        }
        public CodeVisitor Enum(Action<CodeTypeDeclaration> action)
        {
            VisitEnum = action;

            return this;
        }
        public CodeVisitor Struct(Action<CodeTypeDeclaration> action)
        {
            VisitStruct = action;

            return this;
        }
        public CodeVisitor Attribute(Action<CodeTypeDeclaration, CodeAttributeDeclaration> action)
        {
            VisitAttribute = action;

            return this;
        }
        public CodeVisitor TypeParameter(Action<CodeTypeDeclaration, CodeTypeParameter> action)
        {
            VisitTypeParameter = action;

            return this;
        }
        public CodeVisitor Member(Action<CodeTypeDeclaration, CodeTypeMember> action)
        {
            VisitMember = action;

            return this;
        }
        public CodeVisitor MemberAttribute(Action<CodeTypeMember, CodeAttributeDeclaration> action)
        {
            VisitMemberAttribute = action;

            return this;
        }
        public CodeVisitor MemberTypeParameter(Action<CodeTypeMember, CodeTypeParameter> action)
        {
            VisitMemberTypeParameter = action;

            return this;
        }
        public CodeVisitor Constructor(Action<CodeTypeMember, CodeConstructor> action)
        {
            VisitConstructor = action;

            return this;
        }
        public CodeVisitor Field(Action<CodeTypeMember, CodeMemberField> action)
        {
            VisitField = action;

            return this;
        }
        public CodeVisitor Property(Action<CodeTypeMember, CodeMemberProperty> action)
        {
            VisitProperty = action;

            return this;
        }
        public CodeVisitor Method(Action<CodeTypeMember, CodeMemberMethod> action)
        {
            VisitMethod = action;

            return this;
        }

        public CodeVisitor Visit()
        {
            foreach (CodeNamespace @namespace in Unit.Namespaces)
            {
                VisitNamespace?.Invoke(@namespace);

                foreach (CodeNamespaceImport import in @namespace.Imports)
                {
                    VisitUsing?.Invoke(import);
                }

                foreach (CodeTypeDeclaration type in @namespace.Types)
                {
                    if (type.IsClass)
                        VisitClass?.Invoke(type);

                    if (type.IsEnum)
                        VisitEnum?.Invoke(type);

                    if (type.IsStruct)
                        VisitStruct?.Invoke(type);

                    if (type.IsInterface)
                        VisitInterface?.Invoke(type);

                    if (type.CustomAttributes?.Count > 0)
                    {
                        foreach (CodeAttributeDeclaration attribute in type.CustomAttributes)
                        {
                            VisitAttribute?.Invoke(type, attribute);
                        }
                    }

                    if (type.TypeParameters?.Count > 0)
                    {
                        foreach (CodeTypeParameter parameter in type.TypeParameters)
                        {
                            VisitTypeParameter?.Invoke(type, parameter);
                        }
                    }

                    if (type.Members?.Count > 0)
                    {
                        foreach (CodeTypeMember member in type.Members)
                        {
                            VisitMember?.Invoke(type, member);

                            foreach (CodeAttributeDeclaration attribute in member.CustomAttributes)
                            {
                                VisitMemberAttribute?.Invoke(member, attribute);
                            }

                            foreach (CodeTypeParameter parameter in type.TypeParameters)
                            {
                                VisitMemberTypeParameter?.Invoke(type, parameter);
                            }

                            var constructor = member as CodeConstructor;
                            var field = member as CodeMemberField;
                            var property = member as CodeMemberProperty;
                            var method = member as CodeMemberMethod;

                            if (constructor != null)
                                VisitConstructor?.Invoke(type, constructor);

                            if (field != null)
                                VisitField?.Invoke(type, field);

                            if (property != null)
                                VisitProperty?.Invoke(type, property);

                            if (method != null)
                                VisitMethod?.Invoke(type, method);
                        }
                    }
                }
            }

            return this;
        }
    }
}
