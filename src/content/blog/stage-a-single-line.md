---
title: "How to stage a single line in a git TUI"
description: "Stage a single line of a change without leaving the terminal. The keys, the mouse shortcut, and how gitty stays in sync with git status."
date: 2026-10-07
kind: howto
tags: ["staging", "line staging", "git tui"]
order: 10
---

To stage one line in gitty, open the Changes tab with `1`, select the line in the diff and press `Space`, or click the diff gutter. Pressing `Space` on a staged line unstages it again.

**What you need:** gitty installed and a repository with an unstaged change.

## Why stage by line

A working tree often holds two ideas at once: a bug fix and a debug print, or a rename mixed into a logic change. Staging a whole file commits both together. Staging individual lines lets you build commits that each say one thing, and leave the rest of the edit in your working tree for the next commit.

gitty's Changes tab is built for this. Its status follows the file system, and the diff of the selected file is where you pick lines.

## Stage a line

1. Press `1` to open the Changes tab.
2. Move to the file you changed. `j` and `k` (or the arrow keys) move through the list, and `Tab` moves between panes. `F` filters the file list if there are many files, and `t` shows it as a tree.
3. Press `Tab` to move to the next pane, where the diff is, and select the line you want.
4. Press `Space` to stage it.

With the mouse, click the diff gutter to stage one line, or drag along it to stage several; the lines are staged when you release the button. If you prefer the keyboard for a block of lines, `v` selects a range of lines, and `Space` stages them.

What you should see: the file's checkbox in the list changes to match, because checkboxes always reflect `git status`.

## Read the change first

Choosing lines is easier when you can see enough of the file. `e` shows more context near the cursor and `E` shows the whole file. `w` changes the whitespace mode, so a reformatted block does not hide the real edit, and `W` wraps long lines. If you would rather review in another viewer, `O` opens the diff in your difftool, which you set with `difftool` in the config. Choose the lines after you have read the whole change, not while you are still scrolling.

## Stage a whole file

In the file list, `Space` stages the file and a second `Space` unstages it. That is the same key as for a line, so one habit covers both. Use it when a file belongs entirely in the next commit, and save line staging for the files that mix two ideas.

## Stage a hunk or everything

Two shortcuts cover the common larger cases:

- `H` stages the whole hunk the cursor is in.
- `a` stages everything, or the whole file when you are working inside a file.

A hunk is a block of changes that git groups together. Use `[` and `]` to jump to the previous and next hunk, and `{` and `}` to move between files, so you can walk a large change without leaving the keyboard.

## Open a line in your editor

Double-click a diff line to open it in `$EDITOR` at that line, which is useful when you spot a stray debug line and would rather delete it than leave it unstaged.

## How it relates to git status

gitty stages through the real git index. The checkboxes in the file list always reflect `git status`, so you can stage a line in gitty, run `git status` in another terminal and see the same result.

## Unstage a line

Press `Space` again on a staged line or file. The key is a toggle: the docs list it as "stage file / line (again: unstage)".

To throw a change away instead, `d` discards a file or lines. gitty asks first, and a copy is kept in the Trash.

## Commit what you staged

Press `c` to write the commit message in the box at the bottom. If you forget a line afterwards, `A` amends the last commit. [How to undo your last commit safely](/blog/undo-last-commit/) covers amend and undo in more detail.

The Changes tab is described in [Using gitty](/docs/using-gitty/). If you are weighing gitty against other terminal clients, [gitty vs lazygit](/blog/gitty-vs-lazygit/) compares how each handles staging and where each fits.
