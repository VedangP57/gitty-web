---
title: "How to switch branches and stash changes in gitty"
description: "Switch, create, rename, delete and merge branches from gitty's picker, and stash, apply, pop and drop work without leaving the terminal."
date: 2026-10-19
kind: howto
tags: ["branches", "stash", "git tui"]
order: 4
---

In gitty 0.2.0, press `B` for the branch picker and `S` for the stash list. In the picker, `Enter` switches. If you have uncommitted changes, gitty offers "stash and switch". In the stash list, `a` applies, `p` pops and `d` drops. gitty never re-applies a stash on its own except in the few cases this post lists.

**What you need:** gitty 0.2.0 or later, and a repository with more than one branch.

## The branch picker

Press `B` from anywhere. The picker lists the current branch first, marked with `●`, then your local branches, then remote branches you have no local copy of, marked `(remote)`. Type to narrow the list. The footer shows the keys:

- `Enter` switches to the highlighted branch.
- `Ctrl-N` creates a new branch at `HEAD`. The name prompt starts with what you typed.
- `Ctrl-R` renames the highlighted branch. Only local branches can be renamed.
- `Ctrl-D` deletes the highlighted branch. Only local branches can be deleted, and not the one checked out.
- `Ctrl-G` merges the highlighted branch into the checked-out one, after asking.
- `Esc` closes the picker.

## Switch to a branch

1. Press `B`.
2. Type part of the branch name and move to it with the arrow keys.
3. Press `Enter`.

What you should see: the top bar names the new branch, and History and Changes follow it.

If you pick a remote-only branch such as `origin/feature`, gitty creates a local `feature` that tracks it and switches to that. This is what `git switch --track` does.

## Switch with uncommitted changes

If you have changes to tracked files, `Enter` asks first instead of switching. Untracked files alone never trigger the question. The prompt says "You have uncommitted changes" and offers three keys:

- `s` stash and switch. gitty stashes everything, untracked files included, under the message `gitty: auto-stash from <branch>`, then switches.
- `w` switch anyway. git carries the changes over, or refuses. If it refuses, nothing changes and you see why.
- `Esc` cancels.

What you should see after `s`: the new branch with a clean working tree. Your work is in the stash, at the top of the list under `S`. gitty does not apply it on the new branch. When you come back to the original branch, pop it yourself with `S` and `p`.

If the switch fails after the stash was made, gitty puts the changes back where they were. If git moved `HEAD` before it failed (a failing `post-checkout` hook, say), gitty leaves the changes in the stash instead, so they do not land on the wrong branch.

## Merge a branch

1. Press `B` and highlight the branch you want to bring in.
2. Press `Ctrl-G`.
3. Confirm the question, which names both branches.

With uncommitted changes the question offers "stash and merge" instead, with the same `s`, `w` and `Esc` keys. What happens to the stash depends on how the merge ends:

- The merge goes through: gitty puts your changes back.
- The merge stops on conflicts: your changes stay in the stash while the merge is open, because applying them onto conflicted files would mix the two. Finish the merge, then pop them.
- You abort the conflicted merge from gitty: gitty aborts it and puts the changes back, unless the stash list changed in the meantime.

[How to resolve merge conflicts in the terminal](/blog/resolve-merge-conflicts-in-terminal/) covers the conflicted case step by step.

## Delete a branch

1. Press `B` and highlight the branch.
2. Press `Ctrl-D`, then confirm "Delete the branch …?".

If git judges that the branch has commits its upstream lacks (or that `HEAD` lacks, when it has no upstream), the delete is refused and gitty asks a second time. The question says the branch is not merged into its upstream (or HEAD) and asks whether to delete it anyway. Only a second yes deletes it.

## The stash list

Press `S` to open the list. Each row shows `stash@{n}`, its message, the branch it was made on and its age. The keys are:

- `a` applies the stash and keeps it in the list.
- `p` pops it: applies it and removes it.
- `d` drops it, after asking. The question says its changes are lost.
- `n` stashes the current changes under a message you type.
- `Esc` closes the list.

What you should see: the list closes and the Changes tab shows the result. If the stash list changed since you opened it (from another terminal, say), gitty refuses and asks you to reopen it.

## Stash from the Changes tab

In the Changes tab, `Z` stashes all changes. It opens a prompt for an optional message. Leave it empty and gitty uses `gitty: stash on <branch>`.

Every stash gitty makes includes untracked files, and the prompts say so. When there are more than 500 untracked files, the prompt gives the count and warns that the stash can take a while.

## When gitty applies a stash for you

gitty never re-applies a stash by itself, except in these cases:

- a "stash and switch" whose switch failed, before `HEAD` moved;
- a "stash and merge" whose merge went through, or that changed nothing;
- a conflicted "stash and merge" that you abort from gitty.

A successful "stash and switch" leaves your work in the stash. So does a conflicted merge that you finish. In both cases you pop it yourself.

## If something looks wrong

**If the stash prompt does not appear:** only changes to tracked files trigger it. With only untracked files, gitty switches straight away.

**If a pop or apply conflicts:** git keeps the stash entry and leaves conflict markers in the files. Resolve them, then drop the stash when you no longer need it.

**If `Ctrl-D` or `Ctrl-R` does nothing useful on a remote branch:** both act on local branches only. gitty says so.

**If you cannot find your auto-stash:** look for its message in the `S` list. `gitty: auto-stash from main` means it was made while `main` was checked out.

## Related reading

The picker and the stash list are summarized under [Branches and stashes](/docs/using-gitty/#branches-and-stashes) in the docs. To see how far a branch has drifted before you merge it, read [How to compare your branch with main](/blog/compare-branch-with-main/). The [gitty 0.2.0 release post](/blog/gitty-0-2-0/) lists everything else that arrived with the picker.
