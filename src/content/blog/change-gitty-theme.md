---
title: "How to change gitty's theme, or write your own"
description: "Switch gitty's theme live, choose from the 11 built-in themes, or write your own theme file with a custom palette."
date: 2026-10-07
kind: howto
tags: ["themes", "configuration", "customization"]
order: 16
---

Press `T` in gitty for a theme picker with a live preview. To keep a theme, set `theme` in `~/.config/gitty/config.toml`.

**What you need:** gitty installed and a terminal you can open it in.

## Switch themes live

1. Press `T` to open the picker.
2. Move through the list. The picker has a live preview, so the preview changes as you go, so you can judge each theme on your own repository.
3. Choose the one you want.

What you should see: colors across the History and Changes tabs change to the theme you picked. Highlighting stores capture names rather than colors, so switching themes never re-highlights anything.

## The 11 built-in themes

The themes page lists these names:

- `github-dark` and `github-light`
- `rose-pine` and `rose-pine-dawn`
- `catppuccin-mocha` and `catppuccin-latte`
- `tokyo-night`
- `dracula`
- `gruvbox-dark`
- `solarized-dark` and `solarized-light`

The README says they reproduce the palettes of Catppuccin, Dracula, GitHub, Gruvbox, Rosé Pine, Solarized and Tokyo Night.

## Keep a theme in the config

The picker is for trying themes. To make a choice stick, set `theme` in your config file, which lives at `~/.config/gitty/config.toml`, or at `$XDG_CONFIG_HOME/gitty/config.toml` when that variable is set:

```toml
theme = "rose-pine"
```

The default is `theme = "auto"`. It picks a light or dark theme by the terminal background, which suits you if you switch your terminal between light and dark. Every key in the config is optional, and unknown keys and bad values are reported at startup and fall back to the default. If you misspell a theme name, expect a startup message and the default instead of a crash.

Colors are truecolor where the terminal supports it and the nearest xterm-256 entry elsewhere, so a theme still works on a terminal with fewer colors.

## Write your own theme

Start small. Inherit from the built-in theme closest to what you want, override one color, and look at the result in gitty before you add more. Because `inherit` layers your file over the other theme, anything you leave out keeps the inherited value, and you can add overrides one at a time.

A theme is a TOML file at `~/.config/gitty/themes/<name>.toml`. It names a `[palette]` and, if you want, inherits from another theme so you only override what differs. The smallest useful theme is two or three lines:

```toml
inherit = "github-dark"

[palette]
accent = "#ff79c6"
```

Save it as `~/.config/gitty/themes/mine.toml` and set `theme = "mine"` in your config. The `theme` setting takes a theme name, so a file's name is what you put there.

### Palette keys

Eleven palette keys are required: `bg`, `fg`, `muted`, `accent`, `border`, `red`, `green`, `yellow`, `blue`, `magenta` and `cyan`. Two are optional: `panel` and `orange`.

If you do not use `inherit`, the file has to supply all eleven required keys. With `inherit = "<theme>"`, your file is layered over another theme, which is why a personal theme is usually two or three lines. The `emph_alpha` setting in the config, from 0.0 to 1.0, sets the strength of the changed-word highlight, and by default it follows the theme.

## If the theme does not apply

The config page says unknown keys and bad values are reported at startup and fall back to the default. Read that startup report first, and check the theme file path against `~/.config/gitty/themes/<name>.toml`.

## Other settings that change how a diff looks

Three more config keys shape the diff. `tab_size` defaults to `4` and takes 1 to 16. `diff_algorithm` is `myers` or `histogram`. `whitespace` is `show`, `ignore-all` or `ignore-amount`, and `w` changes it while you read.

## More

Themes are documented on the [themes page](/docs/themes/), with the config keys on the [configuration page](/docs/configuration/). For other ways to personalize gitty, [the keybindings page](/docs/keys/) explains rebinding. [What is a git TUI?](/blog/what-is-a-git-tui/) and [Best git TUI clients](/blog/best-git-tui-clients/) place gitty among other terminal tools.
