---
title: "GitHub Basics for Designers"
date: 2024-05-07T00:28:21-04:00
draft: false
cover:
    image: "https://repository-images.githubusercontent.com/58559694/aeae5400-6102-11e9-980d-dc74185ed41d"
tags: ["code"]
mermaid: true
---

This will be a short tutorial about GitHub to get you quickly up and started conceptually if you have little to no experience. I may gloss over some things if you're already familiar.

## What is Git?

Git is a **version control** system. It keeps tracks of a **repository** of files and records all changes made to the files. Most popular in software development for managing code bases.

It provides a system for multiple people to work on the same files by tracking changes, allowing easy reverting, and merging multiple changes.

> Essentially it's like shared cloud saving i.e. OneDrive, DropBox

### But Why Not Just Use DropBox?

Working collaboratively with files can get complicated. Something like DropBox will constantly sync every change to every file for all users. I will list out some things to consider.

- What if multiple people change the same files?
- How can we track each feature as they're finished?
- What if you're not done and the files your working on are in an unfinished state
- What if someone elses change drastically effects your current work
- What if we need to go back

I won't answer these specifically but all of these problems can spell disaster if you plan on working on software using a service like DropBox.
Git is designed to address these issues by allowing you to choose when and how you want to sync your local files to the remote version as well as receive changes from others.

## What is GitHub?

It's a popular git repository hosting service. While Git is the system for version control, by itself it doesn't provide you cloud storage of files. GitHub is one of these providers. There's plenty of others (*GitLab, BitBucket, etc.* ) and you can even host it yourself but GitHub is by far the most popular for individuals and smaller teams.

## Git Basics

### Repositories

**Repository** in this context just means a place to hold files. On GitHub, when you create a repository **it essentially creates an empty folder that's available remotely** and you can freely add/remove files to that folder

{{< img src="https://raw.githubusercontent.com/harshjv/github-repo-size/master/screenshot.webp" class="img-lg" >}}

### Cloning Repositories

This creates a local copy of the folder to your computer. This is similar to downloading files **except** it will create a hidden
**.git** folder that holds metadata linking your local version to the remote version *and stuff*.

### Syncing Changes

> A change includes adding, deleting, or updating files. The process for relaying any changes to the remote repository is the same.

In Git, the process is broken up into 3 steps simplified here.

#### Add

Select the files you want to sync 

#### Commit

Give a name to your change. This makes it easier to track the set of changes you're making if we later want to view or revert them.

#### Push

Syncs all your commits to the remote repo.

### Receiving Changes

This process is called **pulling**, it will grab all the file changes since the last time you pulled.

### Git Branches

This is an extremely important concept when it comes to working collaboratively on a repository.

When you're working on a feature, you often don't want to sync your changes with everyone elses until you have a complete package which may be the result of multiple commits. Even more, you don't want to have other peoples work constantly messing with yours everytime you pull.

**It would be nice if we could hold off on combining our changes with others only when we're done**

The solution is creating a branch. This will create a snapshot of the codebase at that state and let you work off of that. Once you're done with your work. You can then **merge** the entire branch back with the **master branch**

> **master branch** is just a common name used for the main lane of changes in a project.

{{< img src="https://www.nobledesktop.com/image/gitresources/git-branches-merge.webp" class="img-lg" >}}

#### Merge Conflicts

When merging, Git tries its best to encorporate your changes with other people but often you'll get a CONFLICT warning if you've changed a file someone else has as well. Git will need input from you to decide what to keep from your changes what's on the remote.

### All Together

So in summary when you want to grab a github project and make a change...

{{< mermaid >}}
flowchart LR
    A[Clone Repository] --> B[Pull Changes]
    B --> C[Make Changes]
    C --> D[Stage Changes]
    D --> E[Commit Changes]
    E --> F[Push Changes]
{{</ mermaid >}}

If you want to make changes on a separate branch and merge than branch in...

{{< mermaid >}}
flowchart LR
    A[Create a Branch] --> B[Switch to Branch]
    B --> C[Make Changes]
    C --> D[Stage Changes]
    D --> E[Commit Changes]
    E --> F[Push Changes]
    F --> G[Merge Branch]
{{</ mermaid>}}

## GitHub Desktop

Git is originally designed to be done through the commandline. This can add an additional learning curve so we're going to use **[GitHub Desktop](https://desktop.github.com/)** that will give us a UI to perform all the needed actions.