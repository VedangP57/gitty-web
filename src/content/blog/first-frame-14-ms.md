---
title: "How a Rust TUI draws its first frame in 14 ms"
description: "How gitty draws its layout in 14 ms and streams history in afterward, with the measurements and the design choices behind them."
date: 2026-10-07
kind: engineering
tags: ["performance", "rust", "ratatui", "startup"]
order: 17
---

gitty draws its layout in 14 ms on a warm cache, and that figure held on all three repositories in its benchmark: git/git without a commit-graph, git/git with one, and a blobless Linux kernel clone. The commit rows arrive afterward, streamed in as the history walk produces them. This post covers what was measured, how the startup is arranged to make that possible, and where the number stops applying.

## The budget and the measurement

The budget for the first frame is under 16 ms. The figures come from the "TUI end to end" section of gitty's `bench/README.md`, dated 2026-10-04: a release build, a 200×50 pty, and a warm cache. A `pyte` screen emulator drove the real binary, and `GITTY_TRACE` event timestamps (milliseconds since start) supplied the times. The emulated terminal answered the startup probe the way a real one does.

| Milestone                  | git (no graph) | git with commit-graph | Linux kernel (1.48M commits, blobless) |
| -------------------------- | -------------- | --------------------- | -------------------------------------- |
| First frame (layout drawn) | 14 ms          | 14–15 ms              | 14 ms                                  |
| First rows on screen       | 48 ms          | 48–85 ms              | 57–72 ms                               |
| Full history walk done     | 617 ms         | 30 ms                 | 263 ms                                 |

The slowest frame after the first one, on the kernel, was 5.8 ms, against the same budget of under 16 ms. The README's performance section repeats the 14 ms first-frame figure and the same budget.

One detail about the clock. In `crates/gitty/src/run.rs`, the trace clock starts at an `Instant` created after the terminal probe and setup, just before the event loop begins. The 14 ms is therefore a reading on that trace clock. The benchmark notes do not claim it as the time from launching the process.

## Draw first, stream after

The first frame does not wait for history. Commit rows come later, and the benchmark notes say why: on a cold cache the refs step is slow, so "the UI has to draw its layout first and stream rows in after". In the table above, the layout appears at 14 ms in every column, while rows appear between 48 ms and 85 ms.

The startup path in `crates/gitty/src/run.rs` shows the order. It turns on raw mode, sends the terminal probe, builds the terminal, and then runs the event loop, which draws whenever the app state is marked dirty. History is not part of that path. A worker thread walks it and sends progress messages, and each message makes the loop redraw with more rows.

The walk sends history in chunks, and the first chunk is deliberately small. This is from `crates/gitty/src/exec.rs`:

```rust
/// History entries appended per write-lock hold; the first chunk is small so the first screen
/// of rows appears quickly even without a commit-graph.
const WALK_FIRST_CHUNK: usize = 256;
const WALK_CHUNK: usize = 4096;
```

The first chunk is 256 entries and later chunks are 4096. The comment gives the reason: the first screen of rows should appear quickly even without a commit-graph. The benchmark shows that case too. Without a graph, rows appear at 48 ms.

## The startup probe

Before the first frame, gitty asks the terminal a few questions. In `crates/gitty/src/term.rs` it writes one sequence containing an OSC 11 background-colour query, a kitty keyboard protocol query, and a DA1 request (primary device attributes). The terminal's answer to DA1 matters because, as the code comment says, every terminal sends it. gitty reads replies byte by byte until the DA1 reply ends them or a timeout passes, so that keys typed after the replies stay queued for the input reader.

The timeout is `PROBE_TIMEOUT`, set to 150 milliseconds in `run.rs`. It bounds how long startup waits for a terminal that never answers. The benchmark README says the emulated terminal answers the probe as a real one does.

## What cold means

The warm-cache figures are not the whole story, and the benchmark notes say so plainly. On a cold kernel start, the first run after a build, rows appeared at about 1.0 s. The cold `refs()` call, at about 0.7 s, dominates that. The layout, the notes add, was already drawn at 14 ms. An earlier baseline, dated 2026-10-02, records 945 refs on the kernel, each peeled and with a header lookup, and a cold-cache first run spending roughly 0.8 to 1.0 s there. That baseline also lists a later optimisation, skipping `find_header` for refs that `packed-refs` records as peeled, as something still to do.

## What this does not claim

These numbers describe one setup: Apple Silicon running macOS, a release build, a 200×50 pty with an emulator in the loop. This post makes no claim beyond it. The cold start also shows that drawing early does not make the rows themselves arrive early: the layout was on screen at 14 ms, and the rows took about 1.0 s.

For the method behind these figures, read [How we measure a terminal UI end to end](/blog/measuring-a-terminal-ui/). For what happens to the rows on very large repositories, see [Keep a git TUI fast on very large repositories](/blog/git-tui-large-repositories/).

The source is at [github.com/VedangP57/gitty](https://github.com/VedangP57/gitty).
