---
title: "How to force push safely with lease after an amend or rebase"
description: "Push after an amend or rebase: how gitty offers a force push with lease, what the question lists, and which branches it never force pushes."
date: 2026-10-19
kind: howto
tags: ["push", "force push", "rebase"]
order: 5
---

When a push is rejected because the remote moved on, gitty 0.2.0 offers a force push with lease. The question lists the remote commits the push would remove. Press `Enter` to force push or `Esc` to cancel. The lease is the commit you last fetched, so git refuses if anyone pushed since.

**What you need:** gitty 0.2.0 or later, and a branch you have pushed, then amended or rebased.

## Why the push is rejected

Amending or rebasing rewrites commits. Say you pushed `feat`, then amended its last commit. Your local `feat` now ends in a new commit, and the old one is not in its history. The remote still has the old one. A normal push only moves a remote branch forward, so git rejects it as non-fast-forward.

The usual fix is a force push. A plain `git push --force` replaces the remote branch with whatever you have, including commits a teammate pushed after you last looked. `--force-with-lease` adds a condition. You tell git which commit you expect the remote branch to be at. git updates the branch only if it is still there, and otherwise rejects the push as "stale info". If you give no commit, git uses your remote-tracking branch, such as `origin/feat`. A fetch moves that ref, so a background fetch could quietly change what the lease checks against.

gitty always passes the commit explicitly, as `--force-with-lease=<remote branch>:<commit>`. The commit is the one your remote-tracking branch pointed at when the push was rejected.

## Steps

1. **Push with `P`.**

   What you should see: the push fails with "Push rejected: the remote has commits you don't have; pull first (p)", and the force push question opens.

2. **Read the question.** Its title is "Force push", and its first line asks "Force push `feat` with lease?". Below it, gitty says what would leave the remote:

   - "Nothing on the remote is lost." when the remote branch has no commits that your branch lacks.
   - "It replaces your earlier version of this branch" with a count, when every such commit is your own earlier work. gitty counts a commit as yours when the branch's reflog shows you made it there (by commit, amend, rebase or cherry-pick) and its author email is your `user.email`.
   - "origin/feat has N commits by others, they will be removed from the remote:" followed by up to three of them, each as hash, author and subject, then "…and N more" and a count of your own commits if there are any.
   - "Could not tell which commits on origin/feat would be lost." when git could not say.

   The last line is always "If anyone pushes after this screen, git refuses instead."

3. **Decide.** Press `Enter` to force push or `Esc` to cancel. If the list names commits by others that you did not expect, cancel and look at them first. [How to compare your branch with main](/blog/compare-branch-with-main/) shows how to read what differs between two branches.

   What you should see: progress in the top bar while gitty force pushes the branch, then a notice that it was force pushed.

## Branches gitty never force pushes

gitty refuses to force push `main` or `master`, in any letter case, or the branch that `origin/HEAD` points to, which is usually the remote's default branch. It checks both your local branch name and the remote branch it pushes to. Instead of the question, the notice says that force pushing the branch is blocked in gitty. If you really mean to rewrite one of those branches, do it from the command line, where the decision is explicitly yours.

## When gitty does not offer it

The offer only appears for a rejection caused by the remote moving on. A push refused by a server hook or a protected branch says "Push refused by the remote" with git's reason, and there is no force push option.

If the remote has commits you have never fetched, git says "fetch first", and gitty says "The remote has new commits. Fetch first (f)". gitty does not offer a force push here, because it cannot list commits it has not seen. Press `f`, look at the new commits in History, and push again. If you still want to replace them, the question now lists them with their authors.

## Troubleshooting

**If the force push fails with "The remote has new commits you haven't seen":** the lease did not hold. The remote branch is no longer at the commit gitty took as the lease, because someone pushed to it. Nothing was overwritten. Fetch with `f`, look at what arrived, and push again.

**If it says the branch has no remote-tracking branch to check against:** there is no `origin/<branch>` to lease against. Fetch with `f`, or push normally first.

**If it says "The branch changed since this screen":** you committed or amended after the question opened. gitty does not push a tip you have not seen in the question. Press `P` again.

**If it says "HEAD is no longer on feat":** you switched branches while the question was open. Check the branch out again and push with `P`.

**If you see "Push was rejected; press P to see the force push option":** another dialog was open when the rejection came. Close it and press `P`.

## Before you amend a pushed commit

An amend changes a commit you may already have shared. [How to undo your last commit safely](/blog/undo-last-commit/) covers amend with `A` and undo with `u` in the Changes tab, and when each one applies. If the commit is already on the remote, expect to come back to this force push question.

## Related reading

The push behaviour is summarized under [Network](/docs/using-gitty/#network) in the docs. A rebase that stops partway is covered in [How to resolve merge conflicts in the terminal](/blog/resolve-merge-conflicts-in-terminal/). The [gitty 0.2.0 release post](/blog/gitty-0-2-0/) lists the rest of this release.
