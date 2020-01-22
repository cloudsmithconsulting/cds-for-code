using System;
using System.CodeDom;
using CloudSmith.Dynamics365.CrmSvcUtil.Configuration;
using CloudSmith.Dynamics365.CrmSvcUtil.Generation;
using Microsoft.Crm.Services.Utility;

namespace CloudSmith.Dynamics365.CrmSvcUtil
{
    public sealed class CompositeCustomizationService : BaseCustomizationService
    {
        private ICustomizeCodeDomService[] _customizers;

        public CompositeCustomizationService() : this(ServiceExtensionsConfigurationSection.Create()) { }
        public CompositeCustomizationService(IServiceExtensionsConfiguration configuration) : base(configuration)
        {
            _customizers = new ICustomizeCodeDomService[] {
                new OptionSetEnumCustomizationService(this),
                new AttributeConstantsCustomizationService(this),
                new ImportResolverCustomizationService(this),
                new FileSplitCustomizationService(this)
            };
        }

        /// <summary>
        /// Remove the unnecessary classes that we generated for entities. 
        /// </summary>
        public override void CustomizeCodeDom(CodeCompileUnit codeUnit, IServiceProvider services)
        {
            foreach (var customizer in _customizers)
            {
                customizer.CustomizeCodeDom(codeUnit, services);
            }
        }

    }
}
