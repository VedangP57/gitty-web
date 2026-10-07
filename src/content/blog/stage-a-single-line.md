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
3. Move into the diff pane and put the cursor on the line you want.
4. Press `Space`. The line is staged.

With the mouse, drag the diff gutter to pick several lines, or click the gutter to pick one. The docs describe the gutter as the place to click or drag "to pick lines", and `Space` then stages the selection. If you prefer the keyboard for a block of lines, `v` selects a range of lines, and `Space` stages them.

What you should see: the file's checkbox in the list changes to match, because checkboxes always reflect `git status`.

## Stage a hunk or everything

Two shortcuts cover the common larger cases:

- `H` stages the whole hunk the cursor is in.
- `a` stages everything, or the whole file when you are working inside a file.

A hunk is a block of changes that git groups together. Use `[` and `]` to jump to the previous and next hunk, and `{` and `}` to move between files, so you can walk a large change without leaving the keyboard.

## Mouse and editor

The mouse works throughout: click to select a file or a line, scroll any pane, and drag the diff gutter to pick lines. Double-click a diff line to open it in `$EDITOR` at that line, which is useful when you spot a stray debug line and would rather delete it than leave it unstaged.

## How it relates to git status

gitty stages through the real git index. The checkboxes in the file list always reflect `git status`, so you can stage a line in gitty, run `git status` in another terminal and see the same result. There is no separate staging area inside the tool to get out of step with git.

That also means you can mix tools. Stage some lines in gitty, stage others with git on the command line, and the Changes tab will show both.

## Unstage a line

Press `Space` again on a staged line or file. The key is a toggle: the docs list it as "stage file / line (again: unstage)".

To throw a change away instead, `d` discards a file or lines. gitty asks first, and a copy is kept in the Trash.

## Commit what you staged

Press `c` to write the commit message in the box at the bottom, then commit. If you forget a line afterwards, `A` amends the last commit. [How to undo your last commit safely](/blog/undo-last-commit/) covers amend and undo in more detail.

Every key above is listed on the [keybindings page](/docs/keys/), and [Using gitty](/docs/using-gitty/) describes the Changes tab. If you are weighing gitty against other terminal clients, [gitty vs lazygit](/blog/gitty-vs-lazygit/) compares how each handles staging and where each fits.
