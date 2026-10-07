---
title: "gitty vs lazygit"
description: "How gitty and lazygit differ in language, workflow and setup, and where lazygit is the better fit. Based on each project's own documentation."
date: 2026-10-07
kind: comparison
tags: ["lazygit", "comparison", "git tui"]
order: 6
---

gitty and lazygit are both terminal git clients, and both stage individual lines. They differ in language, in how wide a set of git operations they document, and in the layout they are built around. lazygit is written in Go and lists operations such as interactive rebase, cherry-pick and bisect. gitty is written in Rust and is organized around a History tab and a Changes tab, modeled on GitHub Desktop. Choose by the workflow you want on screen.

Facts about lazygit here come from its README on GitHub, read on 2026-10-07. Facts about gitty come from its own README and documentation. gitty is written by the author of this site, so read the lazygit side from lazygit's own pages as well.

## The facts

| | [lazygit](https://github.com/jesseduffield/lazygit) | gitty |
|---|---|---|
| Written in | Go | Rust, with Ratatui |
| Platforms | macOS, Linux, Windows, FreeBSD | macOS (Apple Silicon or Intel), Linux (x86_64 or arm64) |
| License | MIT | MIT |
| Install | Binary releases, Homebrew, distribution package managers, Scoop, Chocolatey, Winget, `go install` | Homebrew, shell installer, prebuilt archives, `cargo install --locked gitty-cli` |

The [gitty installation page](/docs/installation/) has the details for each method.

## What lazygit does well

lazygit's README describes it as "a simple terminal UI for git commands" and lists what it covers: staging hunks or individual lines, interactive rebase, cherry-pick, bisect, amending an old commit, custom commands, worktrees, undo, a commit graph and comparing two commits. Its README documents Windows and FreeBSD as well as macOS and Linux.

If your daily git work includes rewriting history, picking commits across branches or running your own commands from inside the interface, that list is the strongest argument for lazygit. gitty's documentation does not describe interactive rebase, cherry-pick or bisect.

## How gitty differs

gitty is built around two tabs rather than a menu of operations.

- **History** shows local and remote commits with their refs, and marks what is ahead of or behind the upstream. Selecting a commit, or a range with `V`, shows its files and a syntax-highlighted diff, unified or split.
- **Changes** follows the file system. You stage a file, a hunk or single lines with `Space`, discard with a copy kept in the Trash, and commit from a box with amend and undo.

Around those tabs, gitty fetches, pulls (fast-forward, merge or rebase) and pushes with progress and cancel, asks for passwords or passphrases inside the app, searches the whole history with `/`, and compares HEAD with any branch with `b`. Every key can be rebound in `config.toml`, and there are eleven built-in themes plus your own.

On the git side, gitty runs `git` for everything that writes to the repository and reads with gitoxide, so hooks, signing, credential helpers and your git config behave as they do on the command line. See [Using gitty](/docs/using-gitty/), [Keys](/docs/keys/) and [Themes](/docs/themes/).

## Where they overlap

Both projects let you stage individual lines instead of whole files, both are installable with Homebrew, and both are released under the MIT license. The practical question is which interface you want to look at while you work.

One setup difference is worth knowing before you install. lazygit's README lists `go install` as one route, and gitty's lists `cargo install --locked gitty-cli`, which needs Rust 1.90 or newer and a C compiler. Most people will use the Homebrew formula or a prebuilt binary instead, which needs neither toolchain. gitty also expects `git` 2.30 or newer on your `PATH` and a terminal with mouse reporting.

## Which should you pick?

Pick by workflow.

- If you want one interface for history rewriting, cherry-picking and custom commands, or you work on Windows, start with lazygit.
- If you want the layout of a graphical client, with a commit history on one tab and a working-tree status on the other, on macOS or Linux, try gitty.
- If you are not sure, install both and open the same repository in each.
