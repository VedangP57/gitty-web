---
title: "Install gitty on macOS and Linux"
description: "Install gitty with Homebrew, the shell installer, a prebuilt archive or crates.io, then check it runs. Needs git 2.30 or newer on your PATH."
date: 2026-10-07
kind: guide
tags: ["install", "homebrew", "gitty"]
order: 2
---

The quickest way to install gitty is `brew install vedangp57/tap/gitty`. If you do not use Homebrew, there are three other routes: a shell installer, a prebuilt archive from the Releases page, or `cargo install` from crates.io. Whichever you pick, gitty needs `git` 2.30 or newer on your `PATH`.

This guide covers each method, how to confirm the install worked, and where to go afterwards.

## What you need first

gitty runs on macOS, on Apple Silicon or Intel, and on Linux, on x86_64 or arm64. gitty is built for macOS and Linux.

Three requirements apply regardless of how you install:

- `git` 2.30 or newer on your `PATH`.
- A terminal with mouse reporting. gitty uses truecolor where your terminal has it and the nearest 256-colour palette entry elsewhere.
- On Linux, the prebuilt binaries need glibc 2.35 or newer. That covers Ubuntu 22.04, Debian 12 and Fedora 36 and later. On an older system, build from source instead.

To see which version of git you have, run `git --version`.

## Homebrew

Homebrew works on both macOS and Linux:

```sh
brew install vedangp57/tap/gitty
```

Type the full name, including the tap. It tells Homebrew to trust this one formula from the tap.

## Shell installer

The shell installer downloads a prebuilt binary into `~/.cargo/bin`:

```sh
curl --proto '=https' --tlsv1.2 -LsSf https://github.com/VedangP57/gitty/releases/latest/download/gitty-cli-installer.sh | sh
```

Because the URL points at the latest release, this fetches the current version.

## Prebuilt archives

Every release has archives for each supported target on the [Releases page](https://github.com/VedangP57/gitty/releases).

On macOS, a binary downloaded through a browser is quarantined. Run this once to clear it:

```sh
xattr -d com.apple.quarantine gitty
```

## crates.io

gitty is published on crates.io as `gitty-cli`, because the name `gitty` was already taken there. The command you run is still `gitty`. You need Rust 1.90 or newer and a C compiler, which are used to build the bundled grammars and Oniguruma:

```sh
cargo install --locked gitty-cli
```

If you have a clone of the repository, you can install from it instead:

```sh
cargo install --locked --path crates/gitty
```

Building with `--no-default-features` leaves out the bundled tree-sitter grammars. The binary is much smaller, and syntax highlighting goes through the syntect fallback.

## Check that it works

gitty opens the repository that contains your current directory, so change into any git repository and run it:

```sh
cd path/to/some/repo
gitty
```

You can also pass a path, as in `gitty path/to/repo`. You should see the History and Changes tabs. The History tab is on `2` and the Changes tab on `1`, and `Tab` moves between panes. Press `?` to see every key, and quit with `q` or Ctrl-C.

If it will not start, check the requirements above first, starting with your `git` version.

## Other ways to start it

The same command takes a few forms. `gitty` opens the repository that contains the current directory, `gitty path/to/repo` opens a specific one, and `gitty --theme dracula` starts with a named theme. There is also `gitty untune [PATH]`, which undoes the git settings gitty changes when it tunes a large repository. The [configuration page](/docs/configuration/) explains when that happens.

Once it is running, the mouse works throughout the window. Click to select, scroll any pane, drag the diff gutter to pick lines, and Shift-click to choose a range of commits. Double-click a file or a diff line to open it in `$EDITOR` at that line.

## Updating

The docs do not describe a separate update command. The shell installer URL always points at the latest release, and each release has its own archives on the Releases page. If you installed with Homebrew or cargo, use that tool to get a newer version.

## Where to go next

[Using gitty](/docs/using-gitty/) walks through the History and Changes tabs and what you can do in each. [Keybindings](/docs/keys/) lists every key and explains how to rebind them in your config file.
