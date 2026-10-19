---
title: "How to resolve merge conflicts in the terminal"
description: "Resolve merge, rebase, cherry-pick and revert conflicts in gitty: keep a side per block, stage the file, then continue or abort with m."
date: 2026-10-19
kind: howto
tags: ["conflicts", "merge", "rebase"]
order: 2
---

In gitty 0.2.0, a stopped merge, rebase, cherry-pick or revert shows in the top bar. Conflicted files sit at the top of the Changes tab. Select one, press `o`, `t` or `b` on each conflict block, stage the file with `Space`, then press `m` and `c` to continue.

**What you need:** gitty 0.2.0 or later, and a repository where a merge, rebase, cherry-pick or revert has stopped on conflicts.

## How you get here

You merged a branch from the branch picker (`B`, then `Ctrl-G`), a pull with `p` conflicted, or you started the operation in another terminal. gitty reads the state from the repository, so where it started does not matter.

The top bar shows the operation in the warning colour, with its conflict count:

- `MERGING topic · 2 conflicts`
- `REBASING feat · step 2/5 · 1 conflict`
- `CHERRY-PICKING` or `REVERTING`

## Steps

1. **Answer "Resolve now?".** A merge or pull that hits conflicts is left open, not reported as a failure, and gitty asks. `Enter` opens the Changes tab on the first conflicted file. `a` aborts, which puts the branch, index and files back as they were. `Esc` decides later: the operation stays open and `m` brings up the dialog. An operation started in another terminal does not ask: open the Changes tab yourself with `1`.

   What you should see: the Changes tab, with the conflicted files at the top of the list.

2. **Pick a file.** Each conflicted file shows its number of conflict blocks once gitty has read it, for example `a.txt (3)`. Select it. The right pane shows the file instead of a diff. Each block is drawn as two tinted sides under headers that name them, and the current block is highlighted. A diff3 base is shown dim.

3. **Read the side names.** git's "ours" and "theirs" swap roles when commits are replayed, so gitty names the sides after the operation:

   - merge: *Current* (your branch) and *Incoming* (the merged branch).
   - rebase: *Base branch* (what you rebase onto) and *Your commit* (its subject).
   - cherry-pick: *Current branch* and *Picked commit*.
   - revert: *Current branch* and *Without change* (the reverted commit).

   A rebase replays your commits on top of the base branch, so the checked-out side is the base and your commit is the one coming in. That is why "ours" means the other branch during a rebase. A revert is merged with the reverted commit as the base, so its second side is the code as it was without that commit. Taking it with `t` undoes the change in that block.

4. **Resolve each block.** These keys work while the file list has the focus:

   - `o` keeps the first side.
   - `t` takes the second side.
   - `b` keeps both, first side then second.
   - `n` and `p` (or `]` and `[`) move to the next and previous block. They wrap round.
   - `u` takes the last resolution of the file back, as long as the file is as gitty left it.
   - `e` opens the file in `$EDITOR` at the block.

   Each resolution is written atomically, and only over the text on screen. If the file changed on disk, gitty reloads it instead.

   What you should see: after the last block, gitty says "No conflicts left in a.txt; press Space to stage it".

5. **Stage the file.** Nothing is staged for you. Press `Space` on each resolved file.

6. **Continue.** Press `m`. In the dialog, `c` continues once no file conflicts any more. Until then, the dialog says why it is not available. No editor opens. A merge uses its prepared message, and a rebase, cherry-pick or revert keeps the commit's own message. Hooks run for the commit that finishes the step.

   What you should see: the top bar clears. If the next step of a rebase or cherry-pick conflicts too, gitty tells you and the bar shows the new count. Repeat from step 2.

To give up instead, press `m` and then `a`. gitty asks first, then restores the branch as it was before the operation. What the operation did is discarded.

## If you used "stash and merge"

If you merged with uncommitted changes and chose "stash and merge", your changes stay in the stash while the merge is open, as `gitty: auto-stash from <branch>`. Applying them onto conflicted files would mix the two. The question, the `m` dialog, the top bar (`changes in stash`) and the notices all remind you.

Finishing the merge with Continue leaves them in the stash: pop them yourself with `S`, then `p`. Aborting from the question or from `m` puts them back, unless the stash list changed in the meantime. [How to switch branches and stash changes in gitty](/blog/switch-branches-and-stash/) covers the stash list.

## Troubleshooting

**If `p` or `u` does something unexpected:** while a conflicted file is selected, `p` means previous conflict and `u` means undo the resolution. Select another file to pull or undo the last commit.

**If a block says "Ambiguous markers in this block: press e to edit it":** gitty could not tell the sides apart, for example because a line of `=======` sits inside the block. Fix it with `e`. Markers longer than seven characters, set with `conflict-marker-size` in `.gitattributes`, are understood.

**If the file has no markers at all:** binary files, a file one side deleted, and a file both sides added are explained in words. `o` and `t` ask before taking that side's whole file (or deleting the path), stage the result and keep a copy in the Trash. `b` needs markers, so it does not work here. Per-block resolution also skips symlinks, secret-looking files and files over 2 MiB. Open those with `e`.

**If you staged a file that still has markers:** staging works, with a notice. When you continue, gitty asks "Continue anyway?" before committing it.

**If Continue fails on a hook:** the operation stays open. The hook's output is in the error details, which `!` shows.

**If `p` refuses to pull:** while a merge or rebase is open, gitty refuses to pull and points you to `m`. Finish or abort the merge first.

## Related reading

The full reference is under [Resolving conflicts](/docs/using-gitty/#resolving-conflicts) and [Merges in progress](/docs/using-gitty/#merges-in-progress) in the docs. The [gitty 0.2.0 release post](/blog/gitty-0-2-0/) lists the other changes in this release. [How to force push safely with lease after an amend or rebase](/blog/force-push-with-lease/) helps when a rebase leaves your branch needing a force push.
