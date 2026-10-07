---
title: "The lock that starved the UI thread for about 350 ms"
description: "The history walker held a write lock for the whole walk, about 350 ms on the kernel. How gitty fixed it and the test that guards it."
date: 2026-10-07
kind: engineering
tags: ["concurrency", "rust", "bug"]
order: 19
---

While gitty's end-to-end benchmark was being measured, the history walker was found holding the history write lock for the whole walk. That starved the UI thread for the length of the walk, about 350 ms on the Linux kernel. The walker now walks into a private chunk and takes the lock only to publish it, and a regression test, `walk_never_starves_readers`, checks that a reader never waits long. This post walks through that bug and its fix using gitty's `bench/README.md` and source.

## How the history is shared

When a walk starts, the worker thread sends the UI a handle to a history list wrapped in a read-write lock. The code for this is in `crates/gitty/src/exec.rs`, and the list is an `Arc<RwLock<History>>`. The UI reads it to draw the commit list. Search reads it too: a search request takes the read lock to copy out a range of ids. Many readers can hold a read lock at once, but a writer excludes them all.

That is the shape of the problem. The walker is the writer, and the UI thread is a reader that needs the lock on every frame that shows commit rows. If the writer holds the lock for the whole walk, a reader waits until the walk ends.

## The symptom

The "TUI end to end" section of `bench/README.md` records the finding under "Fixed during measurement": the walker held the history write lock while walking, which starved the UI thread for the length of the walk. The note gives about 350 ms on the kernel. The figure comes from the benchmark's kernel repository, a blobless clone with 1,484,291 commits, measured on 2026-10-04 in a release build.

The changelog has no entry for it. The same section's table lists the full history walk on the kernel at 263 ms. The notes do not reconcile that figure with the 350 ms.

## The fix

The walker no longer walks into the shared list. It walks into a private chunk and holds the lock only to publish the chunk. This is the loop body in `crates/gitty/src/exec.rs`:

```rust
                // walk into a private chunk; hold the lock only to publish it
                let mut chunk = walker.new_history();
                let more = walker.step(h, &mut chunk, if len == 0 { WALK_FIRST_CHUNK } else { WALK_CHUNK });
                {
                    let mut shared = history.write().unwrap_or_else(PoisonError::into_inner);
                    shared.append(&mut chunk);
                    len = shared.len();
                }
```

The expensive part, `walker.step`, runs on the private chunk with no lock held. The write lock is taken only around `append`. The doc comment on `History::append` in `crates/gitty-core/src/history.rs` says what it does: it moves the other list's entries to the end of `self`, leaving the other empty, and "lets a walker fill a private chunk and publish it under a lock in microseconds".

The append has one piece of bookkeeping. Entries that point into the overflow list, the commits not in the commit-graph, carry an index that must be shifted by the length of the shared overflow list. `append` does this while it moves them. A separate test in `crates/gitty-core/tests/history.rs`, `append_chunks_matches_single_walk`, covers the chunked walk.

The chunk sizes are constants. The first chunk is 256 entries and later ones are 4096, with a comment saying the first is small so the first screen of rows appears quickly even without a commit-graph.

## The regression test

`walk_never_starves_readers`, in `crates/gitty/tests/exec.rs`, builds a repository with 30,000 commits using `git fast-import`. It starts a walk, and when the `HistoryStarted` message arrives with the shared history, it starts a reader thread. For up to 300 milliseconds, the reader takes the read lock, reads the length, and records how long taking the lock took. It sleeps 200 microseconds between reads, and it stops early once it sees all 30,000 entries. After joining the reader, the test asserts that the worst wait was under 5 ms.

The test measures how long a reader waits for the lock while a walk is running. It does not time the walk. Its failure message reads "a reader waited ... for the history lock", and the comment above the test says the UI thread reads the shared history while the walker runs and must never wait long.

## What the sources show

The benchmark notes record that the walker held the write lock while walking and that the UI thread was starved for the length of the walk, about 350 ms on the kernel. The code now publishes each chunk under a short lock, and the test asserts a worst-case wait under 5 ms with 30,000 commits.

Related reading: [How a Rust TUI draws its first frame in 14 ms](/blog/first-frame-14-ms/) covers the streaming design this fix belongs to, and [Why gitty reads the commit-graph](/blog/why-gitty-reads-the-commit-graph/) covers the walk itself. The [using gitty page](/docs/using-gitty/) describes the History tab.

The source is at [github.com/VedangP57/gitty](https://github.com/VedangP57/gitty).
