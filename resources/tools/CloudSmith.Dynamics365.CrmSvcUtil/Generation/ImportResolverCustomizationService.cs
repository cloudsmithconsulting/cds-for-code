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
    public sealed class ImportResolverCustomizationService : BaseCustomizationService
    {
        public ImportResolverCustomizationService(BaseCustomizationService service) : base(service) { }
        public ImportResolverCustomizationService() : this(ServiceExtensionsConfigurationSection.Create()) { }
        public ImportResolverCustomizationService(IServiceExtensionsConfiguration configuration) : base(configuration) { }

        /// <summary>
        /// Remove the unnecessary classes that we generated for entities. 
        /// </summary>
        public override void CustomizeCodeDom(CodeCompileUnit codeUnit, IServiceProvider services)
        {
            if (!Configuration.CodeGeneration.Behaviors.HasBehavior("ImportNamespaces"))
                return;

            var usings = Configuration.CodeGeneration.Behaviors["ImportNamespaces"]?.Arguments?.Split(',');

            if (usings != null && usings.Length > 0)
            {
                var visitor = new CodeVisitor(codeUnit)
                    .Namespace(ns => ns.Using(usings))
                    .Attribute((type, attribute) => attribute.AttributeType.ResolveUsings(usings))
                    .Class(type => type.BaseTypes.ResolveUsings(usings))
                    .Enum(type => type.BaseTypes.ResolveUsings(usings))
                    .Struct(type => type.BaseTypes.ResolveUsings(usings))
                    .Interface(type => type.BaseTypes.ResolveUsings(usings))
                    .MemberAttribute((member, attribute) => attribute.AttributeType.ResolveUsings(usings))
                    .Field((type, field) => field.Type.ResolveUsings(usings))
                    .Property((type, property) => property.Type.ResolveUsings(usings));

                visitor.Visit();
            }
        }

    }
}
