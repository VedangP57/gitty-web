---
title: "gitty vs gitui"
description: "How gitty and gitui differ in workflow and features, both written in Rust, and where gitui is the better fit. Based on each project's docs."
date: 2026-10-07
kind: comparison
tags: ["gitui", "comparison", "git tui", "rust"]
order: 8
---

gitui and gitty are both terminal git clients written in Rust, so the language is not what separates them. The difference is the workflow each documents. gitui lists keyboard-only control, context-based help, stashing, submodule support and staging at the file, hunk and line level. gitty is organized as a History tab and a Changes tab in the manner of GitHub Desktop, and also supports the mouse. Choose by the layout you want to work in.

Facts about gitui come from its README on GitHub, read on 2026-10-07. Facts about gitty come from its README and documentation. gitty is written by the author of this site.

## The facts

| | [gitui](https://github.com/gitui-org/gitui) | gitty |
|---|---|---|
| Written in | Rust | Rust, with Ratatui |
| Platforms | Linux, macOS, Windows, Android (Termux) | macOS (Apple Silicon or Intel), Linux (x86_64 or arm64) |
| License | MIT | MIT |
| Install | Package managers, release binaries, nightly builds, `cargo install gitui --locked` | Homebrew, shell installer, prebuilt archives, `cargo install --locked gitty-cli` |

gitty's crate is named `gitty-cli` because `gitty` on crates.io is another project; the command is still `gitty`. See the [installation page](/docs/installation/).

## What gitui does well

gitui's README lists the following features:

- "keyboard only control"
- "Context based help (no need to memorize tons of hot-keys)"
- "Stage, unstage, revert and reset files, hunks and lines"
- "Stashing (save, pop, apply, drop, and inspect)"
- "Push / Fetch to / from remote"
- "Browse / Search commit log"
- "Submodule support"

It documents more platforms than gitty, including Windows and Android through Termux. If you want stashing and submodule handling inside the interface, or you need a platform gitty does not support, gitui's README is where to start. gitty's documentation does not describe stashing or submodules.

## How gitty differs

gitty splits the window into **History** and **Changes**. History shows local and remote commits with their refs and ahead and behind marks, and each selected commit, or a `V` range of commits, opens its files and a syntax-highlighted diff, unified or split. Changes follows the file system and stages by file, hunk or line, discards with a copy kept in the Trash, and commits with amend and undo.

The mouse works throughout: click to select, scroll any pane, drag the diff gutter to pick lines. Fetch, pull and push show progress and take password or passphrase prompts inside the app. `/` searches history, `b` compares HEAD with a branch, and `?` lists every key, each of which can be rebound. gitty uses `git` for writes and gitoxide for reads. The [Keys](/docs/keys/) and [Using gitty](/docs/using-gitty/) pages cover the details.

## Setup and requirements

Both projects publish release binaries and can be installed through Cargo, and both are available from Homebrew. gitui's README lists a wider set of package managers, including Arch Linux, Fedora, MacPorts, Winget, Scoop and Nix. gitty's install routes are Homebrew, a shell installer that puts a prebuilt binary in `~/.cargo/bin`, prebuilt archives from the Releases page, and crates.io.

gitty needs `git` 2.30 or newer on your `PATH` and a terminal with mouse reporting. It uses truecolor where the terminal supports it and the nearest 256-color entry elsewhere, and ships with eleven built-in themes that you can extend with your own files under `~/.config/gitty/themes/`. Check gitui's README for its own requirements before you install it.

## Which should you pick?

- If you want a keyboard-only tool with stashing and submodule support, or you work on Windows, try gitui.
- If you want History and Changes as two tabs, with mouse support and a `V` range select for commits, on macOS or Linux, try gitty.
- Both can be installed with `cargo install`, so trying each on the same repository is straightforward.
