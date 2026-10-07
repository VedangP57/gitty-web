---
title: "How to search commits by text, author or path"
description: "Search the whole history by text, author or path while you keep working, and jump to the commit you need."
date: 2026-10-07
kind: howto
tags: ["search", "history", "git tui"]
order: 14
---

Press `/` in gitty and type your query. gitty searches the whole history while you keep working, and `n` and `N` move between the matches.

**What you need:** gitty installed and a repository with some history.

## What you can search for

The search bar takes plain text, an `author:` filter or a `path:` filter. The three forms cover the usual questions:

- Plain text for words you remember from a commit.
- `author:` for commits by a particular person.
- `path:` for commits that touched a file or directory.

The keybindings page summarizes the key as "search history (text, `path:`)", and [Using gitty](/docs/using-gitty/) adds the `author:` filter. The README's key table writes the path form as `path:dir`, so a directory is a valid value. Try each form on your own history before relying on it, because what a query matches depends on what your repository contains. Text typed into the search bar is never remapped, even if you rebind other keys.

## Steps

1. Press `2` to open the History tab.
2. Press `/` to open the search bar.
3. Type a query. Some examples: `retry`, `author:alice` or `path:src`.
4. Let it run. Matches are found across the whole history, not only the rows on screen.
5. Press `n` to go to the next match and `N` to go to the previous one.
6. When you reach the commit you want, read its files and diff in the panes beside the list.
7. Press `Esc` to end the search. The docs list `Esc` as the key that ends a range, search or compare.

What you should see: `n` and `N` move you between matching commits, and for the selected commit its files and diff appear.

## The list is not filtered

One detail matters when you use search. The list itself stays unfiltered. Search moves you between matches in the full history rather than hiding every commit that does not match. This has a practical use: after you jump to a match, the commits around it are still there, so you can scroll up and down to see what happened before and after the change you found.

## You can keep working

The README says search runs while you keep working. Its benchmark notes record the search on the Linux kernel repository in chunks of 20,000 rows, each taking 337 ms on one of two search threads, and state that the UI never waits. You can scroll, switch panes or select other commits while a search continues.

On a very large repository that matters. Searching all of history is more work than drawing the visible rows, so gitty does it off the main path and lets you carry on. If you want the background on how gitty stays responsive, [Keep a git TUI fast on very large repositories](/blog/git-tui-large-repositories/) has the figures.

## Rebind the search keys

If the defaults clash with your habits, rebind them in `~/.config/gitty/config.toml` under `[keys]`, using the config names `search`, `next_match` and `prev_match`. A rebound action loses its default keys, and the text input of the search bar itself is never remapped.

## Combine search with other History keys

Once you land on a commit, the usual History keys apply. `y` copies the short SHA and `Y` the full SHA, which is handy for pasting a commit reference into an issue. `s` switches the diff between unified and split, and `[` and `]` move between hunks. For a stretch of related commits, `V` starts a range, and [How to review a range of commits](/blog/review-a-commit-range/) covers it.

For the full list of keys, see the [keybindings page](/docs/keys/).
