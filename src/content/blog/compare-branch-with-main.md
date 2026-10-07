---
title: "How to compare your branch with main"
description: "Compare your branch with main in the terminal: press b, pick a branch, and see what is ahead, behind and different."
date: 2026-10-07
kind: howto
tags: ["compare", "branches", "git tui"]
order: 13
---

In gitty, press `b` to compare `HEAD` with any branch, and pick `main` as the other side. The result is split into what is behind, what is ahead, and the files that differ.

**What you need:** gitty installed and a repository with your branch checked out and a `main` branch to compare against.

## What the three views mean

Before you open a pull request or merge, two questions matter. What does my branch contain that `main` does not, and what has `main` gained since I branched? Compare answers both, and adds a third view for the files that differ. The compare screen has one tab for each: behind, ahead and files. Because the comparison starts from `HEAD`, check out the branch you want to review first, then compare it with the base.

The base does not have to be `main`. The docs say `b` compares `HEAD` with any branch, so the same steps work against a release branch or a colleague's branch.

## Steps

1. Open the repository in gitty with the branch you are reviewing checked out.
2. Press `b` to compare with a branch.
3. Pick the branch to compare against, for example `main`.
4. Read the first tab, then move between the behind, ahead and files tabs with `h` and `l`, or the left and right arrow keys. The README's key table lists these as "compare: previous tab" and "compare: next tab", and their config names are `compare_prev_tab` and `compare_next_tab`.
5. Press `Esc` to end the compare. The docs list `Esc` as the key that ends a range, search or compare.

What you should see: three views of the same comparison. Behind lists what `main` has that your branch lacks, ahead lists what your branch has that `main` lacks, and the files view lists the files that differ.

## Keep your refs current

A comparison reflects the refs you have locally. Press `f` to fetch before you compare, so `main` matches what is on the remote. Progress shows in the top bar, and `x` cancels a running fetch, pull or push. gitty also fetches in the background every few minutes, controlled by `auto_fetch_minutes`, which defaults to `5` and which `0` turns off.

## How fast the count is

The ahead and behind count is the heavy part of a comparison on a big repository. gitty's benchmark measures it on the Linux kernel, between `master` and `v6.0`, across 360,606 commits, and records 88 ms against a budget of under 150 ms. That figure comes from a release build on Apple Silicon with a warm cache, so it shows the scale you can expect and not a guarantee for your machine.

## Compare or change the scope

Outside compare, the History tab has `r`, which switches the list between the current branch plus its upstream and every ref. That shows refs side by side in the commit list. Use `b` when you want the behind and ahead counts and the files that differ. While compare is open, the History-only keys such as `/`, `n`, `N`, `V` and `r` do nothing, because compare shows its own lists; press `Esc` first to get them back.

## Rebind it

If `b` clashes with another habit, the config name for compare is `compare`, and you can rebind it under `[keys]` in `~/.config/gitty/config.toml`. The tab keys are `compare_prev_tab` and `compare_next_tab`. A rebound action loses its default keys, so list every key you want it to keep.

## Marks outside compare

You do not need to open compare to see where you stand against your own upstream. The History tab, which you open with `2`, marks commits that are ahead of or behind the upstream, and on a branch that has never been pushed, `↑` marks what pushing it would publish. Compare with `b` is for the other question, where your branch stands against any branch you choose.

## Next steps

Once you know which commits differ, read them on the History tab. [How to review a range of commits](/blog/review-a-commit-range/) shows how to select them with `V` and read their combined diff, and [How to search commits by text, author or path](/blog/search-commits/) helps you find a specific one first.

The compare behavior is summarized in [Using gitty](/docs/using-gitty/).
