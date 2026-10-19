---
title: "See your branch's pull request from the terminal"
description: "gitty's top bar shows PR #<n> for the checked-out branch, coloured by state. How to set it up with gh, open the PR with R, and what to check."
date: 2026-10-19
kind: howto
tags: ["pull requests", "github", "gh"]
order: 6
---

Since 0.2.0, gitty's top bar shows `PR #<n>` when the checked-out branch has a pull request on GitHub. The badge is coloured by the pull request's state, and a click on it opens the page in your browser. `R` does the same from the keyboard, or opens the new-pull-request page when there is none yet. The badge needs the `gh` CLI installed and logged in; without it, gitty leaves the badge out.

**What you need:** gitty 0.2.0 or newer, a repository with a GitHub remote, and the [`gh` CLI](https://cli.github.com/) logged in.

## How the badge works

gitty does not talk to GitHub itself. It asks `gh` which pull requests have the current branch as their head, on the repository the branch pushes to, and shows the newest one. That covers every state, so a merged pull request still shows after the remote branch was deleted.

The colour tells you the state at a glance:

- open: green
- draft: grey
- merged: purple
- closed: red

The lookup runs in the background, so the window never waits for it. The changelog gives the cadence: it is looked up at most every 30 seconds per branch, and every 5 minutes while the terminal is focused. A refresh of the branches, after a commit or a fetch or when the terminal regains focus, also asks again, within that limit.

Three details are worth knowing:

- Pull requests from forks are ignored. `gh` matches the branch name only, so a fork's pull request from a branch with the same name could otherwise show up as yours.
- A failed lookup keeps the last known badge. If `gh` is offline, logged out or slow to answer, gitty treats the state as unknown rather than gone.
- When you switch branches, the previous branch's badge is dropped at once. A detached HEAD has no badge.

## Set it up

1. Install the `gh` CLI. The [GitHub CLI site](https://cli.github.com/) lists the packages for each system.
2. Log in:

   ```sh
   gh auth login
   ```

   gitty runs `gh` with prompts disabled and no terminal attached, so it cannot log in for you. Do this once in a normal shell.

3. Check that `gh` can see the pull request from inside the repository:

   ```sh
   gh pr list --head your-branch --state all
   ```

4. Start gitty in the repository and check out a branch that has a pull request.

What you should see: `PR #` and the number in the top bar, after the branch name and its ahead and behind counts, in the colour for its state. The number is underlined, which marks it as clickable.

## Open the pull request

There are two ways to get to the page:

1. Click the badge. gitty opens the pull request in your browser.
2. Press `R` anywhere in the window.

`R` opens the branch's open pull request when `gh` finds one. When there is no open pull request, or no `gh`, it opens GitHub's new-pull-request page for the branch instead. So `R` also works as "open a pull request for this branch" right after a push.

The branch must be pushed first. If gitty cannot find the branch on its remote, `R` says "Push the branch first (P)". Press `P`, then `R` again.

What you should see: your browser opens on the pull request, or on the page to create one. gitty uses `open` on macOS and `xdg-open` elsewhere. If that command cannot be started, gitty shows "Could not open the browser, go to" followed by the address, so you can open it yourself.

## Change the badge colours

The four colours come from the theme. A theme file can set `pr_open`, `pr_draft`, `pr_merged` and `pr_closed` under `[ui]`. A personal theme that only changes these can inherit everything else:

```toml
inherit = "github-dark"

[ui]
pr_draft = "#8b949e"
pr_merged = "#a371f7"
```

Save it as `~/.config/gitty/themes/<name>.toml` and pick it with `T` or the `theme` setting. Without these keys, the badge uses the theme palette's green, muted, magenta and red. [How to change gitty's theme](/blog/change-gitty-theme/) covers theme files in more detail.

## Troubleshooting

**No badge at all.** Check that `gh` is on your `PATH` and logged in: run `gh auth status` in a shell. gitty gives up on `gh` if it does not answer within a few seconds, and it shows nothing rather than an error, so the badge is simply absent.

**No badge on this branch, but there is a pull request.** Check that it is not from a fork, because those are ignored. Check that the remote the branch pushes to is on `github.com`; other hosts are not supported, and `R` says "Only GitHub remotes are supported". Then check that `gh pr list --head <branch> --state all` lists it.

**The badge shows an old state.** The lookup runs in the background with the limits above, and a failed lookup keeps the last known badge. Wait for the next lookup, or switch focus away from the terminal and back to trigger a refresh.

**`R` opens the new-pull-request page although a pull request exists.** `R` opens an existing pull request only when it is open and `gh` can find it. For a merged or closed one, click the badge instead.

**`R` says "Push the branch first (P)".** The branch has no copy on its remote yet. Push it with `P`.

**Over SSH the browser does not open.** gitty starts the browser on the machine it runs on, not on the one you are typing at. On a server without `xdg-open`, gitty shows the address; copy it into your local browser.

## Related reading

The release notes are in [gitty 0.2.0](/blog/gitty-0-2-0/). If a push after an amend is rejected, [force push with lease](/blog/force-push-with-lease/) explains what gitty offers. The [Pull requests](/docs/using-gitty/#pull-requests) section of Using gitty and the [Themes](/docs/themes/) page cover the same ground in reference form.
