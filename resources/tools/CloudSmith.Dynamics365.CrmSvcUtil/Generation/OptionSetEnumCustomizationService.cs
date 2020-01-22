using System;
using System.CodeDom;
using System.Collections.Generic;
using System.Linq;
using CloudSmith.Dynamics365.CrmSvcUtil.Cache;
using CloudSmith.Dynamics365.CrmSvcUtil.Configuration;
using CloudSmith.Dynamics365.CrmSvcUtil.Configuration.Generation;
using Microsoft.Xrm.Sdk.Metadata;

namespace CloudSmith.Dynamics365.CrmSvcUtil.Generation
{
    public sealed class OptionSetEnumCustomizationService : BaseCustomizationService
    {
        public OptionSetEnumCustomizationService(BaseCustomizationService service) : base(service) { }
        public OptionSetEnumCustomizationService() : this(ServiceExtensionsConfigurationSection.Create()) { }
        public OptionSetEnumCustomizationService(IServiceExtensionsConfiguration configuration) : base(configuration) { }

        /// <summary>
        /// Remove the unnecessary classes that we generated for entities. 
        /// </summary>
        public override void CustomizeCodeDom(CodeCompileUnit codeUnit, IServiceProvider services)
        {
            if (!Configuration.CodeGeneration.Behaviors.HasBehavior("TranslateOptionSetsAsEnums"))
                return;

            var optionSets = new Dictionary<string, List<CodeTypeDeclaration>>();

            for (var i = 0; i < codeUnit.Namespaces.Count; ++i)
            {
                var types = codeUnit.Namespaces[i].Types;

                // Export the classes first so that we know what optionsets we need
                for (var j = 0; j < types.Count; j++)
                {
                    var type = types[j];

                    if (type.IsClass)
                    {
                        var entity = GetSchemaEntity(type.Name);
                        if (entity == null) continue;

                        foreach (CodeTypeMember member in type.Members)
                        {
                            if (member is CodeMemberProperty)
                            {
                                var attributeMetadata = entity.Attributes.FirstOrDefault(a => a.GeneratedTypeName == member.Name);

                                TransformOptionSets(member, entity, attributeMetadata);
                            }
                        }
                    }
                }
            }
        }

        private static EntityCacheItem GetSchemaEntity(string name)
        {
            return DynamicsMetadataCache.Entities.FirstOrDefault(e => e.Value?.GeneratedTypeName == name).Value;
        }

        private static void TransformOptionSets(CodeTypeMember member, EntityCacheItem entity, AttributeCacheItem attribute)
        {
            var codeProperty = (CodeMemberProperty)member;

            if (member.Name.ToLower() == "statecode" || codeProperty.Type.BaseType != "Microsoft.Xrm.Sdk.OptionSetValue") return;

            OptionSetCacheItem optionSet = null;
            AttributeMetadata attributeMetadata = attribute.Metadata;

            if (entity != null && attributeMetadata != null)
            {
                if (attributeMetadata is EnumAttributeMetadata)
                {
                    FixEnums(codeProperty, (EnumAttributeMetadata)attributeMetadata, optionSet);
                }
                else
                {
                    codeProperty.Type = new CodeTypeReference("int?");
                }
            }
        }

        private static void FixEnums(CodeMemberProperty codeProperty, EnumAttributeMetadata listAttribute, OptionSetCacheItem optionSet)
        {
            //TODO: refator this method to also work in VB or F#
            codeProperty.Type = new CodeTypeReference(optionSet.GeneratedTypeName + "?");
            if (codeProperty.HasSet)
            {
                if (codeProperty.SetStatements[1].GetType() == typeof(CodeConditionStatement))
                {
                    ((CodeConditionStatement)codeProperty.SetStatements[1]).FalseStatements[0] = new CodeSnippetStatement
                    {
                        Value =
                            string.Format(
                                "\t\t\t\tthis.SetAttributeValue(\"{0}\", (value.HasValue ? new Microsoft.Xrm.Sdk.OptionSetValue((int)value.Value) : null));",
                                listAttribute.LogicalName)
                    };
                }
                else
                {
                    codeProperty.SetStatements[1] =
                        new CodeSnippetStatement(
                            string.Format(
                                "\t\t\t\t\tthis.SetAttributeValue(\"{0}\", (value.HasValue ? new Microsoft.Xrm.Sdk.OptionSetValue((int)value.Value) : null));",
                                listAttribute.LogicalName));
                }
            }

            if (codeProperty.HasGet)
            {
                codeProperty.GetStatements.Clear();
                codeProperty.GetStatements.Add(new CodeSnippetExpression(
                    string.Format(
                        "var ret = this.GetAttributeValue<Microsoft.Xrm.Sdk.OptionSetValue>(\"{1}\");" + Environment.NewLine +
                        "\t\t\t\treturn (ret!=null ? ({0}?)ret.Value : ({0}?)null);",
                        optionSet.GeneratedTypeName, listAttribute.LogicalName)
                    ));
            }
        }
    }
}
