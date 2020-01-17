<# PSScriptInfo
.VERSION 1.0.0
.GUID e009159d-97e2-492a-a289-42426518dd41
.AUTHOR CloudSmith Consulting LLC
.COMPANYNAME CloudSmith Consulting LLC
.COPYRIGHT (c) 2019 CloudSmith Consulting LLC.  All Rights Reserved.
.TAGS Windows PowerShell Development Dev Dynamics CRM OnPremises DevOps
.LICENSEURI https://github.com/cloudsmithconsulting/Dynamics365-VsCode-Samples/blob/master/LICENSE
.PROJECTURI https://github.com/cloudsmithconsulting/Dynamics365-VsCode-Samples
.ICONURI 
.EXTERNALMODULEDEPENDENCIES Microsoft.CrmSdk.CoreAssemblies
.REQUIREDSCRIPTS 
.EXTERNALSCRIPTDEPENDENCIES 
.RELEASENOTES 1.0 Sample for PowerShell driven Dynamics CRM development loop.
#>

<# 
.DESCRIPTION 
 Installs the XrmToolbox from GitHub.
#> 

<#
.SYNOPSIS 
    Automates download and unpack of XrmToolbox.

.DESCRIPTION
    This script was created to quickly and easily install the XrmToolbox on a computer.
	The output is a Tools folder that you can use with the remaining scripts in this library.

.EXAMPLE
    .\Install-Sdk `
		-Path "C:\deploy\tools\XrmToolbox" 
    
.Notes
#>
Param
(
	[string] 
	[parameter(Mandatory = $true, HelpMessage = "Location where unpacked SDK will go")]
	[ValidateScript({Test-Path $_})]
	$Path
)

#locals
[string] $source = "https://github.com/MscrmTools/XrmToolBox/releases/download/v1.2019.7.34/XrmToolbox.zip";
[string] $dest = (Join-Path $Path -Child "XrmToolbox.zip")

Invoke-WebRequest $source -OutFile $dest -TimeoutSec 180

Expand-Archive -LiteralPath $dest -DestinationPath (Join-Path $Path -ChildPath "XrmToolbox")

Remove-Item $dest