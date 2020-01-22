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
    public sealed class AttributeConstantsCustomizationService : BaseCustomizationService
    {
        public AttributeConstantsCustomizationService(BaseCustomizationService service) : base(service) { }
        public AttributeConstantsCustomizationService() : this(ServiceExtensionsConfigurationSection.Create()) { }
        public AttributeConstantsCustomizationService(IServiceExtensionsConfiguration configuration) : base(configuration) { }

        /// <summary>
        /// Remove the unnecessary classes that we generated for entities. 
        /// </summary>
        public override void CustomizeCodeDom(CodeCompileUnit codeUnit, IServiceProvider services)
        {
            var attributeConstantsConfig = Configuration.CodeGeneration.Files.FirstOrDefault(f => f.FileType == CodeGenerationFileType.AttributeConstants);

            if (attributeConstantsConfig != null)
            {
                var declarations = new List<CodeTypeDeclaration>();

                foreach (var entitySchema in DynamicsMetadataCache.Entities.Select(e => e.Value))
                {
                    var attributeStruct = new CodeTypeDeclaration(entitySchema.GeneratedTypeName + "Attributes")
                    {
                        IsStruct = true
                    };

                    foreach (var attributeName in entitySchema.Attributes)
                    {
                        attributeStruct.Members.Add(new CodeMemberField()
                        {
                            Type = new CodeTypeReference(typeof(string)),
                            Name = attributeName.GeneratedTypeName,
                            Attributes = MemberAttributes.Const | MemberAttributes.Public,
                            InitExpression = new CodePrimitiveExpression(attributeName.Metadata.LogicalName)
                        });
                    }

                    declarations.Add(attributeStruct);
                }

                codeUnit.Namespaces[0].Types.AddRange(declarations.ToArray());
            }
        }
    }
}
