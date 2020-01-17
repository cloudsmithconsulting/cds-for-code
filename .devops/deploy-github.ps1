$GithubPAT = "$(GithubPAT)"
$GithubRepoUri = "https://github.com/cloudsmithconsulting/cds-for-code.git"

# track all local branches
git branch -r | findstr /v "\->" | ForEach-Object { $br = $_.TrimStart(); git branch --track $br.Substring("origin/".Length) $br }

# parse off the protocol as we need to re-write this URL with the PAT
$GithubRepoUri = $GithubRepoUri.Substring(8)

# push all branches to vsts project
git remote add github "https://$GithubPAT@$GithubRepoUri"
git branch -r | findstr /v "\->" | ForEach-Object {
    $br = $_.TrimStart().Substring("origin/".Length)
    Write-Host "Pushing $br to GitHub"
    git push -u github $br
}

# don't forget the tags
git push github --tags

# clean up
git remote remove github