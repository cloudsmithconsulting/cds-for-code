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
.EXTERNALMODULEDEPENDENCIES Microsoft.Xrm.Data.PowerShell
.REQUIREDSCRIPTS 
.EXTERNALSCRIPTDEPENDENCIES 
.RELEASENOTES 1.0 Sample for PowerShell driven Dynamics CRM development loop.
#>

<# 
.DESCRIPTION 
 Packages a Dynamics 365 CE solution from a given path and deploys it to a server.
#> 

<#
.SYNOPSIS 
    Automates solution import, upload and pack tasks.

.DESCRIPTION
    This script is to be used when a developer wants to package a solution from a local
	path and deploy it to a Dynamics 365 CE organization.

.EXAMPLE
    .\Deploy-XrmSolution `
		-ServerUrl "http://servername" `
		-OrgName = "test" `
		-SolutionName "Test-Solution" `
		-Path "C:\dev\dynamics-solution" `
		-ToolsPath "C:\deploy\tools\coretools" `
		# Optional lines below.  If you do not supply credentials, you will be prompted for them.
		-Credential = New-Object System.Management.Automation.PSCredential (“username”, ( ConvertTo-SecureString “password” -AsPlainText -Force ) ) `
		-MapFile "C:\dev\dynamics-solution\mapping.xml" `
		-LogFile "C:\deploy\solutionpackager.log" `
		-IncludeResourceFiles `
		-Managed
    
.Notes
#>
##Download Microsoft.Xrm.Data.PowerShell and install it.
Param
(
	[string] 
	[parameter(Mandatory = $true, HelpMessage = "Dynamics 365 CE server URL (no org name)")]
	[ValidatePattern('http(s)?://[\w-]+(/[\w- ./?%&=]*)?')]
	$ServerUrl,

	[string] 
	[parameter(Mandatory = $true, HelpMessage = "Dynamics 365 CE organization name")]
	$OrgName,

	[string]
	[parameter(Mandatory = $true, HelpMessage = "Name of the solution to deploy")]
	$SolutionName,

	[string]
	[parameter(Mandatory = $true, HelpMessage = "The path where solution files will be packed")]
	[ValidateScript({Test-Path $_})]
	$Path,

    [System.Management.Automation.PSCredential]
	[Parameter(Mandatory=$false, HelpMessage = "Credentials of user for authentication.")]
    [ValidateNotNull()]
    [System.Management.Automation.Credential()]
	$Credential = $Null,

	[string] 
	[parameter(Mandatory = $true, HelpMessage = "Path to SolutionPackager.exe")]
	[ValidateScript({Test-Path $_})]
	$ToolsPath = "C:\Deploy\Tools\CoreTools",

	[string] 
	[parameter(Mandatory = $false, HelpMessage = "Mapping file to use when calling SolutionPackager")]
	[ValidateScript({Test-Path $_})]
	$MapFile = $Null,

	[string] 
	[parameter(Mandatory = $false, HelpMessage = "Log file for SolutionPackager output")]
	$LogFile = $Null,

	[switch] 
	[parameter(HelpMessage = "Switch indicating if SolutionPackager will extract or merge all string resources into .resx files.")]
	$IncludeResourceFiles,

	[string] 
	[parameter(Mandatory = $false, HelpMessage = "Path where temporary solution file will be deployed.  If specified, the solution file is kept in this path.")]
	[ValidateScript({Test-Path $_})]
	$SaveSolution = $Null,

	[switch] 
	[parameter(HelpMessage = "Switch indicating if this should be deployed as a managed solution.")]
	$Managed
)

# locals
[string] $ModuleName = "Microsoft.Xrm.Data.Powershell";
[string] $ModuleVersion = "2.7.2";

# ensure Microsoft.Xrm.Data.PowerShell dependency is installed and imported.
if (!(Get-Module -ListAvailable -Name $ModuleName ))  {
    Install-Module -Name $ModuleName -MinimumVersion $ModuleVersion -Force
}

Import-Module $ModuleName

# connect to on-prem
$Conn;

Write-Host "Connecting to $ServerUrl/$OrgName`r";

if ($Credential -ne $null) {
	$Conn = Connect-CrmOnPremDiscovery -Credential $Credential -ServerUrl $ServerUrl -OrganizationName $OrgName 
} else {
	$Conn = Connect-CrmOnPremDiscovery -ServerUrl $ServerUrl -OrganizationName $OrgName 
}

if (-not ([string]::IsNullOrEmpty($SaveSolution))) {
	$Folder = $SaveSolution
} else {
	$Folder = (Join-Path -Path $env:TEMP -ChildPath $SolutionName)
}

If (!(Test-Path -Path $Folder)) {
    New-Item -Path $Folder -ItemType Directory | Out-Null
}

$Arguments = "/action:pack /folder:$Path /zipfile:$Folder\$SolutionName.zip /nologo" 

if (-not ([string]::IsNullOrEmpty($MapFile))) {
	$Arguments += " /map:""$MapFile"""
}

if (-not ([string]::IsNullOrEmpty($LogFile))) {
	$Arguments += " /log:""$LogFile"""
}

if ($IncludeResourceFiles -eq $true) {
	$Arguments += " /localize"
}

if ($Managed -eq $true) {
	$Arguments += " /packagetype:managed"
}

Write-Host "Packing solution $SolutionName with arguments: $Arguments`r";

$SolutionPackagerExe = (Join-Path $ToolsPath -ChildPath "SolutionPackager.exe")
Invoke-Expression "& `"$SolutionPackagerExe`" $Arguments"

Write-Host "Running import job on: $SolutionName`r";

Import-CrmSolution -conn $Conn -SolutionFilePath "$Folder\$SolutionName.zip"

Remove-Item $Folder -Force -Recurse

Write-Host "`r" 