---
title: "The best git TUI clients compared"
description: "lazygit, tig, gitui and gitty compared on language, platforms and focus, using each project's own documentation. No benchmarks, just facts."
date: 2026-10-07
kind: comparison
tags: ["git tui", "lazygit", "tig", "gitui", "comparison"]
order: 5
---

There is no single best git TUI, because the four projects covered here are built around different workflows. lazygit calls itself a terminal UI for git commands, gitui a terminal UI for git, tig describes itself as a repository browser that can also stage changes, and gitty aims at the GitHub Desktop experience of History, Changes and line staging. This page sets out what each project says about itself, so you can match one to the way you work. If you are new to the idea, [What is a git TUI](/blog/what-is-a-git-tui/) explains the basics.

Everything about lazygit, tig and gitui below comes from each project's own README or install notes, read on 2026-10-07. Projects change, so check the linked pages before you decide. gitty is written by the author of this site.

## What to look for in a git TUI

A short list of questions is more useful than a ranking:

- Does it run on the operating systems you use?
- Is it installable the way you install everything else, such as a package manager or a binary download?
- Does its feature list include the operations you do every day, such as line staging, rebasing or stashing?
- Is its main view the one you want open all day, a history browser, a status board or a command menu?
- Is its license acceptable for your use?

## The facts

| Project | Written in | Platforms it documents | License | Install methods it documents |
|---|---|---|---|---|
| [lazygit](https://github.com/jesseduffield/lazygit) | Go | macOS, Linux, Windows, FreeBSD | MIT | Binary releases, Homebrew, many package managers, `go install` |
| [tig](https://github.com/jonas/tig) | C | Linux, macOS, FreeBSD, Windows (via Git for Windows or Cygwin) | GPL-2.0 | Distribution packages, Homebrew, Nix, or `make` from source |
| [gitui](https://github.com/gitui-org/gitui) | Rust | Linux, macOS, Windows, Android (Termux) | MIT | Package managers, release binaries, `cargo install gitui --locked` |
| [gitty](/docs/installation/) | Rust | macOS, Linux | MIT | Homebrew, shell installer, prebuilt archives, `cargo install --locked gitty-cli` |

## lazygit

lazygit's README calls it "a simple terminal UI for git commands". Its feature list includes staging hunks or individual lines, interactive rebase, cherry-pick, bisect, custom commands, worktrees, undo, a commit graph and comparing two commits. If you want a broad set of git operations behind one interface, that list is the reason to look at it. See [gitty vs lazygit](/blog/gitty-vs-lazygit/).

## tig

tig's README describes it as "an ncurses-based text-mode interface for git". It "functions mainly as a Git repository browser, but can also assist in staging changes for commit at chunk level and act as a pager for output from various Git commands." That makes it a fit when you mostly want to read history and the output of git commands. See [gitty vs tig](/blog/gitty-vs-tig/).

## gitui

gitui's README lists keyboard-only control, context-based help, staging, unstaging, reverting and resetting of files, hunks and lines, stashing, push and fetch, browsing and searching the commit log, and submodule support. See [gitty vs gitui](/blog/gitty-vs-gitui/).

## gitty

gitty has a History tab and a Changes tab. History shows local and remote commits with their refs and a syntax-highlighted diff, unified or split. Changes follows the file system and stages by file, hunk or line. It also fetches, pulls and pushes inside the app, searches the whole history and compares HEAD with any branch. It runs on macOS and Linux. See [Using gitty](/docs/using-gitty/) for the full tour. If you are coming from a graphical client, [A GitHub Desktop alternative in the terminal](/blog/github-desktop-alternative-terminal/) covers that move.

## How to choose

Start from the platform. If you need Windows, gitty is not an option today and the other three document it. Then start from the workflow. If you want a repository browser, read tig's README. If you want rebase and cherry-pick behind a menu, read lazygit's feature list. If you want keyboard-only control with stashing, read gitui's. If you like the History and Changes layout of GitHub Desktop and work on macOS or Linux, try gitty with `brew install vedangp57/tap/gitty`.

Trying two of them on the same repository is a quick way to find out which one suits you.
