<# PSScriptInfo
.VERSION 0.8.11
.GUID e009159d-97e2-492a-a289-42426518dd41
.AUTHOR CloudSmith Consulting LLC
.COMPANYNAME CloudSmith Consulting LLC
.COPYRIGHT (c) 2020 CloudSmith Consulting LLC.  All Rights Reserved.
.TAGS Windows PowerShell Development Dev Dynamics CRM OnPremises DevOps
.LICENSEURI https://github.com/cloudsmithconsulting/Cds-For-Code/blob/master/LICENSE
.PROJECTURI https://github.com/cloudsmithconsulting/Cds-For-Code
.ICONURI 
.EXTERNALMODULEDEPENDENCIES Microsoft.CrmSdk.CoreAssemblies
.REQUIREDSCRIPTS 
.EXTERNALSCRIPTDEPENDENCIES 
.RELEASENOTES 1.0 Sample for PowerShell driven Dynamics CRM development loop.
#>

<# 
.DESCRIPTION 
 Generates entities into a folder using CrmSvcUtil.
#> 

<#
.SYNOPSIS 
    Automates generation of strongly typed entities.  

.DESCRIPTION
    This script is to be used after changes have been made to a solution 
	in Dynamics 365 CE.  The output file is the result of running CrmSvcUtil.

.EXAMPLE
    .\Generate-XrmEntities `
		-Url "http://server/org/XRMServices/2011/Organization.svc" `
		-Username "user" `
		-Password "Password" `
		-Domain "Domain" `
		-Path "C:\dev\dynamics-solution\plugin" `
		-OutputFile "XrmEntities.cs"
		-ToolsPath "C:\deploy\tools\coretools" 
		# Optional line below.  
		-Namespace "MyNamespace"
		-ServiceContextName "XrmServiceContext"
		-GenerateActions
    
.Notes
#>
# Run this script *AFTER* the CRM SDK has been deployed.


Param
(
	[string] 
	[parameter(Mandatory = $true, ParameterSetName = "NoConnectionString", HelpMessage = "A url or path to the SDK endpoint to contact for metadata")]
	$Url,

	[string] 
	[parameter(Mandatory = $true, ParameterSetName = "NoConnectionString", HelpMessage = "Username to use when connecting to the server for authentication")]
	$Username,

	[Security.SecureString]
	[parameter(Mandatory = $true, ParameterSetName = "NoConnectionString", HelpMessage = "Password to use when connecting to the server for authentication")]
	$Password,

	[string] 
	[parameter(Mandatory = $false, ParameterSetName = "NoConnectionString", HelpMessage = " Domain to authenticate against when connecting to the server")]
	$Domain = "",

	[string] 
	[parameter(Mandatory = $true, ParameterSetName = "ConnectionString", HelpMessage = "Connection string to use to connect to the server")]
	$ConnectionString,

	[switch]
	[parameter(Mandatory = $true, ParameterSetName = "Interactive", HelpMessage = "If supplied, will instruct CrmSvcUtil to prompt for login information.")]
	$Interactive = $Null,

	[string]
	[parameter(Mandatory = $true, HelpMessage = "The path where the generated files will go.")]
	$Path,

	[string]
	[parameter(Mandatory = $true, HelpMessage = "The name of the file to output.")]
	$OutputFile = "XrmEntities.cs",

	[string]
	[parameter(Mandatory = $false, HelpMessage = "The namespace to use for code generation.")]
	$Namespace = "",

	[string] 
	[parameter(Mandatory = $true, HelpMessage = "Path to CrmSvcUtil.exe")]
	[ValidateScript({Test-Path $_})]
	$ToolsPath = "C:\Deploy\Tools\CoreTools",

	[string]
	[parameter(Mandatory = $false, HelpMessage = "The name of the service context to generate (if needed).")]
	$ServiceContextName = "",

	[switch]
	[parameter(HelpMessage = "If supplied, will instruct CrmSvcUtil to generate action requests.")]
	$GenerateActions = $Null
)

If (!(Test-Path -Path $Path))
{
    New-Item -Path $Path -ItemType Directory | Out-Null
}

$FullPath = (Join-Path -Path $Path -ChildPath $OutputFile)
$GenerateActionsString = " "

if ($Domain -ne "")
{
	$Domain = "/domain:$Domain "
}

if ($ServiceContextName -ne "")
{
	$ServiceContextName = "/serviceContextName:$ServiceContextName "
}

if ($Namespace -ne "")
{
	$Namespace = "/namespace:$Namespace "
}

if ($GenerateActions)
{
	$GenerateActionsString = "/generateActions "
}

$CrmSvcUtil = (Join-Path $ToolsPath -ChildPath "CrmSvcUtil.exe")

if ($Interactive) {
	$Arguments = "/nologo /url:'$Url' /interactivelogin $Namespace$ServiceContextName$GenerateActionsString/out:$FullPath"
} else {
	if ($ConnectionString -eq "") {
		$UnsecurePassword = ConvertFrom-SecureString $Password -AsPlainText

		$Arguments = "/nologo /url:'$Url' /username:$Username /password:$UnsecurePassword $Domain$Namespace$ServiceContextName$GenerateActionsString/out:$FullPath"
	} else {
		$Arguments = "/nologo /url:'$Url' /connectionstring:'$ConnectionString' $Namespace$ServiceContextName$GenerateActionsString/out:$FullPath"
	}
}

Invoke-Expression "& `"$CrmSvcUtil`" $Arguments"