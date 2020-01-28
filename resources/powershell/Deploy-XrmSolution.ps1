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
	[parameter(Mandatory = $true, ParameterSetName = "NoSolutionFile", HelpMessage = "Dynamics 365 CE server URL (no org name)")]
	[ValidatePattern('http(s)?://[\w-]+(/[\w- ./?%&=]*)?')]
	$ServerUrl,

	[string] 
	[parameter(Mandatory = $true, ParameterSetName = "NoSolutionFile", HelpMessage = "Dynamics 365 CE organization name")]
	$OrgName,

	[System.Management.Automation.PSCredential]
	[Parameter(Mandatory=$false, ParameterSetName = "NoSolutionFile", HelpMessage = "Credentials of user for authentication.")]
    [ValidateNotNull()]
    [System.Management.Automation.Credential()]
	$Credential = $Null,

	[string]
	[parameter(Mandatory = $true, ParameterSetName = "SolutionFile", HelpMessage = "Name of the solution file to export")]
	$SolutionFile,

	[string]
	[parameter(Mandatory = $true, HelpMessage = "Name of the solution to deploy")]
	$SolutionName,

	[string]
	[parameter(Mandatory = $true, HelpMessage = "The path where solution files will be packed")]
	[ValidateScript({Test-Path $_})]
	$Path,

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

	[switch] 
	[parameter(HelpMessage = "Switch indicating if this should be deployed as a managed solution.")]
	$Managed
)

$RequireImport = ($SolutionFile -eq $null)

if ($SolutionFile -eq $null) 
{
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

	$SolutionFile = "$Folder\\$SolutionName.zip"	
}

$Arguments = "/action:pack /folder:$Path /zipfile:$SolutionFile /nologo" 

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

if ($RequireImport -eq $true) {
	Write-Host "Running import job on: $SolutionName`r";
	Import-CrmSolution -conn $Conn -SolutionFilePath "$Folder\$SolutionName.zip"

	Remove-Item $Folder -Force -Recurse
	Write-Host "`r" 
}