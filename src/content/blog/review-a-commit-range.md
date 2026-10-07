---
title: "How to review a range of commits"
description: "Select a range of commits and read their combined files and diff in gitty, with the keys and mouse shortcuts that make it quick."
date: 2026-10-07
kind: howto
tags: ["history", "range", "review"]
order: 15
---

In gitty's History tab, press `V` on a commit to start a range, move to the other end, and the panes beside the list show the files and diff for the whole range. Shift-click does the same with the mouse.

**What you need:** gitty installed and a repository with a run of commits you want to read together.

## Why read a range

A pull request is rarely one commit. When you review a feature branch, reading commit by commit repeats the same file several times, and an edit in the third commit may undo one from the first. A range shows the files and the diff together, so you read the result of the work and not every step along the way. The project's changelog describes this as `V` ranges with a combined diff.

## Select the range

1. Press `2` to open the History tab.
2. Move to one end of the range with `j` and `k`, or the arrow keys.
3. Press `V` to start the range.
4. Move to the other end of the range.
5. Read the result in the file list and the diff.

With the mouse, click the first commit and Shift-click the last. The docs list Shift-click as the mouse shortcut for a commit range.

What you should see: a combined file list for the commits in the range, and a syntax-highlighted diff for the file you select.

## Read the combined files

The file list covers the whole range. Press `Tab` to move between panes, and `Enter` to open or drill in. `t` shows the files as a tree, which is useful when a range touches many directories. `{` and `}` move to the previous and next file, and `[` and `]` to the previous and next hunk, so you can go through the change without picking up the mouse.

Press `s` to switch between unified and split diff. Split puts the old and new versions side by side. The `split_threshold` setting, with a default of `200`, is the terminal width at which gitty turns split view on by itself. Added and deleted files always use the full width.

Two other keys help with long diffs. `W` wraps long lines, and `e` shows more context near the cursor, with `E` showing the whole file.

## Open a line in your editor

When a line needs a closer look or a fix, double-click it. gitty opens the file in `$EDITOR` at that line. Double-clicking a file in the list opens the file too. The setting uses `$EDITOR`, or `$VISUAL`, split like shell words but never run by a shell, with file paths passed as separate arguments.

To see the diff in your own tool instead, press `O`. It runs the command named by `difftool` in your config. A GUI tool needs its wait flag, such as `"code --wait --diff"`, because the two temporary files are removed when the command returns.

## Share what you found

`y` copies the short SHA of the selected commit and `Y` the full SHA, so you can paste a reference into a review comment. `D` changes the date format and `z` the row density if the list is too dense to scan.

## End the range

Press `Esc`. The docs list it as the key that ends a range, search or compare.

## Related

To find the commits worth reviewing first, use search, described in [How to search commits by text, author or path](/blog/search-commits/). To see everything that differs from another branch in one view, use [How to compare your branch with main](/blog/compare-branch-with-main/).

The History tab is described in [Using gitty](/docs/using-gitty/), and every key is on the [keybindings page](/docs/keys/).
