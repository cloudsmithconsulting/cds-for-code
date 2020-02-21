using System;
using System.CodeDom;
using System.Collections.Generic;
using System.Linq;
using CloudSmith.Cds.CrmSvcUtil.Cache;
using CloudSmith.Cds.CrmSvcUtil.Configuration;
using CloudSmith.Cds.CrmSvcUtil.Configuration.Generation;
using Microsoft.Crm.Services.Utility;
using Microsoft.Xrm.Sdk.Metadata;

namespace CloudSmith.Cds.CrmSvcUtil.Generation
{
    public sealed class OptionSetEnumCustomizationService : BaseCustomizationService
    {
        public OptionSetEnumCustomizationService(BaseCustomizationService service) : base(service) { }
        public OptionSetEnumCustomizationService() : this(ServiceExtensionsConfigurationSection.Create()) { }
        public OptionSetEnumCustomizationService(IServiceExtensionsConfiguration configuration) : base(configuration) { }

        private static IServiceProvider serviceProvider;

        /// <summary>
        /// Remove the unnecessary classes that we generated for entities. 
        /// </summary>
        public override void CustomizeCodeDom(CodeCompileUnit codeUnit, IServiceProvider services)
        {
            if (serviceProvider == null)
            {
                serviceProvider = services;
            }

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
                                var codeProperty = member as CodeMemberProperty;
                                var attributeMetadata = entity.Attributes.FirstOrDefault(a => a.GeneratedTypeName == member.Name);

                                if (attributeMetadata != null 
                                    && member.Name.ToLower() != "statecode" 
                                    && codeProperty.Type.BaseType == "Microsoft.Xrm.Sdk.OptionSetValue")
                                {
                                    TransformOptionSets(codeProperty, entity, attributeMetadata);
                                }
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

        private static void TransformOptionSets(CodeMemberProperty member, EntityCacheItem entity, AttributeCacheItem attribute)
        {
            AttributeMetadata attributeMetadata = attribute.Metadata;

            if (entity != null && attributeMetadata != null)
            {
                if (attributeMetadata is EnumAttributeMetadata)
                {
                    string typeName;
                    EnumAttributeMetadata enumMetadata = attributeMetadata as EnumAttributeMetadata;
                    OptionSetCacheItem optionSet = DynamicsMetadataCache.OptionSets.GetBy(entity.LogicalName, enumMetadata.OptionSet.Name);

                    if (optionSet == null)
                    {
                        optionSet = DynamicsMetadataCache.OptionSets.GetBy("*", enumMetadata.OptionSet.Name);
                    }

                    if (optionSet != null)
                    {
                        typeName = optionSet.GeneratedTypeName;
                    }
                    else 
                    {
                        var namingService = (INamingService)serviceProvider.GetService(typeof(INamingService));

                        typeName = namingService.GetNameForOptionSet(entity.Metadata, enumMetadata.OptionSet, serviceProvider);
                    }

                    FixEnums(member, enumMetadata, typeName);
                }
                else
                {
                    member.Type = new CodeTypeReference("int?");
                }
            }
        }

        private static void FixEnums(CodeMemberProperty codeProperty, EnumAttributeMetadata listAttribute, string typeName)
        {
            //TODO: refator this method to also work in VB or F#
            codeProperty.Type = new CodeTypeReference(typeName.EndsWith("?") ? typeName : typeName + "?");

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
                        typeName, listAttribute.LogicalName)
                    ));
            }
        }
    }
}
