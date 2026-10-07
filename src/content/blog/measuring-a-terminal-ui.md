---
title: "How we measure a terminal UI end to end"
description: "How gitty measures a terminal UI end to end: a screen emulator, event timestamps, and a benchmark script that fails when a budget is missed."
date: 2026-10-07
kind: engineering
tags: ["benchmarking", "testing", "tui"]
order: 20
---

gitty's terminal UI is measured by running the real binary inside a pseudo-terminal, reading the screen it produces through a `pyte` terminal emulator, and recording timestamps for the events inside it. Separately, a script, `bench/run.sh`, checks latency budgets and exits non-zero when one is missed. This post describes each piece as `bench/README.md` and the source record them, and how to run the parts yourself.

## What is measured, and at which layer

The benchmark notes measure at several layers, and each has its own tool.

The core library is timed by a probe program, `crates/gitty-core/examples/probe`, which `bench/run.sh` builds in release mode with thin LTO. It times history walks, file lists, diffs, ahead/behind counts and status against real repositories. Criterion micro-benchmarks are available through `GITTY_BENCH_REPO=<repo> cargo bench -p gitty-core`.

Frame drawing has its own criterion bench, `cargo bench -p gitty-cli --bench frame`. It draws a 220×60 frame of a 300-commit fixture, with history, a file list and a highlighted 3,000-line Rust diff. The notes give 0.52 ms for it (criterion mean 0.515 ms, slowest of 200 frames 0.63 ms) against the keypress-to-frame budget of under 16 ms. The bench exits 2 on a miss.

The whole application is measured end to end. The "TUI end to end" section, dated 2026-10-04, describes a release build in a 200×50 pty with a warm cache, driven by a `pyte` screen emulator. The network section, dated the same day, used a 140×30 pty, also with `pyte`, against a local bare remote. It drove fetch, a diverged pull, push, a password prompt answered through the askpass trampoline, and cancel on a hanging remote. In that run, pressing `f` put progress in the top bar in 38 ms, against a budget of under 100 ms, and `x` produced "Fetch cancelled" in 7 ms, against under 1 s.

## The startup probe

An end-to-end harness has to behave like a terminal. At startup, gitty writes a query sequence to the terminal that includes a DA1 request, in `crates/gitty/src/term.rs`, and waits for the reply. The benchmark notes say the emulated terminal answers the startup probe, DA1, "as a real one does". gitty's wait is capped by a 150 ms timeout in `run.rs`.

## Event timestamps with GITTY_TRACE

The screen emulator tells you what is on screen. To see when things happened inside the program, there is `GITTY_TRACE=<file>`. When the variable is set, gitty writes a line per event with a timestamp in milliseconds since start. The macro that does it is in `crates/gitty/src/run.rs`:

```rust
    let mut trace = std::env::var_os("GITTY_TRACE").and_then(|p| std::fs::File::create(p).ok()).map(BufWriter::new);
    let started = Instant::now();
    macro_rules! trace {
        ($($a:tt)*) => {
            if let Some(t) = trace.as_mut() {
                let _ = writeln!(t, "{:>9.3} {}", started.elapsed().as_secs_f64() * 1e3, format_args!($($a)*));
            }
        };
    }
```

The event loop calls it for each draw, with how long the draw took, and for each message it handles. The notes say these timestamps, together with the emulator, supplied the first-frame and history-walk milestones. The clock starts at the `Instant` shown above.

For timing individual worker requests apart from the UI, the notes point to `cargo run --release -p gitty-cli --example trace -- <repo>`, which "times each worker request in isolation".

## Budgets that fail the run

The budgets come from the project's spec, and the README lists them next to the measured values, for example under 16 ms for the first frame and under 400 ms for the kernel's full history walk. `bench/run.sh` turns a budget into a pass or a failure. It passes `--check` to the probe, and each budget prints `budget <what>: <measured> < <budget> ok|MISSED`. The script exits 1 when any budget is missed, and the probe itself exits 2. Setting `GITTY_BUDGET_SCALE=0.0001` forces a miss, which is how the notes say the failure path was proved.

Two rules keep the checks honest. The script runs a warm-up walk first, because the budgets are for a warm cache. And walk budgets are checked only when the walk uses a commit-graph, which gitty writes on large repositories. In the notes, the no-graph figures are marked "not checked".

## Running it yourself

From a checkout of gitty, run `bench/run.sh <repo>...` with one or more repositories. Add `BLOBLESS=<repo>` for history-only checks on a blobless clone, where diffs cannot load. The script ends with "All budgets met." or exits 1 and says which were missed. The figures on this site came from Apple Silicon running macOS, so a different machine will give different numbers.

If you want to see what the kernel run looks like in practice, read [How a Rust TUI draws its first frame in 14 ms](/blog/first-frame-14-ms/), and for another measured result, [The lock that starved the UI thread for about 350 ms](/blog/the-lock-that-froze-the-ui/). The [installation page](/docs/installation/) covers getting gitty itself.

The source is at [github.com/VedangP57/gitty](https://github.com/VedangP57/gitty).
