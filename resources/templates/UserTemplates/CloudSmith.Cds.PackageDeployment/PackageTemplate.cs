using System;
using System.Collections.Generic;
using System.ComponentModel.Composition;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Uii.Common.Entities;
using Microsoft.Xrm.Tooling.PackageDeployment;
using Microsoft.Xrm.Tooling.PackageDeployment.CrmPackageExtentionBase;

/// <summary>
/// This is a template directly generated using the Microsoft Dynamics CRM SDK Templates from here:
/// https://marketplace.visualstudio.com/items?itemName=DynamicsCRMPG.MicrosoftDynamicsCRMSDKTemplates
/// You can read more about creating package deployments here:
/// https://docs.microsoft.com/en-us/dynamics365/customerengagement/on-premises/developer/create-packages-package-deployer
/// 
/// If you add items to the PkgFolder and you are not using Visual Studio and the properties window,
/// remember to edit the <%=$this.parameters.ShortName%>.csproj file to include the XML to copy files to the 
/// output directory of the executable.
/// 
/// This is the class for entering custom code to be executed during package deployment
/// </summary>
namespace <%=$this.parameters.ShortName%>
{
    /// <summary>
    /// Import package starter frame. 
    /// </summary>
    [Export(typeof(IImportExtensions))]
    public class PackageTemplate : ImportExtension
    {
        /// <summary>
        /// Called When the package is initialized. 
        /// </summary>
        public override void InitializeCustomExtension()
        {
            // Log runtime settings
            if (RuntimeSettings != null)
            {
                PackageLog.Log($"Runtime settings populated, count = {RuntimeSettings.Count}");

                foreach (var setting in RuntimeSettings)
                {
                    PackageLog.Log($"Key = {setting.Key} | Value = {setting.Value}");
                }

                // This lets the administrator use the command line or the Import-CrmPackage 
                // cmdlet to specify whether to skip the safety checks while running the Package 
                // Deployer tool to import the package.
                // More information: https://docs.microsoft.com/en-us/previous-versions/dynamicscrm-2016/administering-dynamics-365/dn647420(v=crm.8)?redirectedfrom=MSDN
                if (RuntimeSettings.ContainsKey("SkipChecks"))
                {
                    bool skipChecks = false;
                    if (bool.TryParse((string)RuntimeSettings["SkipChecks"], out skipChecks))
                    {
                        OverrideDataImportSafetyChecks = true;
                    }
                }
            }
            else
            {
                PackageLog.Log("Runtime settings NOT populated");
            }
        }

        /// <summary>
        /// Called Before Import Completes. 
        /// </summary>
        /// <returns></returns>
        public override bool BeforeImportStage()
        {
            return true; // do nothing here. 
        }

        /// <summary>
        /// Called for each UII record imported into the system
        /// This is UII Specific and is not generally used by Package Developers
        /// </summary>
        /// <param name="app">App Record</param>
        /// <returns></returns>
        public override ApplicationRecord BeforeApplicationRecordImport(ApplicationRecord app)
        {
            return app;  // do nothing here. 
        }

        /// <summary>
        /// Called during a solution upgrade while both solutions are present in the target CRM instance. 
        /// This function can be used to provide a means to do data transformation or upgrade while a solution update is occurring. 
        /// </summary>
        /// <param name="solutionName">Name of the solution</param>
        /// <param name="oldVersion">version number of the old solution</param>
        /// <param name="newVersion">Version number of the new solution</param>
        /// <param name="oldSolutionId">Solution ID of the old solution</param>
        /// <param name="newSolutionId">Solution ID of the new solution</param>
        public override void RunSolutionUpgradeMigrationStep(string solutionName, string oldVersion, string newVersion, Guid oldSolutionId, Guid newSolutionId)
        {

            base.RunSolutionUpgradeMigrationStep(solutionName, oldVersion, newVersion, oldSolutionId, newSolutionId);
        }

        /// <summary>
        /// Called after Import completes. 
        /// </summary>
        /// <returns></returns>
        public override bool AfterPrimaryImport()
        {
            return true; // Do nothing here/ 
        }

        #region Properties

        /// <summary>
        /// Name of the Import Package to Use
        /// </summary>
        /// <param name="plural">if true, return plural version</param>
        /// <returns></returns>
        public override string GetNameOfImport(bool plural)
        {
            return "<%=$this.parameters.ShortName%>";
        }

        /// <summary>
        /// Folder Name for the Package data. 
        /// </summary>
        public override string GetImportPackageDataFolderName
        {
            get
            {
                // WARNING this value directly correlates to the folder name in the Solution Explorer where the ImportConfig.xml and sub content is located. 
                // Changing this name requires that you also change the correlating name in the Solution Explorer 
                return "PkgFolder";
            }
        }

        /// <summary>
        /// Description of the package, used in the package selection UI
        /// </summary>
        public override string GetImportPackageDescriptionText
        {
            get { return "<%=$this.parameters.Description%>"; }
        }

        /// <summary>
        /// Long name of the Import Package. 
        /// </summary>
        public override string GetLongNameOfImport
        {
            get { return "<%=$this.parameters.LongName%>"; }
        }


        #endregion

    }
}
