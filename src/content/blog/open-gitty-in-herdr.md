---
title: "Open gitty in a herdr popup"
description: "Install gitty's herdr plugin, bind it to a key, and open gitty in a popup on the focused pane's repository. What it installs and how to fix it."
date: 2026-10-19
kind: howto
tags: ["herdr", "plugin", "workflow"]
order: 8
---

gitty 0.2.0 ships a plugin for [herdr](https://herdr.dev) that opens gitty in a popup on the repository of the pane you are in. Install it with `herdr plugin install VedangP57/gitty/herdr-plugin`, bind its action to a key, and press that key from any pane. The plugin uses the gitty you already have. If there is none, it downloads the latest release into its own folder and checks it against the published SHA-256 first.

**What you need:** herdr 0.9.3 or newer on macOS or Linux, and `git` 2.30 or newer on your `PATH`. gitty itself is optional, because the plugin can fetch it.

## Install the plugin

1. Run:

   ```sh
   herdr plugin install VedangP57/gitty/herdr-plugin
   ```

2. Open your herdr config and add a key binding for the plugin's action:

   ```toml
   [[keys.command]]
   key = "prefix+g"
   type = "plugin_action"
   command = "vedangp57.gitty.open"
   description = "gitty"
   ```

   `prefix+g` is the README's suggestion. Any free key works; the part that must match is `command = "vedangp57.gitty.open"`.

3. Change into a git repository in one of your panes and press the key.

What you should see: a popup that covers most of the herdr window, with gitty open on that pane's repository. Press `q` to quit gitty and close the popup.

## What the plugin does

The plugin has two small shell scripts, and both are short enough to read before you install.

When you press the key, the first script works out which folder to open. It takes the current folder of the focused pane. If herdr does not report one, it uses the workspace's folder, and failing that your home folder. It then opens the popup and passes the folder along.

Inside the popup, the second script looks for a gitty binary. It checks, in order:

- every folder on your `PATH`;
- Homebrew's folders: `/opt/homebrew/bin`, `/usr/local/bin` and `/home/linuxbrew/.linuxbrew/bin`;
- `~/.cargo/bin`, where cargo and the shell installer put it, and `~/.local/bin`;
- the plugin's own state folder.

The explicit folders matter because a popup may not get the same `PATH` as your shell. A gitty installed with Homebrew or cargo is found either way.

If none of those has gitty, the script downloads the latest release archive for your machine from GitHub, along with its published SHA-256 checksum. It compares the two and refuses the download if they do not match. A verified binary goes into the plugin's state folder and is used from there. The script prints that folder's path while it downloads. The temporary download folder is removed afterwards, and nothing else on the system changes.

Once it has a binary, the script runs gitty on the folder. If gitty exits with an error, the popup stays open and waits for `Enter`, so you can read why.

## Troubleshooting

**The key does nothing.** Check that the plugin is installed and that the binding says `command = "vedangp57.gitty.open"` with `type = "plugin_action"`. The plugin asks for herdr 0.9.3 or newer.

**The popup says "is not a git repository".** gitty opened a folder outside any repository. This happens when the focused pane is not in a repository, or when herdr does not report the pane's folder and the plugin falls back to the workspace folder or your home folder. The plugin also skips a folder whose path contains a quote or a backslash and falls back the same way. Press `Enter` to close the popup, change into the repository in the pane, and try again.

**"No gitty release for" your system.** The plugin downloads for macOS on Apple Silicon or Intel, and Linux on x86_64 or arm64. Elsewhere, build gitty from source and put it in one of the folders above.

**"The download failed."** The script needs `curl` and network access to GitHub, plus `tar` with xz support to unpack the archive. Install gitty yourself instead, for example with `brew install vedangp57/tap/gitty`, and the plugin will use that copy. The popup waits for `Enter` before it closes.

**"The download does not match its published SHA-256; not using it."** The archive and its checksum disagreed, so the script deleted both and installed nothing. Try again later, or install gitty yourself.

**The downloaded gitty does not start on Linux.** The prebuilt Linux binaries need glibc 2.35 or newer, which means Ubuntu 22.04, Debian 12, Fedora 36 or later. On an older system, build gitty from source with `cargo install --locked gitty-cli` and the plugin will find it in `~/.cargo/bin`.

**gitty exits at once with an error.** The popup stays open so you can read it. A common cause is a `git` older than 2.30 on the `PATH` the popup sees.

**The popup runs an older gitty than your shell.** The plugin downloads only when it finds no gitty, and it does not update the copy it downloaded. If you installed gitty later, the plugin uses that instead, since your `PATH` and the usual folders come first. To refresh the downloaded copy, delete `gitty` from the folder the script printed, and the next press downloads the latest release.

## Related reading

The release notes are in [gitty 0.2.0](/blog/gitty-0-2-0/), and [Install gitty on macOS and Linux](/blog/install-gitty-macos-linux/) covers the other ways to install it. The [In herdr](/docs/using-gitty/#in-herdr) section of Using gitty has the same setup in reference form.
