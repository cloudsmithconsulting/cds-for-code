using System;
using System.CodeDom;
using System.Diagnostics;
using CloudSmith.Dynamics365.CrmSvcUtil.Configuration;
using Microsoft.Crm.Services.Utility;

namespace CloudSmith.Dynamics365.CrmSvcUtil.Generation
{
    public abstract class BaseCustomizationService : ICustomizeCodeDomService
    {
        internal BaseCustomizationService(BaseCustomizationService service)
        {
            Configuration = service.Configuration;
        }

        protected BaseCustomizationService()
            : this(ServiceExtensionsConfigurationSection.Create())
        { }

        protected BaseCustomizationService(IServiceExtensionsConfiguration configuration)
            : base()
        {
            Configuration = configuration;
        }

        protected TraceSource Trace { get => new TraceSource(Constants.Diagnostics.TraceSource, SourceLevels.Information); }
        protected internal IServiceExtensionsConfiguration Configuration { get; }

        /// <summary>
        /// Remove the unnecessary classes that we generated for entities. 
        /// </summary>
        public abstract void CustomizeCodeDom(CodeCompileUnit codeUnit, IServiceProvider services);
    }
}
