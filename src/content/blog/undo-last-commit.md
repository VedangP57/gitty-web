---
title: "How to undo your last commit safely"
description: "Undo your last commit safely in gitty, what undo does while the commit is still HEAD, and how to amend it instead."
date: 2026-10-07
kind: howto
tags: ["undo", "amend", "commit"]
order: 12
---

In gitty's Changes tab, press `u` to undo the last commit while it is still `HEAD`, or press `A` to amend it. Which one you want depends on whether the commit needs to disappear or only needs a fix.

**What you need:** gitty installed and a repository where you have just committed.

## The three commit keys

All three work in the Changes tab, which you open with `1`:

- `c` writes the commit message in the box at the bottom.
- `A` amends the last commit.
- `u` undoes the last commit, and the docs say it does so while the commit is still `HEAD`.

The phrase "while it is still `HEAD`" is the limit to remember. Undo is for the commit at the tip of your current branch. Once something else becomes `HEAD`, the commit you meant is no longer the one `u` refers to.

## Choose between them

Ask what is wrong with the commit. If its content or message is nearly right, amend it with `A`. If you want the commit gone, undo it with `u`. Both are in the Changes tab, so you never leave the screen you committed from. Writing the message with `c` is the same box in both cases, and gitty's changelog notes that it supports co-authors there.

## Fix a commit by amending

Amend is the better choice when the commit is right but incomplete, for example when you forgot a file or want to fix the message.

1. Press `1` to open the Changes tab.
2. Stage what belongs in the commit. `Space` stages a file or line, `H` a hunk and `a` everything.
3. Press `A` to amend the last commit.

What you should see: the last commit is amended with what you staged; the History tab, opened with `2`, shows the result. [How to stage a single line in a git TUI](/blog/stage-a-single-line/) covers the staging keys in detail.

## Undo the commit

1. Press `1` to open the Changes tab.
2. Check that the commit you want to remove is the most recent one on your branch. The History tab, opened with `2`, shows the commit list.
3. Press `u`.

What you should see: the commit is no longer the last commit on the branch. Check the History tab to confirm. The documentation says what the key does and when it applies, and it does not describe how your file changes are left, so look at the Changes tab after pressing `u` instead of assuming.

## Why this is the safe way

Two things make this reasonably forgiving. First, both keys act on the last commit only. Second, gitty runs `git` for everything that writes to the repository, so hooks, signing and your git config apply as they do on the command line.

For discarding working changes the tool takes similar care: `d` asks before it discards, and a copy is kept in the Trash.

## If undo is not available

The docs tie `u` to the commit still being `HEAD`. If you have moved on, press `2` and find the commit in the History tab to see where it sits.

If a key does nothing, press `?` for the list of keys that work on the screen you are on, and `!` to read the details of the last error.

## After you change a commit

Nothing leaves your machine until you push. `P` pushes, `p` pulls and `f` fetches, with progress in the top bar and `x` to cancel a running one. That makes the sequence commit, check, amend or undo, then push, a reasonable habit for a branch that only you use.

## Related reading

The Changes tab is described in [Using gitty](/docs/using-gitty/), and every key above appears on the [keybindings page](/docs/keys/). If you came from another terminal client, [gitty vs gitui](/blog/gitty-vs-gitui/) compares the two.
