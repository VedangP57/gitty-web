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

The phrase "while it is still `HEAD`" is the limit to remember. In gitty's behavior, undo is offered for a commit you made in this gitty session, and it is not offered once the upstream's tip is that commit. If you press `u` when nothing can be undone, gitty says that only a commit made in gitty can be undone.

## Choose between them

Ask what is wrong with the commit. If its content or message is nearly right, amend it with `A`. If you want the commit gone, undo it with `u`. Both are in the Changes tab, so you do not leave the screen you committed from. gitty's changelog notes that the commit box supports co-authors.

## Commit first

The sequence starts in the same tab. Stage what belongs together with `Space`, `H` or `a`, press `c`, and write the message in the box at the bottom. Because gitty uses the real git index, `git status` in another terminal shows the same state as the Changes tab, which is a quick way to check before you commit.

If you may want to find the commit again after you change it, press `y` on it in the History tab to copy the short SHA, or `Y` for the full one. That gives you a reference to paste somewhere before you amend or undo.

## Fix a commit by amending

Amend suits a commit that is right but incomplete, for example when you forgot a file.

1. Press `1` to open the Changes tab.
2. Stage what belongs in the commit. `Space` stages a file or line, `H` a hunk and `a` everything.
3. Press `A`. This switches the commit box to amend mode and loads the last commit's message into it.
4. Edit the message if you want, and commit from the box as you would normally.

What you should see: the last commit's message appears in the box, and the amend lands when you commit from it. Pressing `A` again leaves amend mode and restores what you had typed. Check the History tab, which you open with `2`, afterwards. [How to stage a single line in a git TUI](/blog/stage-a-single-line/) covers the staging keys in detail.

## Undo the commit

1. Press `1` to open the Changes tab.
2. Check that the commit you want to remove is the one you just made in this session and is still the most recent on your branch. The History tab, opened with `2`, shows the commit list.
3. Press `u`.

What you should see: the commit is undone. The documentation says what the key does and when it applies, and it does not describe how your file changes are left, so check the History tab and the Changes tab afterwards.

## What happens around a commit

gitty runs `git` for everything that writes to the repository, so hooks, signing and your git config apply as they do on the command line. Discarding is cautious: `d` asks before it discards, and a copy is kept in the Trash.

## If undo does nothing

The docs tie `u` to the commit still being `HEAD`, and gitty only offers it for a commit made in gitty that the upstream does not yet have. Check that the commit you want is the last one on your branch. Press `?` for the list of keys, and `!` for the details of the last error.

## Related reading

If you came from another terminal client, [gitty vs gitui](/blog/gitty-vs-gitui/) compares the two. The Changes tab is described in [Using gitty](/docs/using-gitty/).
