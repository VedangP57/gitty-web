---
title: "How to search commits by text, author or path"
description: "Search the whole history by text, author or path while you keep working, and jump to the commit you need."
date: 2026-10-07
kind: howto
tags: ["search", "history", "git tui"]
order: 14
---

Press `/` in gitty, type your query and press `Enter`. gitty searches the whole history while you keep working, and `n` and `N` move between the matches.

**What you need:** gitty installed and a repository with some history.

## What you can search for

The search bar takes plain text, an `author:` filter or a `path:` filter:

- Plain text for words you remember from a commit.
- `author:` for commits by a particular person.
- `path:` for commits that touched a file or directory.

The keybindings page summarizes the key as "search history (text, `path:`)", and [Using gitty](/docs/using-gitty/) adds the `author:` filter. The README's key table writes the path form as `path:dir`, so a directory is a valid value.

## Steps

1. Press `2` to open the History tab.
2. Press `/` to open the search bar.
3. Type a query, such as `retry`, `author:alice` or `path:src`.
4. Press `Enter` to run it. Matches are found across the whole history, not only the rows on screen. `Esc` closes the bar without running the query.
5. Press `n` to go to the next match and `N` to go to the previous one.
6. Read the files and diff of the commit you land on in the panes beside the list.
7. Press `Esc` to end the search. The docs list `Esc` as the key that ends a range, search or compare.

What you should see: the first match is selected, and `n` and `N` step through the rest.

## The list is not filtered

The list itself stays unfiltered. Search moves you between matches in the full history and does not hide every commit that does not match. After you jump to a match, the commits around it are still there, so you can scroll up and down to see what happened before and after the change you found. Press `g` for the first row or `G` for the last, and `Ctrl-d` and `Ctrl-u` move by half a page.

## Which commit you land on

A search moves the selection to a match, and the panes beside the list show that commit's files and diff. `n` and `N` then move you to the next and previous match, and the same two keys serve text, `author:` and `path:` queries.

## You can keep working

The README says search runs while you keep working, and its performance table adds that the UI never waits. The benchmark records one 20,000-row chunk of the Linux kernel history taking 337 ms on one of two search threads. A search of a very large repository is more work than drawing the visible rows, so gitty does it on background threads instead of making you wait with an empty screen.

Running a new query replaces the previous search.

## Leaving search, range and compare

Search, a commit range and a compare are three modes you can be in on the History tab, and `Esc` ends each of them. That one key is all you need to remember for getting back to the plain list. `V` starts a range from the commit a search has landed you on, and `b` compares `HEAD` with a branch. `D` changes the date format if you want to scan results by absolute date, and `o` expands the commit header when a match needs more context.

## Rebind the search keys

If the defaults clash with your habits, rebind them in `~/.config/gitty/config.toml` under `[keys]`, using the config names `search`, `next_match` and `prev_match`. A rebound action loses its default keys, and the text input of the search bar itself is never remapped. gitty reports conflicts at startup, such as one key bound to two actions that share a screen.

## After you find the commit

Once you land on a commit, the usual History keys apply. `y` copies the short SHA and `Y` the full SHA, which is handy for pasting a reference into an issue. `s` switches the diff between unified and split, and `[` and `]` move between hunks. For a stretch of related commits, `V` starts a range. [How to review a range of commits](/blog/review-a-commit-range/) covers it, and [How to browse the history of a huge repository](/blog/browse-huge-repository-history/) covers the tab itself.
