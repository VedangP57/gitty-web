---
title: "How to compare your branch with main"
description: "Compare your branch with main in the terminal: press b, pick a branch, and see what is ahead, behind and different."
date: 2026-10-07
kind: howto
tags: ["compare", "branches", "git tui"]
order: 13
---

In gitty, press `b` to compare `HEAD` with any branch, then choose `main`. You get what is behind, what is ahead, and the files that differ between the two.

**What you need:** gitty installed and a repository with a branch and a `main` to compare against.

## Why compare before you push

Before you open a pull request or merge, two questions matter. What does my branch contain that `main` does not, and what has `main` gained since I branched? The compare view answers both on one screen,.

The compare is always from `HEAD`. Check out the branch you want to review first, then compare it with the base.

## Steps

1. Open the repository in gitty and make sure the branch you are reviewing is checked out.
2. Press `b` to compare with a branch.
3. Choose the base, for example `main`.
4. Read the result. It shows what is behind, what is ahead, and the files that differ.
5. Select a file to see its diff. `Enter` opens or drills into the selection, and `Tab` moves between panes.
6. Press `Esc` to leave the compare and go back to where you were.

What you should see: the commits your branch is behind and ahead by, and the list of changed files with a diff for the one you select.

## Reading the diff

Once a file is selected, the diff keys from the rest of gitty apply. `[` and `]` jump to the previous and next hunk, and `{` and `}` to the previous and next file. `s` switches between split and unified diff, and `W` wraps long lines. `w` changes the whitespace mode, which is useful when a branch reformatted code and you want to see only the real edits. The `whitespace` setting in your config takes `show`, `ignore-all` or `ignore-amount`, and `w` is the key for changing it as you read.

`t` shows the file list as a tree, which helps when a branch touches many directories. If you want a diff in an external viewer, `O` opens it in your difftool. That key runs the command set as `difftool` in your config, called as `<difftool> <old> <new>`.

## Behind and ahead marks in History

You do not have to open compare to see where you stand against your upstream. The History tab, opened with `2`, marks commits that are ahead of or behind the upstream, and on a branch that has never been pushed, `↑` marks what pushing it would publish. Compare with `b` is for the other question, where your branch stands against any branch you choose.

## Fetch first

A comparison is only as current as your local refs. Press `f` to fetch before you compare, so `main` reflects what is on the remote. gitty also runs a background fetch every few minutes, set by `auto_fetch_minutes`, and you can turn it off with `0`. Progress shows in the top bar and `x` cancels a running fetch.

## Where this fits

The compare view and the History tab share their diff keys, so nothing new needs learning. `y` and `Y` copy the short or full SHA of a selected commit, which is handy when you paste a reference into a pull request description.

Compare answers a question about two branches. For a question about a single commit, `/` finds commits by text, author or path, described in [How to search commits by text, author or path](/blog/search-commits/). To read several commits as one combined diff, see [How to review a range of commits](/blog/review-a-commit-range/).

The behavior is described in [Using gitty](/docs/using-gitty/), and every key is on the [keybindings page](/docs/keys/).
