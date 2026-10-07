---
title: "A GitHub Desktop alternative in the terminal"
description: "GitHub Desktop is a graphical app. If you want a similar History and Changes workflow in a terminal, here is how gitty compares."
date: 2026-10-07
kind: comparison
tags: ["github desktop", "alternative", "git tui"]
order: 9
---

GitHub Desktop is a graphical application. gitty is a terminal program that takes the same overall shape, with a History view, a Changes view and line staging, and puts it in a terminal on macOS or Linux. This page compares the two and says when staying with GitHub Desktop is the better choice. gitty is independent and is not affiliated with GitHub.

GitHub's own description is that "GitHub Desktop is a free, open source application that helps you to work with code hosted on GitHub or other Git hosting services", and it lets you "perform Git commands, such as committing and pushing changes, in a graphical user interface" (GitHub Docs). Facts about it here come from GitHub's documentation and the project's README, read on 2026-10-07.

## The facts

| | [GitHub Desktop](https://github.com/desktop/desktop) | gitty |
|---|---|---|
| Interface | Graphical desktop application | Terminal |
| Built with | TypeScript and React, on Electron | Rust, with Ratatui |
| Platforms | macOS and Windows officially | macOS and Linux |
| License | MIT | MIT |

The GitHub Desktop README states that "Linux is not officially supported", and points to installers built from a fork in its Community Releases section. Those are not GitHub's own builds, and this page does not assess them. The gitty facts are on the [installation page](/docs/installation/).

## What the workflow looks like

GitHub's documentation describes reviewing changes in a Changes tab, where you select the files to include and can create a partial commit: you click changed lines to exclude them, and the lines still highlighted in blue go into the commit. That partial-commit idea, choosing lines rather than whole files, is the part of the workflow gitty is aimed at. Its README describes it as a terminal git client "with the GitHub Desktop experience: History, Changes, line staging, fetch / pull / push, search and compare".

## What gitty keeps

The window has a **History** tab (`2`) and a **Changes** tab (`1`), and `Tab` moves between panes.

- In Changes you stage a file, a hunk or single lines with `Space`, or by clicking the diff gutter to pick lines. You commit from a box with amend and undo, and discarded changes keep a copy in the Trash.
- In History you see local and remote commits with their refs, and select a commit or a range to see its files and a syntax-highlighted diff.
- Fetch, pull and push report progress in the app and ask for passwords inside it.
- The mouse works throughout, so clicking and scrolling behave as you would expect from a desktop application.

## What is different

gitty runs in a terminal, so it can sit next to your editor in a split or a second tab. It is keyboard-first, with every key rebindable. It runs on macOS and Linux, and it runs `git` for everything that writes to the repository, so your hooks, signing, credential helpers and config apply. It reads history with gitoxide. It has `/` for searching the whole history and `b` for comparing HEAD with a branch. See [Using gitty](/docs/using-gitty/) and [Keys](/docs/keys/), and [Use a git TUI over SSH](/blog/git-tui-over-ssh/) for remote work.

gitty is not a GitHub product, and nothing on this page is endorsed by GitHub.

## When to stay with GitHub Desktop

Stay with GitHub Desktop if you prefer a graphical window or if you work on Windows, where GitHub documents official support. gitty needs a terminal with mouse reporting, and it does not run on Windows.

## Which should you pick?

If you want a desktop window, use GitHub Desktop. If you want a similar History and Changes workflow inside the terminal where you already edit code, install gitty with `brew install vedangp57/tap/gitty` and run `gitty` in a repository. See also [The best git TUI clients compared](/blog/best-git-tui-clients/).
