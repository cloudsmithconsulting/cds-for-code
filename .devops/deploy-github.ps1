$GithubRepoUri = "https://github.com/cloudsmithconsulting/cds-for-code.git"

# track all local branches
git branch -r | findstr /v "\->" | ForEach-Object { $br = $_.TrimStart(); git branch --track $br.Substring("origin/".Length) $br }

# push all branches to vsts project
Write-Host "Using GitHub connection at: $GithubRepoUri"
git remote add github "$GithubRepoUri"
git branch -r | findstr /v "\->" | ForEach-Object { 
    $br = $_.TrimStart().Substring("origin/".Length)
    Write-Host "Pushing $br to GitHub"
    
    & git pull origin $br --rebase
    & git push -u github $br 
}      

# don't forget the tags
git push github --tags

# clean up
git remote remove github