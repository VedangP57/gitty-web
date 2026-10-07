---
title: "What is a git TUI, and when should you use one?"
description: "A git TUI is a full-screen git client that runs inside your terminal. What it is, how it differs from a GUI, and when it is the better tool."
date: 2026-10-07
kind: guide
tags: ["git tui", "terminal git client", "git"]
order: 1
---

A TUI, short for text user interface, is a full-screen program that runs inside a terminal and is driven by the keyboard and, in some cases, the mouse. A git TUI applies that idea to git: it is a git client that draws your history, your changes and your branches in the terminal window, so you can browse and act on them without typing a separate command for each step.

If you have used a graphical git client, the experience will feel familiar. If you have only used the git command line, think of it as a live view of the same repository, with the commands bound to keys.

## How a git TUI differs from the command line

With plain git, you ask for information one question at a time. You run a command to see the status, another to see the log, another to see a diff, and you read the output as it scrolls past. Each answer is a snapshot, and it goes stale as soon as something changes.

A git TUI keeps that information on screen. You see the list of commits, the files that changed and the diff for the selected file at the same time, and you move between them with a keypress. The state is shown continuously instead of being requested each time.

The underlying repository is the same. A TUI is a different way to look at it and to operate it, not a different version control system.

## How it differs from a GUI

A graphical git client is a separate desktop application. A TUI runs where your shell, your editor and your remote sessions already are. That has a few practical effects:

- You do not leave the terminal window to inspect a repository.
- It works over SSH, because it only needs a terminal, not a desktop.
- It is driven mostly from the keyboard, which suits people who already live in a terminal.

Many TUIs, gitty included, also support the mouse. You can click to select and scroll panes, so the choice is not strictly keyboard against mouse.

## What a git TUI is good at

Three situations stand out.

**Staying open next to your editor.** A TUI in a split or a second tab becomes a status board for the work you are doing. You edit in one pane, switch to the other to review what changed, stage it and commit.

**Working on a remote machine.** When the code lives on a server you reach over SSH, a terminal program is already available and a desktop application is not.

**Keyboard-first staging and history browsing.** Reviewing a diff, choosing which lines belong in a commit, and walking back through older commits are all repeated actions. Keys make repeated actions quick.

## When something else is the better tool

A git TUI is not the answer to every situation.

- If you prefer working with the mouse in a graphical window, a GUI client will suit you better.
- If you only run one or two git commands a day, the command line is already enough.
- gitty runs on macOS and Linux. If you work on another platform, it is not an option today.

It also assumes a reasonably capable terminal. gitty needs a terminal with mouse reporting, and it uses truecolor where the terminal supports it and the nearest 256-color entry elsewhere.

## Where gitty fits

gitty is a terminal git client written in Rust with Ratatui, aimed at the GitHub Desktop experience: a History view, a Changes view, line staging, fetch, pull and push, plus search and compare.

The window has two tabs. **History** shows local and remote commits with their refs, and marks what is ahead of or behind the upstream. Select a commit, or a range of them, and you get its files and a syntax-highlighted diff, either unified or split.

**Changes** shows the status of your working tree and follows the file system. You can stage a file, a hunk or individual lines, discard changes with a copy kept in the Trash, and write a commit in a box with options to amend the last commit or undo it.

Beyond those two tabs, gitty fetches, pulls and pushes with progress shown inside the app, and prompts for passwords or passphrases there too. `/` searches the whole history while you keep working, and `b` compares your current commit with any branch.

One design choice matters for trust. gitty runs `git` for everything that writes to your repository and reads with gitoxide. Because of that, your hooks, commit signing, credential helpers and git config work the same way they do on the command line.

The [Using gitty](/docs/using-gitty/) page walks through each tab and its keys, and [Installation](/docs/installation/) lists every way to install it and the requirements.

## Try it

On macOS or Linux, install gitty with Homebrew:

```sh
brew install vedangp57/tap/gitty
```

Use the full name, which tells Homebrew to trust this one formula from the tap. Then run `gitty` in any repository, or pass a path with `gitty path/to/repo`. Press `?` inside the app to see every key.

If you would rather read first, start with [Using gitty](/docs/using-gitty/). If you are ready to try it, the [installation page](/docs/installation/) has the shell installer, prebuilt archives and the crates.io option as well.
