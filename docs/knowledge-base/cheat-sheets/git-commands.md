---
title: 🔀 Git Commands
sidebar_label: Git
sidebar_position: 4
tags: [git, version-control, vcs, cheat-sheet]
---

# 🔀 Git Commands Cheat Sheet

## Git Basics

```bash
# Configuration
git config --global user.name "Name"
git config --global user.email "email@example.com"
git config --list                  # List configuration

# Initialize repository
git init                           # Initialize repo
git clone URL                      # Clone remote repo
git clone URL DIRECTORY            # Clone to specific directory

# Status and info
git status                         # Working tree status
git log                            # Commit history
git log --oneline                  # Compact log
git log --graph                    # Graph view
git log -n 5                       # Last 5 commits
git show COMMIT                    # Show commit details
```

## Working with Changes

```bash
# Add changes
git add FILE                       # Stage file
git add .                          # Stage all changes
git add -A                         # Stage all (including deletions)
git add -p                         # Interactive staging

# Commit changes
git commit -m "message"            # Commit with message
git commit -am "message"           # Stage and commit
git commit --amend                 # Amend last commit

# Remove and move
git rm FILE                        # Remove file
git rm --cached FILE               # Untrack file
git mv OLD NEW                     # Move/rename file

# Undo changes
git restore FILE                   # Discard changes (Git 2.23+)
git checkout -- FILE               # Discard changes (old)
git restore --staged FILE          # Unstage file
git reset HEAD FILE                # Unstage file (old)
git reset --hard HEAD              # Discard all changes
git revert COMMIT                  # Revert commit
```

## Branches

```bash
# List branches
git branch                         # Local branches
git branch -a                      # All branches
git branch -r                      # Remote branches

# Create branch
git branch BRANCH                  # Create branch
git checkout -b BRANCH             # Create and switch
git switch -c BRANCH               # Create and switch (Git 2.23+)

# Switch branches
git checkout BRANCH                # Switch branch
git switch BRANCH                  # Switch branch (Git 2.23+)

# Merge branches
git merge BRANCH                   # Merge branch into current

# Delete branch
git branch -d BRANCH               # Delete local branch
git branch -D BRANCH               # Force delete
git push origin --delete BRANCH    # Delete remote branch

# Rename branch
git branch -m OLD NEW              # Rename branch
```

## Remote Operations

```bash
# Remote repositories
git remote                         # List remotes
git remote -v                      # List with URLs
git remote add NAME URL            # Add remote
git remote remove NAME             # Remove remote
git remote rename OLD NEW          # Rename remote

# Fetch and pull
git fetch                          # Fetch from remote
git fetch origin                   # Fetch from origin
git pull                           # Fetch and merge
git pull origin main               # Pull specific branch

# Push
git push                           # Push to remote
git push origin main               # Push to specific branch
git push -u origin main            # Push and set upstream
git push --force                   # Force push (DANGEROUS!)
git push --tags                    # Push tags
```

## Tags

```bash
# List tags
git tag                            # List all tags
git tag -l "v1.*"                  # List matching tags

# Create tags
git tag TAG                        # Lightweight tag
git tag -a TAG -m "message"        # Annotated tag
git tag TAG COMMIT                 # Tag specific commit

# Push tags
git push origin TAG                # Push specific tag
git push --tags                    # Push all tags

# Delete tags
git tag -d TAG                     # Delete local tag
git push origin --delete TAG       # Delete remote tag
```

## Stash

```bash
# Stash changes
git stash                          # Stash changes
git stash save "message"           # Stash with message
git stash -u                       # Include untracked files

# List stashes
git stash list

# Apply stash
git stash apply                    # Apply latest stash
git stash apply stash@{1}          # Apply specific stash
git stash pop                      # Apply and remove stash

# Remove stash
git stash drop                     # Remove latest stash
git stash drop stash@{1}           # Remove specific stash
git stash clear                    # Remove all stashes
```
