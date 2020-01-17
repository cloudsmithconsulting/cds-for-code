Write-Host "[INFO]: Waiting to start installations"
Start-Sleep -Seconds 20

Write-Host "[INFO]: Installing CRM SDK"
& C:\Deploy\install-sdk.ps1
Write-Host "[INFO]: Completed installing CRM SDK"

Write-Host "[INFO]: Installing VSCode extensions"
Get-Content C:\Deploy\vscode\vscode-extensions.txt | ForEach-Object {
	code --install-extension $_ --extensions-dir $ENV:UserProfile\.vscode\extensions --force 
}
Write-Host "[INFO]: Completed installing VSCode extensions"

Write-Host "[INFO]: Checking installation versions"
node --version
npm --version
git --version
Write-Host "[INFO]: Completed checking installation versions"

Write-Host "[INFO]: Cloning dotnet core MVC sample project"
New-Item -Path C:\dev\contoso-university -ItemType Directory
git clone https://github.com/cloudsmithconsulting/contoso-university.git C:\dev\contoso-university
Write-Host "[INFO]: Completed cloning dotnet core MVC sample project"

Write-Host "[INFO]: It is now ok to close this window"