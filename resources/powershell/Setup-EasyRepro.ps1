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
 Changes IE security zone policies to allow for EasyRepro to remember local server credentials.
#> 

<#
.SYNOPSIS 
    Automates IE configuration (run once).

.DESCRIPTION
    This script was created to quickly and easily allow you enable automatic authentication for trusted
	zones and add a CRM server to the trusted zone in IE.

.EXAMPLE
    .\Setup-EasyRepro `
		-Server "crmserver" 
    
.Notes
#>
Param
(
	[string] 
	[parameter(Mandatory = $true, HelpMessage = "Name of Dynamics 365 CE Server (FQDN or NetBIOS)")]
	$Server
)

# Setup IE's Trusted Sites zone to automatically login with current windows user creds (Intranet zone + Trusted sites zone)
Set-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Internet Settings\Zones\1" -Name "1A00" -Value "0"
Set-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Internet Settings\Zones\2" -Name "1A00" -Value "0"
Set-ItemProperty -Path "HKLM:\Software\Microsoft\Windows\CurrentVersion\Internet Settings\Zones\1" -Name "1A00" -Value "0"
Set-ItemProperty -Path "HKLM:\Software\Microsoft\Windows\CurrentVersion\Internet Settings\Zones\2" -Name "1A00" -Value "0"

# Disable protected mode for trusted sites + intranet
Set-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Internet Settings\Zones\1" -Name "2500" -Value "3"
Set-ItemProperty -Path "HKCU:\Software\Microsoft\Windows\CurrentVersion\Internet Settings\Zones\2" -Name "2500" -Value "3"

# Add site to trusted sites zone.
Set-Location "HKCU:\Software\Microsoft\Windows\CurrentVersion\Internet Settings\ZoneMap\Domains"

# Create a new folder with the website name
New-Item $Server/ -Force # website part without http/s
Set-Location $Server/
New-ItemProperty . -Name https -Value 2 -Type DWORD -Force
New-ItemProperty . -Name http -Value 2 -Type DWORD -Force