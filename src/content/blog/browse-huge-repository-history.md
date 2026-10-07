---
title: "How to browse the history of a huge repository"
description: "Browse the history of a very large repository without waiting. What loads first, how to switch scope, and how to pick a range of commits."
date: 2026-10-07
kind: howto
tags: ["history", "large repositories", "git tui"]
order: 11
---

Open gitty in the repository and press `2` for the History tab. The layout draws first and the commit rows stream in after it, so you can start reading before the whole history has loaded.

**What you need:** gitty installed and a large repository.

## What draws first

gitty's benchmark notes state the order: the UI draws its layout first and streams rows in afterwards. The README lists the first frame, with the layout drawn, at 14 ms. On a blobless clone of the Linux kernel, which has 1,484,291 commits, the first 500 history rows take 23 ms in the benchmark. Those were measured on Apple Silicon with a release build and a warm cache, so treat them as a sense of scale and not a promise for your machine.

The notes also record that the first run after other disk activity is slower: with a cold page cache, reading the kernel's 945 refs takes about 0.8 to 1.0 seconds. If the first open of a very large repository feels slower than the next one, that is the documented cause.

## Steps

1. Run `gitty` inside the repository.
2. Press `2` to open the History tab.
3. Move with `j` and `k`, or the arrow keys. `Ctrl-d` and `Ctrl-u` move half a page, `Ctrl-f` and `Ctrl-b` a whole page, and `g` and `G` jump to the first and last row.
4. Press `r` to change scope. The list switches between the current branch plus its upstream and every ref.
5. Select a commit. The panes beside the list show its files and a syntax-highlighted diff.
6. Press `s` to switch the diff between unified and split. Added and deleted files always use the full width.

`Tab` moves between panes, and `?` shows every key. On a wide terminal, gitty turns split view on by itself at the width set by `split_threshold`, which defaults to `200`, so `s` is only needed when you want the other layout.

What you should see: a commit list with refs and ahead and behind marks, and for the selected commit a file list and a diff. The marks show what is ahead of or behind the upstream, and on a branch that has never been pushed, `↑` marks what pushing it would publish.

## Tune the view

A few keys change how much fits on screen:

- `z` changes row density, `compact` being the default.
- `D` changes the date format. The `date_mode` setting in your config takes `relative`, `absolute` or `both`.
- `o` expands the commit header.
- `y` copies the short SHA and `Y` the full SHA.
- `<` and `>` shrink or grow the focused pane.

Your pane sizes, history scope and tree view are remembered per repository under `~/.local/state/gitty/`, so the next visit starts where you left it.

## Read more than one commit

`V` selects a range of commits, and Shift-click does the same with the mouse. [How to review a range of commits](/blog/review-a-commit-range/) walks through that. `/` searches the whole history while you keep working, covered in [How to search commits by text, author or path](/blog/search-commits/).

## If the repository still feels slow

The docs give one cause worth checking. On a repository with at least 10,000 commits or 20,000 index entries, gitty tunes git once in the background, writing a commit-graph among other things, unless `auto_tune = false` is set in your config. The guide [Keep a git TUI fast on very large repositories](/blog/git-tui-large-repositories/) explains what the commit-graph changes, with the figures from gitty's own benchmark.

See [Using gitty](/docs/using-gitty/) for the History tab and the [keybindings page](/docs/keys/) for every key named here.
