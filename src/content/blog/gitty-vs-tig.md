---
title: "gitty vs tig"
description: "How gitty and tig differ in language, workflow and what each is built for, and where tig is the better fit. Based on each project's own docs."
date: 2026-10-07
kind: comparison
tags: ["tig", "comparison", "git tui"]
order: 7
---

tig and gitty are built for different jobs. tig describes itself as a repository browser that can also stage changes in chunks and page the output of git commands. gitty is a git client with a History tab and a Changes tab, aimed at the GitHub Desktop workflow, including staging by hunk or by line. If you mostly read history and command output, tig is built for that. If you want to stage and commit from the same window, gitty is.

Facts about tig come from its README, INSTALL notes and license file on GitHub, read on 2026-10-07. Facts about gitty come from its README and documentation. gitty is written by the author of this site.

## The facts

| | [tig](https://github.com/jonas/tig) | gitty |
|---|---|---|
| Written in | C | Rust, with Ratatui |
| Platforms | Linux distributions, macOS, FreeBSD, Windows via Git for Windows or Cygwin | macOS (Apple Silicon or Intel), Linux (x86_64 or arm64) |
| License | GPL-2.0 | MIT |
| Install | Distribution packages, Homebrew, Nix, or `make` and `make install` from source | Homebrew, shell installer, prebuilt archives, `cargo install --locked gitty-cli` |

tig's install notes list `apt-get`, `dnf`, `pacman`, `apk`, `pkg` and `brew` commands. Building it from source needs git, ncurses, a C compiler and make. gitty's own steps are on the [installation page](/docs/installation/).

## What tig does well

tig's README describes it as "an ncurses-based text-mode interface for git" that "functions mainly as a Git repository browser, but can also assist in staging changes for commit at chunk level and act as a pager for output from various Git commands."

Two things follow from that description. Its stated focus is browsing a repository and reading the output of git commands, with staging as an addition. And its install notes cover more systems than gitty's: distribution packages, FreeBSD, and Windows through Git for Windows, which "comes bundled with tig".

## How gitty differs

gitty puts working-tree changes and history on equal footing. The **Changes** tab follows the file system and stages a file, a hunk or individual lines. You commit from a box in the same window, with amend and undo, and discard with a copy kept in the Trash. The **History** tab lists local and remote commits with their refs and shows each selected commit's files and a syntax-highlighted diff, unified or split.

It also fetches, pulls and pushes with progress shown in the app, searches the full history with `/`, and compares HEAD with any branch with `b`. As with other gitty features, writes go through `git` itself, so hooks and signing work as on the command line. [Using gitty](/docs/using-gitty/) walks through each tab.

gitty's documentation does not describe acting as a pager for other git commands.

## Setup and requirements

The two projects ask for different things at install time. tig's notes list git, ncurses and, for a source build, a C compiler and make, with optional readline and PCRE support for search and regular expressions. gitty's prebuilt binaries need `git` 2.30 or newer and a terminal with mouse reporting. On Linux, the prebuilt gitty binaries need glibc 2.35 or newer, which covers Ubuntu 22.04, Debian 12 and Fedora 36 and later. On older distributions you build gitty from source.

If you are unsure, check your platform against the table above first.

## Which should you pick?

- If you want a repository browser and a pager for git output, or you install tools from a distribution's own packages on a system gitty does not support, use tig.
- If you want to stage lines, commit and push from one window, with History and Changes as separate tabs, on macOS or Linux, use gitty.
