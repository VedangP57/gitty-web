---
title: "Why gitty reads the commit-graph"
description: "Why gitty reads git's commit-graph: a full history walk takes 24.8 ms with it and 721 ms without, measured on git/git."
date: 2026-10-07
kind: engineering
tags: ["commit-graph", "performance", "git internals"]
order: 18
---

On git/git, gitty's full history walk over the current branch and its upstream took 24.8 ms with a commit-graph and 721 ms without one. That is the baseline in gitty's `bench/README.md`, measured on 2026-10-02 on Apple Silicon running macOS, with a load average of about 28, which the notes call a noisy machine.

## What the commit-graph file holds

Git's documentation for the commit-graph file says it stores, for each commit, the commit object ID, the list of parents with their integer positions, the commit date, the root tree ID and a generation number. Commits are listed in lexicographic order of object ID, so each commit gets an integer position, and parents can be referred to by position instead of by looking up an object. The same page names the two costs it removes: decompressing and parsing commits, and walking the whole graph to satisfy topological order. The full description is in [git's commit-graph documentation](https://git-scm.com/docs/commit-graph).

gitty's walker is built around this. The module comment in `crates/gitty-core/src/history.rs` describes a commit-time ordered walk that is commit-graph native, with a fallback that decodes commits from the object database. History entries are `u32` values: either a commit-graph position, or a flagged index into commits that are not in the graph yet. The comment adds that the list is never topologically sorted, because a flat list only needs commit-time order.

## The git/git numbers

The repository is git/git: 85,887 commits and 1,010 refs, measured once without a commit-graph and once with one. The baseline marks the all-refs rows and the refs snapshot as warm.

| Operation                                 | No commit-graph | With commit-graph |
| ----------------------------------------- | --------------- | ----------------- |
| First 500 rows, branch and upstream scope | 30.6 ms         | 15.1 ms           |
| First 500 rows, all refs                  | 94.7 ms         | 11.8 ms           |
| Full walk, branch and upstream            | 721 ms          | 24.8 ms           |
| Full walk, all refs                       | 1,409 ms        | 19.2 ms           |

Decoding one row takes 2.8 µs without the graph and 2.8–15.9 µs with it. The row-decode figures are listed separately from the walk times above.

A later run on 2026-10-05, a release build on Apple Silicon with a load average of about 6, checked the all-refs rows again. Without a graph, the first 500 rows took 15.8 ms and the full walk took 443 ms. That run did not check those two figures against a budget, because walk budgets are checked only when the walk uses a commit-graph. With a graph, it measured 10.9 ms and 18.9 ms. The no-graph numbers differ between runs, and 1,409 ms and 443 ms are both in the notes, so treat the absolute values as run-dependent.

## The Linux kernel

The kernel benchmark uses a blobless clone with 1,484,291 commits and 945 refs, with a commit-graph present. In the 2026-10-02 baseline, the first 500 rows for the branch and upstream scope took 23.8 ms, and the full walk for that scope took 233 ms. For all refs, the first 500 rows took 27.6 ms and the full walk 268–307 ms. The budgets are under 50 ms for the first 500 rows and under 400 ms for the full walk, and these figures meet both.

## Repositories without a graph

When there is no commit-graph, the notes say the walk falls back to decoding from the object database. They give 1.4 s for a full all-refs walk on git/git. They also say gitty writes a commit-graph automatically on large repositories. The README sets the threshold: at least 10,000 commits or 20,000 index entries. It writes the graph with `git commit-graph write --reachable --changed-paths --split`, unless `auto_tune = false`, `core.commitGraph` is off, or the clone is shallow.

Writing the graph takes time. On git/git, `git commit-graph write --reachable --changed-paths` took 6.3 s. It runs on a maintenance thread, so the UI and the writer thread do not wait for it. That measurement is from the benchmark's network section, dated 2026-10-04.

## Limits of these figures

- **Machine.** The README's performance section says the measurements are from Apple Silicon (macOS). The first baseline ran on a loaded machine.
- **Cache.** The README's performance table is for a warm cache. On a cold page cache, the first kernel run after other I/O spent about 0.8–1.0 s in the refs step. That step is separate from the walk.
- **Scope.** The 24.8 ms and 721 ms figures are for the branch and upstream scope on git/git. The all-refs walk is a different row in the table.
- **Budgets.** `bench/run.sh` checks the walk budgets only when the walk uses a commit-graph.

To see how the thresholds and the `auto_tune` setting work, read [Keep a git TUI fast on very large repositories](/blog/git-tui-large-repositories/), and for what the walk feeds, [How to browse the history of a huge repository](/blog/browse-huge-repository-history/). The [configuration page](/docs/configuration/) lists `auto_tune`.

The source is at [github.com/VedangP57/gitty](https://github.com/VedangP57/gitty).
