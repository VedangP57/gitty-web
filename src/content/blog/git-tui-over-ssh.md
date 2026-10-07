---
title: "Use a git TUI over SSH"
description: "A terminal git client works wherever you have a shell. How to run gitty on a remote machine and what to check before you do."
date: 2026-10-07
kind: guide
tags: ["ssh", "git tui", "remote"]
order: 3
---

A git TUI is a good fit for remote work because it is a terminal program. If you can open a shell on the server, you can run it there, with no display or desktop session involved. This guide covers running gitty that way: what the remote host needs, one Linux detail worth checking in advance, and a short routine.

The docs do not describe an SSH-specific mode, and none is needed. You install gitty on the remote host and run it in the shell you already have.

## Install it on the remote host

gitty has to be installed where the repository is. Use any of the methods on the [installation page](/docs/installation/), the same as on your own machine. For a Linux server the options are:

- Homebrew, with `brew install vedangp57/tap/gitty`.
- The shell installer, which puts a prebuilt binary in `~/.cargo/bin`.
- A prebuilt archive from the Releases page.
- `cargo install --locked gitty-cli`, which needs Rust 1.90 or newer and a C compiler.

Before you pick one, check the requirements on the host:

- The host must run macOS or Linux, on a supported CPU: Apple Silicon or Intel for macOS, x86_64 or arm64 for Linux.
- `git` 2.30 or newer must be on the `PATH` of the account you log in with.
- The prebuilt Linux binaries need glibc 2.35 or newer. That includes Ubuntu 22.04, Debian 12 and Fedora 36 and later. On an older distribution, build from source.

If you are building from source on the server, the C compiler requirement applies there too.

## What your terminal has to provide

gitty needs a terminal with mouse reporting. It uses truecolor where the terminal has it and the nearest 256-color palette entry elsewhere. The docs say nothing more specific than that about terminals, so if something looks wrong, start by checking those two things.

Press `?` inside gitty to see every key. Two keys always apply: Ctrl-C quits and Ctrl-Z suspends.

## The inotify limit on Linux hosts

On Linux, gitty refreshes the Changes view live by watching every directory of the worktree with inotify. The kernel caps how many watches a user can have through `fs.inotify.max_user_watches`, and the README notes this is often 8,192 on older kernels.

If a repository has more directories than that limit allows, gitty still opens it. It shows a notice and falls back to refreshing when the terminal regains focus, instead of refreshing live. So on a repository with many directories, a notice at startup is the thing to look for.

## A short working routine

1. Connect with `ssh` as you normally do and change into the repository.
2. Run `gitty`. It opens the repository that contains the current directory. You can also run `gitty path/to/repo` from anywhere.
3. Read the History tab to see local and remote commits, and which are ahead of or behind the upstream. Switch to Changes to stage files, hunks or lines.
4. Commit from the commit box. Fetch, pull and push from inside gitty. Progress shows in the app, and password or passphrase prompts appear there too.
5. Quit when you are done. Per-repository UI state, such as pane sizes, is kept under `~/.local/state/gitty/`.

Because gitty runs `git` for everything that writes to the repository, the hooks, commit signing, credential helpers and git config on the remote host apply, as they do when you type `git` commands there. Your gitty settings are read from `~/.config/gitty/config.toml`.

gitty also fetches in the background every few minutes, and the `auto_fetch_minutes` setting changes that interval. Setting it to `0` turns background fetching off. The [configuration page](/docs/configuration/) lists every key.

## Next steps

Install it on the host you use most and open a repository there. [Using gitty](/docs/using-gitty/) covers each tab, and [Keybindings](/docs/keys/) lists every key if you want to rebind any.
