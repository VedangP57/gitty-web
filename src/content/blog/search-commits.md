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

The search bar takes plain words, an author's name, or a `path:` filter:

- Plain words for text you remember from a commit.
- An author's name or email address, for commits by a particular person.
- `path:` followed by a file or directory, for commits that touched it.

The keybindings page summarizes the key as "search history (text, `path:`)", and the README's key table writes the path form as `path:dir`, so a directory is a valid value. Both [Using gitty](/docs/using-gitty/) and the README describe search by text, author or path. In gitty's source, plain words are matched against each commit's summary, author name and author email. A query made only of lowercase letters ignores case, and a query with an uppercase letter matches case exactly.

A `path:` value is matched literally, with no globs. Put it in double quotes if it contains a space, as in `path:"docs/my notes"`. You can combine words and a path in one query, for example `retry path:src`.

## Steps

1. Press `2` to open the History tab.
2. Press `/` to open the search bar.
3. Type a query, such as `retry`, an author's name, or `path:src`.
4. Press `Enter` to run it. Matches are found across the whole history, not only the rows on screen. `Esc` closes the bar without running the query.
5. Press `n` to go to the next match and `N` to go to the previous one.
6. Read the files and diff of the commit you land on in the panes beside the list.
7. Press `Esc` to end the search.

What you should see: a match is selected, and `n` and `N` step through the rest.

## The list is not filtered

The list itself stays unfiltered. Search moves you between matches in the full history and does not hide every commit that does not match. The commits around a match are still there, so you can scroll up and down from it. Press `g` for the first row or `G` for the last, and `Ctrl-d` and `Ctrl-u` move by half a page.

## You can keep working

The README says search runs while you keep working, and its performance table adds that the UI never waits. The benchmark records one 20,000-row chunk of the Linux kernel history taking 337 ms on one of two search threads. A search of a very large repository is more work than drawing the visible rows, so gitty does it on background threads instead of making you wait with an empty screen.

Running a new query replaces the previous search. A `path:` lookup asks git for the commits that touch the path, and gitty's source notes that on a huge history without changed-path filters this can take many seconds, which is why a newer search cancels it instead of waiting.

## Rebind the search keys

If the defaults clash with your habits, rebind them in `~/.config/gitty/config.toml` under `[keys]`, using the config names `search`, `next_match` and `prev_match`. A rebound action loses its default keys, and the text input of the search bar itself is never remapped. gitty reports conflicts at startup, such as one key bound to two actions that share a screen.

## After you find the commit

Once you land on a commit, the usual History keys apply. `y` copies the short SHA and `Y` the full SHA, which is handy for pasting a reference into an issue. `s` switches the diff between unified and split, and `[` and `]` move between hunks. For a stretch of related commits, `V` starts a range. [How to review a range of commits](/blog/review-a-commit-range/) covers it, and [How to browse the history of a huge repository](/blog/browse-huge-repository-history/) covers the tab itself.
