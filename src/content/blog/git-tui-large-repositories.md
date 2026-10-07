---
title: "Keep a git TUI fast on very large repositories"
description: "Why git tools slow down on big repositories, how gitty tunes git and uses the commit-graph, and what to check if history feels slow."
date: 2026-10-07
kind: guide
tags: ["performance", "large repositories", "commit-graph"]
order: 4
---

On a large repository, gitty's history walk is slowest when there is no commit-graph, because it has to decode commits from the object database. The fix that matters most is a commit-graph. gitty writes one for you once a repository reaches 10,000 commits or 20,000 index entries, and its own benchmarks show the difference on the git/git repository. This guide explains what gitty does, what the numbers look like, and what to check if a repository still feels slow.

## What makes history slow

Showing history means walking the commits. Without a commit-graph, gitty's walk falls back to decoding commits from the object database. The benchmark notes record this for git/git, which has 85,887 commits and 1,010 refs: a full walk over all refs takes 1.4 seconds without a commit-graph.

Status is the other thing gitty tunes for. It sets the untracked cache and, where git supports it, fsmonitor, to make status faster.

## What gitty does on its own

When a repository has at least 10,000 commits or 20,000 index entries, gitty tunes git once, in the background. It does this unless you set `auto_tune = false` in your config. The tuning does two things:

- It writes a commit-graph with `git commit-graph write --reachable --changed-paths --split`. It skips this when `core.commitGraph` is off or the clone is shallow.
- It sets `core.untrackedCache`. It also sets `core.fsmonitor`, but only where your git has the builtin fsmonitor daemon. That means macOS and Windows builds, and most Linux packages do not have it. Both are for faster status, and gitty never overwrites a key you have already set.

The keys gitty sets are recorded in `gitty.tuned`. If you want them gone, `gitty untune [PATH]` unsets exactly those keys, skips any you have since changed, and leaves everything else alone.

## What the commit-graph changes

The figures below come from gitty's `bench/README.md`. They were measured on 2026-10-02 on Apple Silicon running macOS, with a load average of about 28, so the machine was noisy. The repository is git/git, once without a commit-graph and once with one:

| Operation | No commit-graph | With commit-graph |
|---|---|---|
| First 500 rows, all refs (warm) | 94.7 ms | 11.8 ms |
| Full walk, all refs (warm) | 1,409 ms | 19.2 ms |
| Full walk, branch and upstream | 721 ms | 24.8 ms |

A later run on 2026-10-04 on a release build, with a warm cache, gave a full history walk of 617 ms without a commit-graph and 30 ms with one. A run on 2026-10-05 measured 443 ms and 18.9 ms for the full walk over all refs. The absolute numbers move from run to run, but in every run the walk is far faster with the graph.

For the Linux kernel, a blobless clone with 1,484,291 commits and a commit-graph present, the README reports the full history walk at 225 to 258 ms, and the first 500 history rows at 23 ms. gitty draws its layout first, in 14 ms on the first frame, and streams history in afterwards. Those kernel figures are for a warm cache. On a cold page cache, the first run after other disk activity spent roughly 0.8 to 1.0 seconds in the refs step on the kernel.

Writing the graph costs something once. On git/git, `git commit-graph write --reachable --changed-paths` took 6.3 seconds, run on a maintenance thread so that neither the UI nor the writer thread waits for it.

## If a repository still feels slow

Work through this checklist:

1. **Check the thresholds.** Auto-tuning starts at 10,000 commits or 20,000 index entries. A smaller repository will not be tuned, which also means it will not have been given a commit-graph by gitty.
2. **Check that `auto_tune` is not false.** It defaults to `true`, but a `false` in `~/.config/gitty/config.toml` turns tuning off.
3. **Check that the commit-graph exists.** gitty skips writing one when `core.commitGraph` is off or the clone is shallow. In both cases, history walks fall back to decoding from the object database.
4. **Check for a cold cache.** The first run after other heavy disk activity is slower than later runs, as the benchmark notes show.
5. **On Linux, check the inotify limit.** If a repository has more directories than `fs.inotify.max_user_watches` allows, gitty opens it with a notice and refreshes when the terminal regains focus, rather than live. This affects the Changes view, not history.

The [configuration page](/docs/configuration/) lists `auto_tune` and every other key, and describes `gitty untune`.
