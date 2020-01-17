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
 Installs the Dynamics 365 CE SDK using NuGet.
#> 

<#
.SYNOPSIS 
    Automates download and unpack of NuGet packages related to the CRM SDK.

.DESCRIPTION
    This script was created to quickly and easily install the SDK on a computer.
	The output is a Tools folder that you can use with the remaining scripts in this library.

.EXAMPLE
    .\Install-Sdk `
		-Path "C:\deploy\tools" 
    
.Notes
#>
Param
(
	[string] 
	[parameter(Mandatory = $true, HelpMessage = "Location where unpacked SDK will go")]
	$Path
)

New-Item -ItemType Directory -Path $Path -Force | Out-Null

$sourceNugetExe = "https://dist.nuget.org/win-x86-commandline/latest/nuget.exe"
$targetNugetExe = ".\nuget.exe"
Remove-Item $Path -Force -Recurse -ErrorAction Ignore
Invoke-WebRequest $sourceNugetExe -OutFile $targetNugetExe
Set-Alias nuget $targetNugetExe -Scope Global -Verbose

##
##Download Plugin Registration Tool
##
./nuget install Microsoft.CrmSdk.XrmTooling.PluginRegistrationTool -O $Path
$prtDestPath = Join-Path -Path $Path -ChildPath "PluginRegistration"
md $prtDestPath
$prtToolsFolder = Get-ChildItem $Path | Where-Object {$_.Name -match 'Microsoft.CrmSdk.XrmTooling.PluginRegistrationTool.'}
$prtToolsGlob = "$Path\$prtToolsFolder\tools\*.*"
move $prtToolsGlob $prtDestPath
$prtRootFolder = "$Path\$prtToolsFolder"
Remove-Item $prtRootFolder -Force -Recurse

##
##Download CoreTools
##
./nuget install  Microsoft.CrmSdk.CoreTools -O $Path
$coreDestPath = Join-Path -Path $Path -ChildPath "CoreTools"
md $coreDestPath
$coreToolsFolder = Get-ChildItem $Path | Where-Object {$_.Name -match 'Microsoft.CrmSdk.CoreTools.'}
$coreToolsGlob = "$Path\$coreToolsFolder\content\bin\coretools\*.*"
move $coreToolsGlob $coreDestPath
$coreToolsRootFolder = "$Path\$coreToolsFolder"
Remove-Item $coreToolsRootFolder -Force -Recurse

##
##Download Configuration Migration
##
./nuget install  Microsoft.CrmSdk.XrmTooling.ConfigurationMigration.Wpf -O $Path
$configMigPath = Join-Path -Path $Path -ChildPath "ConfigurationMigration"
md $configMigPath
$configMigFolder = Get-ChildItem $Path | Where-Object {$_.Name -match 'Microsoft.CrmSdk.XrmTooling.ConfigurationMigration.Wpf.'}
$configMigGlob = "$Path\$configMigFolder\tools\*.*"
move $configMigGlob $configMigPath
$configMigRootFolder = "$Path\$configMigFolder"
Remove-Item $configMigRootFolder -Force -Recurse

##
##Download Package Deployer 
##
./nuget install  Microsoft.CrmSdk.XrmTooling.PackageDeployment.WPF -O $Path
$pdPath = Join-Path -Path $Path -ChildPath "PackageDeployment"
md $pdPath
$pdFolder = Get-ChildItem $Path | Where-Object {$_.Name -match 'Microsoft.CrmSdk.XrmTooling.PackageDeployment.Wpf.'}
$pdGlob = "$Path\$pdFolder\tools\*.*"
move $pdGlob $pdPath
$pdRootFolder = "$Path\$pdFolder"
Remove-Item $pdRootFolder -Force -Recurse

##
##Download Package Deployer PowerShell module
##
./nuget install Microsoft.CrmSdk.XrmTooling.PackageDeployment.PowerShell -O $Path
$pdPoshPath = Join-Path -Path $Path -ChildPath "PackageDeployment.PowerShell"
$pdPoshFolder = Get-ChildItem $Path | Where-Object {$_.Name -match 'Microsoft.CrmSdk.XrmTooling.PackageDeployment.PowerShell.'}
$pdPoshGlob = "$Path\$pdPoshFolder\tools\*.*"
move $pdPoshGlob $pdPoshPath
$pdPoshRootFolder = "$Path\$pdPoshFolder"
Remove-Item $pdPoshRootFolder -Force -Recurse



##
##Remove NuGet.exe
##
Remove-Item nuget.exe 