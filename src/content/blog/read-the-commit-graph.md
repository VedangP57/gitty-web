---
title: "How to read gitty's commit graph"
description: "What the dots, corners, heavy line and colours in gitty's commit graph mean, how to switch it to compact or off, and when it steps aside."
date: 2026-10-19
kind: howto
tags: ["commit graph", "history", "branches"]
order: 3
---

Open the History tab with `2` and the graph is the column to the left of the commit subjects. `●` is a commit, `◉` a merge and `◎` the commit you have checked out. `╮` is where a merge brings a branch in, `╯` is where a branch joins back, and the heavy `┃` line is your current branch. `L` hides the graph and lists commits by date instead.

**What you need:** gitty 0.2.0 or newer, and a repository with at least one branch or merge so there is something to draw.

## The symbols

| Symbol | Meaning                                                          |
| ------ | ---------------------------------------------------------------- |
| `●`    | a commit                                                         |
| `◉`    | a merge commit (more than one parent)                            |
| `◎`    | the checked-out commit                                           |
| `╮`    | a merge brings a branch in: its second parent's line starts here |
| `╯`    | a branch joins back into the commit on this row                  |
| `┃`    | the current branch: the checked-out commit's first-parent line   |
| `›`    | the row is wider than the pane and was cut here                  |

Each commit keeps the single line it has in a plain list: subject, author, age and labels. The graph only adds columns to the left.

## Read a branch and a merge

1. Press `2` to open the History tab. The graph is on by default.
2. Find the `◎`. That is the commit you have checked out. Follow the heavy line down from it: every commit on that line is on your current branch, following first parents.
3. Find a `◉` with a `╮` to its right. The line that leaves the `╮` goes down to the merge's second parent, the tip of the branch that was merged in. The commits on that line belong to that branch.
4. Follow that line down until it ends in a `╯`. That row is the commit the branch started from, where it joins the line on its left.

What you should see: a branch's commits stay together in one column, because the graph lists commits in topological order (see below). Its line keeps one colour from top to bottom.

## Colours and labels

Each branch keeps its theme colour from top to bottom. Its labels are pills in that colour: solid for a local branch, coloured text for a remote one, so a label reads as the branch it names. Tags keep their own style. The colours come from your theme, so `T` and a different theme change them. [How to change gitty's theme](/blog/change-gitty-theme/) covers that.

## Spaced or compact

By default the graph is spaced. Each commit has its line, and a spacer line under it carries only the graph's lines down to the next commit, so the dots of a branch are joined. The selection highlights only the commit's line, not its spacer.

For one line per commit, set this in `~/.config/gitty/config.toml`:

```toml
history_graph_style = "compact"
```

In compact style, comfortable `density` (`z`) gives each commit two lines; in spaced style `density` adds nothing. Any value other than `"spaced"` or `"compact"` gives a warning at startup and keeps `"spaced"`.

## Turn the graph off

1. Press `L` to hide the graph. History is walked again and lists commits by date. The selected commit stays selected.
2. Press `L` again to bring the graph back, in topological order.
3. To start without it, set `history_graph = false` in the config.

What you should see: with the graph hidden, the graph column is gone and the order changes from topological to date.

## Topological order or date order

With the graph shown, History lists commits in topological order, from `git rev-list --topo-order`. A branch's commits stay together and no parent is listed above its children, and the graph's layout is built for that order. With the graph hidden, the list is by date, as it was before 0.2.0. If you want the newest commits across branches interleaved by time, press `L`.

`r` still switches between the branch and its upstream, and all branches and tags. The graph draws whichever set is in view.

## When the graph steps aside

The graph is only drawn over the plain history. It steps aside:

- during a search (`/`);
- while you select a range of commits (`V`);
- in compare mode (`b`);
- in a History pane narrower than 34 columns.

If you press `L` in a pane that is too narrow, gitty says "Graph hidden: the History pane is narrower than 34 columns". Widen the pane with `>`, or make the terminal wider.

## The `›` cut

The graph gets the pane's width minus the room the marker, subject and date need. When a row's lines are wider than that, the row is cut and ends in `›`. If the cut would hide the commit's own dot, the dot is drawn at the cut instead, so every row still shows its commit. A repository with many branches open at once is where you see this most.

## Large repositories

On a large repository without a commit-graph file, the first rows wait for git to sort the whole history before it can list them in topological order. gitty's README gives about a third of a second per 100,000 commits on its test machine. With a commit-graph file the rows show at once. gitty's auto-tune writes that file on repositories with 10,000 commits or more, unless `auto_tune = false`. If the first rows are slow and you would rather not wait, `L` switches to the date order, which does not need the sort.

## Troubleshooting

- **No graph at all.** Check that a search, range or compare is not active (`Esc` ends them), that the pane is at least 34 columns wide, and that `history_graph` is not `false`.
- **Rows end in `›`.** The pane is narrower than the graph. Widen it with `>` or hide the graph with `L`.
- **The order changed after upgrading.** That is the topological order that comes with the graph. `L` or `history_graph = false` restores date order.

Press `?` in gitty for every key.

## Related reading

[How gitty draws the commit graph](/blog/how-gitty-draws-the-commit-graph/) explains the layout behind these symbols. [How to browse the history of a huge repository](/blog/browse-huge-repository-history/) covers the walk on large repositories, and [How to review a range of commits](/blog/review-a-commit-range/) covers `V`. The History tab is described in [Using gitty](/docs/using-gitty/), and the graph settings are on the [configuration page](/docs/configuration/).
