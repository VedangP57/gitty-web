---
title: "Browse your working tree without reading your secrets"
description: "gitty's Files tab shows the working tree with git marks and a read-only viewer, and keeps files named like secrets unread until you press v."
date: 2026-10-19
kind: howto
tags: ["files", "secrets", "working tree"]
order: 7
---

Press `3` in gitty to open the Files tab. It shows the working tree as a tree that loads each folder when you open it, with the same change letters as the Changes tab and a read-only, syntax-coloured viewer on the right. Files whose names look like secrets, such as `.env` or a private key, are marked `(secret)` and are not read from disk until you press `v`. The masking is by name only and covers the Files tab only, so it is a guard against showing a secret by accident, not a security boundary.

**What you need:** gitty 0.2.0 or newer and a repository to look at.

## Browse the tree

1. Press `3`. The tree shows the top level of the working tree.
2. Move with `j` and `k`, or the arrow keys. Open a folder with `Enter` or `l`. `h` closes a folder, or moves to its parent when you are inside one.
3. Select a file. The viewer shows it with line numbers and syntax colours. It is read-only.
4. Press `Tab` to move into the viewer and scroll. `h` and `l` scroll sideways there, but only when a line is wider than the pane.

What you should see: folders open one level at a time. A folder is read only when you open it, so a large tree costs nothing until you go into it.

A few kinds of entry are handled differently:

- Symlinks show as `name -> target` and are never followed.
- Submodules and nested repositories are leaves. You cannot open them from here.
- Files over 2 MiB and binary files are not loaded. The viewer says so, and `e` still opens them in your editor.

## Read the change marks

Changed files carry the letter and colour they have in the Changes tab, in the last column: `M` for modified, `A` for added or untracked, `D` for deleted, `R` for renamed and `U` for conflicted.

A folder with anything changed below it shows a `●`, even when it is folded. That lets you see which folders hold changes without opening them. When a folder holds several kinds of change, the dot takes the colour of the strongest, in this order:

1. conflicted
2. deleted
3. modified, which here includes added and renamed
4. untracked

A file deleted from the work tree, or renamed away, is not listed under its old name. Its old folders are still marked as deleted, so you can find where it was.

## Show or hide ignored files

Ignored files and folders are listed by default and drawn dimmed. Press `i` to hide them, and again to bring them back. Folders you have opened stay open when you toggle.

To start with them hidden, set this in `~/.config/gitty/config.toml`:

```toml
files_show_ignored = false
```

## Open a file in your editor

Press `e`, or double-click the file, to open it in `$EDITOR` (or `$VISUAL`). gitty splits the variable like shell words but never runs it through a shell, and passes the path as a separate argument. If neither is set, gitty asks you to set one.

`e` also works on a file marked `(secret)`. That is your own editor, on your own machine, and gitty treats it as a deliberate choice.

## How secret masking works

When you select a file whose name looks like a secret, the viewer shows "Hidden: this looks like a secret file. Press v to reveal." It does not show the size or the line count either. Nothing is read from disk at that point.

The README lists the names that count. In summary:

- `.env` and its variants: `.env.*`, `.env-*`, `*.env` and `.envrc`. Only the exact names `.env.example`, `.env.sample`, `.env.template` and `.env.dist` are shown normally.
- Private keys and certificates: `*.pem`, `*.key`, `*.p12`, `*.pfx`, `*.jks`, `*.keystore`, `*.ppk`, `*.gpg` and the SSH `id_*` keys.
- Password stores and tokens: `*.kdbx`, `.netrc`, `.npmrc`, `.pypirc`, `.pgpass`, `.htpasswd`, `.git-credentials`, `.vault-token`, `credentials*`, `secrets.*`, `*.token`, `*.secret` and `service-account*.json`.
- Terraform `*.tfvars` and `*.tfstate`.
- Anything inside `.ssh`, `.aws`, `.gnupg`, `.kube`, `secrets` or `.env` folders, and `.docker/config.json`.

Case does not hide a match, and neither do trailing dots and spaces or backup and editor suffixes such as `~`, `.bak`, `.orig` and `.swp`. So `.ENV`, `.env.bak` and `.env~` are all masked.

## Reveal a secret on purpose

1. Select the file marked `(secret)`.
2. Press `v`.

What you should see: the file's contents in the viewer, as for any other file. Press `v` again to hide it.

The reveal ends by itself when you select another file or leave the tab. It is never saved, so the next time you open gitty the file is masked again.

## The limits

The masking is useful, but it has clear edges, and the README states them:

- **The match is by name.** A secret stored under an innocent name, say `config.txt`, is shown like any other file. So is a hard link to a secret file, and a name that only looks like a secret name through Unicode lookalike characters.
- **Masking applies to the Files tab only.** An untracked `.env` still appears in the Changes tab, and selecting it there shows its contents in the diff.

The second point matters most when you share your screen. If a secret file is untracked and not ignored, it is in Changes, and its diff is not masked. Adding it to `.gitignore` keeps it out of Changes. It still shows in the Files tab, dimmed and masked, unless you hide ignored files with `i`.

## Troubleshooting

**A file you expected to be masked is shown.** Check its name against the list above. Masking is by name, and a name outside the list is treated as an ordinary file.

**A file you need to read is masked.** Press `v`, or open it with `e`. If it is an example file, the exact names `.env.example`, `.env.sample`, `.env.template` and `.env.dist` are not masked; other spellings are.

**The viewer is empty for a large file.** Files over 2 MiB and binary files are not loaded. Press `e` to open them in your editor.

**Ignored files are missing.** Press `i`, or check `files_show_ignored` in your config.

## Related reading

The release notes are in [gitty 0.2.0](/blog/gitty-0-2-0/). [How to stage a single line in a git TUI](/blog/stage-a-single-line/) covers the Changes tab, where masking does not apply. The [Files](/docs/using-gitty/#files) section of Using gitty and the [configuration page](/docs/configuration/) have the reference details.
