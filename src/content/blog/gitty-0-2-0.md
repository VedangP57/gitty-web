---
title: "gitty 0.2.0: commit graph, conflict help, branches and a Files tab"
description: "gitty 0.2.0 adds a commit graph, conflict resolution, a branch picker, stashes, a Files tab, pull request badges, force push with lease and 12 themes."
date: 2026-10-19
kind: guide
tags: ["release", "changelog", "gitty 0.2.0"]
order: 1
---

gitty 0.2.0 was released on October 19, 2026. History draws a commit graph, a stopped merge or rebase can be resolved and finished inside gitty, branches and stashes have pickers, and a Files tab browses the working tree. This post covers every changelog item and ends with how to upgrade.

## A commit graph in History

History shows a commit graph by default. `●` marks a commit, `◉` a merge and `◎` the checked-out commit. Each branch keeps one theme colour from top to bottom, its labels are pills in that colour, and the current branch's line is drawn heavy (`┃`). The lane layout is ported from [lazygit](https://github.com/jesseduffield/lazygit) (MIT).

A spacer line under each commit carries only the branch lines down to the next one; `history_graph_style = "compact"` drops it. `L` shows or hides the graph, and `history_graph = false` starts with it hidden. The graph steps aside during a search, a `V` range, compare mode, and in a History pane under 34 columns. Lines wider than the pane are cut with `›`.

[How to read gitty's commit graph](/blog/read-the-commit-graph/) explains each symbol, and [How gitty draws the commit graph](/blog/how-gitty-draws-the-commit-graph/) covers the layout code.

## Conflict help

Conflicted files now head the Changes list with their number of conflict blocks. Selecting one shows each block as two tinted sides under headers named for the operation: Current and Incoming in a merge, Base branch and Your commit in a rebase, Current branch and Picked commit in a cherry-pick, and Current branch and Without change in a revert.

`o` keeps the first side, `t` the second and `b` both. `n` and `p` move between blocks, `u` takes the last resolution back, and `e` opens your editor there. A resolution is written atomically and only over the text that was shown. Conflicts without markers, such as a binary file, are explained and settled whole after asking. Nothing is staged for you. The marker parser is adapted from [druk](https://github.com/letstri/druk) (MIT).

## Stopped operations in the top bar, and `m`

A merge, rebase, cherry-pick or revert that stopped, in gitty or another terminal, shows in the top bar with its conflict count: `MERGING topic · 2 conflicts` or `REBASING feat · step 2/5 · 1 conflict`. Press `m` to continue it once nothing conflicts, or to abort it after a question. Continue opens no editor: the prepared message is used.

## "Resolve now?"

A merge or pull that hits conflicts is left open, and gitty asks "Resolve now?". `Enter` goes to the first conflicted file, `a` aborts, and `Esc` decides later, after which `m` opens the dialog. [How to resolve merge conflicts in the terminal](/blog/resolve-merge-conflicts-in-terminal/) walks through a full merge.

## Branch picker and stashes

`B` opens a branch picker:

- `Enter` switches. A remote-only branch gets a local tracking branch.
- `Ctrl-N` creates, `Ctrl-R` renames and `Ctrl-D` deletes, asking twice when the branch has unmerged commits, as git judges it.
- `Ctrl-G` merges the highlighted branch into the checked-out one after asking.

With uncommitted changes, switching offers "stash and switch" and merging "stash and merge". After a successful switch the changes stay in the stash, as `gitty: auto-stash from <branch>`, for you to apply or pop; gitty puts them back only if the switch fails, or when you abort a conflicted "stash and merge".

`S` opens the stash list: `a` applies, `p` pops, `d` drops after asking, and `n` stashes the current changes under a message. `Z` in the Changes tab stashes with an optional message. Stashes include untracked files, and the prompts say so. See [How to switch branches and stash changes](/blog/switch-branches-and-stash/).

## A Files tab

`3` opens the Files tab: the working tree as a lazily loaded tree with a read-only, syntax-coloured viewer. Changed files show their Changes letter, folders with changes below them a `●`. `i` hides or shows ignored files (`files_show_ignored` sets the start), and `e` opens the file in `$EDITOR`. Files named like secrets, such as `.env`, keys and tokens, are not read until you press `v`. [How to browse files without reading secrets](/blog/browse-files-without-reading-secrets/) lists what counts as a secret.

## Pull request badge and `R`

The top bar shows `PR #<n>` when the branch has a GitHub pull request, coloured by its state: open, draft, merged or closed. Themes can set `pr_open`, `pr_draft`, `pr_merged` and `pr_closed` under `[ui]`. Clicking it opens the pull request. It needs the `gh` CLI logged in and ignores pull requests from forks.

`R` opens the branch's pull request in the browser, or the new-pull-request page when there is none or `gh` is missing. The branch must be pushed first. See [How to see a branch's pull request in the terminal](/blog/see-pull-request-in-terminal/).

## Force push with lease

A push rejected because the remote moved on, after an amend or a rebase, now offers a force push with lease. The question lists the remote commits it would remove. The lease is the commit you last fetched, so git refuses if anyone pushed since. `main`, `master` and the branch `origin/HEAD` points to are never force pushed. [How to force push safely with lease](/blog/force-push-with-lease/) has the details.

## Twelve more themes

0.2.0 adds `nord`, `one-dark`, `one-light`, `gruvbox-light`, `catppuccin-frappe`, `catppuccin-macchiato`, `tokyo-night-storm`, `tokyo-night-day`, `kanagawa`, `everforest-dark`, `ayu-mirage` and `nightfox`, for 23 built-in themes. `T` opens the picker with a live preview; [How to change gitty's theme](/blog/change-gitty-theme/) covers custom themes.

## A herdr plugin

gitty ships a [herdr](https://herdr.dev) plugin that opens gitty in a popup on the focused pane's repository. Without a gitty installed, it downloads a checksum-verified release binary. [How to open gitty in herdr](/blog/open-gitty-in-herdr/) shows the install command and key binding.

## Changed

- **Topological order.** With the graph shown, which is the default, History lists commits in topological order (`git rev-list --topo-order`) instead of by date. `L` or `history_graph = false` brings the date order back. On a large repository without a commit-graph file, the first rows wait for git's sort, about 0.3 s per 100,000 commits. Auto-tune writes that file on repositories with 10,000 commits or more.
- **`p` and `u` on a conflicted file.** While a conflicted file is selected in Changes, `p` means previous conflict and `u` undoes the resolution. Elsewhere they still pull and undo the last commit.

## Fixed

- Sideways scrolling (`h` and `l`, the sideways wheel, Shift+wheel) in the diff and the Files viewer only happens when a line is wider than the pane, and stops at the end of the widest line. `‹` and `›` mark lines with text hidden on the left or right.
- In compare mode the footer labels `b` "other branch" instead of "branch".
- The footer no longer shows the hints of the pane underneath while a picker, prompt or confirmation is open.
- Outside a repository gitty prints `gitty: <dir> is not a git repository`, without the internal source path.

## How to upgrade

Upgrade with the tool you installed with. With Homebrew:

```sh
brew upgrade vedangp57/tap/gitty
```

The shell installer always fetches the latest release, so running it again upgrades:

```sh
curl --proto '=https' --tlsv1.2 -LsSf https://github.com/VedangP57/gitty/releases/latest/download/gitty-cli-installer.sh | sh
```

From crates.io, run the install again. The package is `gitty-cli` and the command is `gitty`:

```sh
cargo install --locked gitty-cli
```

Every release's changes are on the [changelog page](/docs/changelog/), and [Installation](/docs/installation/) covers the requirements.
