---
title: "How gitty draws the commit graph"
description: "How gitty lays out its commit graph: a port of lazygit's pipes, a streamed topological walk, spacer lines, and a fix for a merge at a branch tip."
date: 2026-10-19
kind: engineering
tags: ["commit graph", "rust", "git internals"]
order: 9
---

gitty's commit graph is laid out one commit at a time as `git rev-list --topo-order` streams commits in. The layout is a port of lazygit's `pkg/gui/presentation/graph` (graph.go and cell.go; MIT, Copyright (c) 2018 Jesse Duffield). It lives in `crates/gitty-core/src/graph.rs`. This post covers how the layout works, what gitty changed, and a bug it fixes that lazygit's layout has too.

## Two earlier attempts

The first version, on 2026-10-09, did not lay out lanes at all. It ran `git log --graph` and re-skinned git's ASCII art. Its module comment names the cost: "git keeps a graph's lane state inside the process, so a deeper page runs git from the top again".

The same day it was replaced with native lanes, then with the lazygit port, whose state is kept between rows so the graph grows as the walk does.

## The walk

`topo_walk` runs this:

```rust
let args = ["--no-optional-locks", "rev-list", "--topo-order", "--parents", "--stdin"];
```

Each line is a commit and its parents. The tips go in on stdin because, as a test notes, 30,000 ids are 1.2 MB of hex, past macOS's 1 MB argument limit. Another test checks that children come before parents, with and without a commit-graph file.

In `crates/gitty/src/exec.rs`, the worker lays out each commit as it arrives:

```rust
let mut lanes = gitty_core::graph::Lanes::new(head);
let walked = gitty_core::graph::topo_walk(&cli, &tips, &stale, &mut |id, parents| {
    chunk.push_laid_out(id, parents, &mut lanes);
```

Commits go into a private chunk that is published under a lock, 256 entries first and 4096 after that. `Lanes` holds the previous row's pipes, so the layout carries over between chunks and each row is ready with its commit id.

## Pipes

lazygit's model is a set of pipes per row. A pipe is a line from a commit to one of its parents: it starts in the commit's row, continues through the rows between, and terminates in the parent's row.

```rust
struct Pipe {
    from: Option<CommitId>,
    to: Option<CommitId>,
    from_pos: usize,
    to_pos: usize,
    kind: PipeKind,
    colour: u8,
    heavy: bool,
}
```

`PipeKind` is `Terminates`, `Starts` or `Continues`. `Lanes::next_pipes`, lazygit's `getNextPipes`, places the next commit and its pipes:

- **The commit's column.** A commit takes the column of the leftmost pipe that ends in it. A commit no pipe leads to, a branch tip, goes in a new column on the far right.
- **The first parent.** The commit's first-parent pipe starts in the commit's own column, so a branch runs straight down.
- **Further parents.** Each other parent of a merge gets a pipe in the leftmost free column: not a spot another pipe ends on or a continuing pipe passes through.
- **Continuing pipes.** A pipe to the right of the commit can move left into room that frees up.

A merge is a row with more than one `Starts` pipe, which is how `render` picks `◉` over `●`.

## Colours and the heavy line

lazygit colours a pipe by its commit's author; gitty colours by lane. A commit's first-parent pipe keeps the colour of the pipe it took its column from, and each other pipe of a merge opens a new one. `COLOURS` is 7, mapped by the UI to a palette from the theme's distinct hues. So a branch keeps one colour from top to bottom, and its label pills use it.

`Lanes::new(head)` records the checked-out commit. Each time the commit in `chain` is laid out, its first-parent pipe is marked `heavy` and `chain` moves to that parent. The renderer uses heavy glyphs (`┃`, `┛`) only where every line in a cell is the current branch's; a cell mixing heavy and thin strokes is drawn thin.

## Cells, packed

`render`, lazygit's `renderPipeSet`, turns a row's pipes into cells. gitty packs each cell into a `u16`: bits for `UP`, `DOWN`, `LEFT` and `RIGHT`, two bits of type (commit, merge or `HEAD`), three bits each for two colours, a `MORE` bit, and `HEAVY_V` and `HEAVY_H`. `box_chars` maps the four edge bits to a glyph: up and left only is `╯`, down and left only is `╮`.

`Rows` stores every row flat, one `u16` per column pair, with an end offset per row. A row stores at most `MAX_LANES`, 48 columns; past that the last stored cell gets `MORE`. If the commit's own column is past the cut, its symbol takes the last stored cell, so every row keeps its dot. The list draws the same rule at the pane's width and ends a cut row in `›`.

## Spacer lines

The spaced style draws a second line under each commit with only the lines going down. That is `Row::filler`: every cell with `DOWN` set becomes `│`, or `┃` when heavy. A root commit's pipe has no `to`, so `render` clears its `DOWN`. The spacer needs no storage of its own.

## The tip merge bug

Commit `f372340`, "Keep a tip merge's second parent line out of its own column", fixed a case the port had copied. A merge at a branch tip takes a new column on the right, which no pipe ends in, so it was never marked taken. With no column to its left free, the search for the second parent's column could return the commit's own. The two pipes overlapped, one was dropped on the next row, and the parent later turned up as a tip of its own. The commit message says lazygit has the same bug.

The fix is one more condition, `i != pos`:

```rust
let available = (0..).find(|&i| i != pos && !taken.has(i) && !traversed_by_continuing.has(i)).expect("a free spot");
```

With no free column to the left, the second parent now takes the next column to the right. A new test lays out a checked-out `A` beside a branch whose tip `M` merges `Y` into `X`:

```
◎
┃ ◉─╮
┃ │ ●
┃ ● │
●─┴─╯
```

Two more cover an octopus merge at a tip and a tip with a free column to its left.

## Tests

The unit tests port lazygit's `TestRenderCommitGraph`, `TestRenderPipeSet` and `TestGetNextPipes` case by case. `lazygit_look` swaps gitty's symbols back to lazygit's `○` and `◎`, so the expected strings carry over unchanged.

Two property tests generate random histories in topological order and check every row: one symbol per commit, a line from each commit to each parent, every pipe from the row above either ending in this commit or going on, and no two lines going down in one column. The last two checks arrived with the tip merge fix, along with a second generator. That generator, `tippy_dag`, makes about half the commits tips and allows up to four parents. A shrunk failing case is saved in `proptest-regressions/graph.txt` as `parents = [[], [2, 3], [], []]`: a root, then a tip that merges two more roots.

## Topological order and the commit-graph file

The layout assumes no parent comes before its children, so the graph view lists git's topological order. gitty's own walker in `history.rs`, used with the graph off, stays in commit-time order: "Never topo-sorted", says its module comment.

Without a commit-graph file, git sorts the whole history before printing the first commit: about a third of a second per 100,000 commits, by the README. With the file, the first rows show at once. gitty's auto-tune writes it with `git commit-graph write --reachable --changed-paths --split` on repositories with at least 10,000 commits or 20,000 index entries. [Why gitty reads the commit-graph](/blog/why-gitty-reads-the-commit-graph/) covers what that file holds.

## Related reading

[How to read gitty's commit graph](/blog/read-the-commit-graph/) is the user's side of this post, [gitty 0.2.0](/blog/gitty-0-2-0/) lists the rest of the release, and [The lock that starved the UI thread](/blog/the-lock-that-froze-the-ui/) covers the chunks.

The source is at [github.com/VedangP57/gitty](https://github.com/VedangP57/gitty).
