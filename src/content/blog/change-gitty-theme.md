---
title: "How to change gitty's theme, or write your own"
description: "Switch gitty's theme live, choose from the 11 built-in themes, or write your own theme file with a custom palette."
date: 2026-10-07
kind: howto
tags: ["themes", "configuration", "customization"]
order: 16
---

Press `T` in gitty for a theme picker with a live preview, and press `Enter` on a theme to save the choice as your `theme` setting. You can also set `theme` yourself in `~/.config/gitty/config.toml`.

**What you need:** gitty installed and a terminal you can open it in.

## Switch themes live

1. Press `T` to open the picker.
2. Look at the live preview. You see each theme applied to your own repository before you commit to it.

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

The picker's `Enter` saves your choice as the `theme` setting. To set it by hand, edit the config file, which lives at `~/.config/gitty/config.toml`, or at `$XDG_CONFIG_HOME/gitty/config.toml` when that variable is set:

```toml
theme = "rose-pine"
```

The default is `theme = "auto"`. It picks a light or dark theme by the terminal background, which suits you if you switch your terminal between light and dark. Every key in the config is optional, and unknown keys and bad values are reported at startup and fall back to the default.

Colors are truecolor where the terminal supports it and the nearest xterm-256 entry elsewhere, so the same theme appears on a 256-color terminal with the nearest colors.

## Write your own theme

Start small. Inherit from the built-in theme closest to what you want, override one color, and look at the result in gitty before you add more. Because `inherit` layers your file over the other theme, anything you leave out keeps the inherited value, and you can add overrides one at a time.

A theme is a TOML file at `~/.config/gitty/themes/<name>.toml`. It names a `[palette]` and, if you want, inherits from another theme so you only override what differs. The smallest useful theme is two or three lines:

```toml
inherit = "github-dark"

[palette]
accent = "#ff79c6"
```

Save it as `~/.config/gitty/themes/mine.toml` and set `theme = "mine"` in your config. The file name without `.toml` is the name you give to `theme`.

The example has three parts. `inherit = "github-dark"` layers the file over the built-in `github-dark`. The `[palette]` table holds the colors, and `accent = "#ff79c6"` is written as a quoted hex string. Only the accent differs from `github-dark`, so everything else keeps the inherited value, and a theme like this is three lines instead of a full palette.

### Palette keys

Eleven palette keys are required: `bg`, `fg`, `muted`, `accent`, `border`, `red`, `green`, `yellow`, `blue`, `magenta` and `cyan`. Two are optional: `panel` and `orange`.

The themes page marks the first eleven as required. With `inherit = "<theme>"`, your file is layered over another theme, which is why a personal theme is usually two or three lines. The `emph_alpha` setting in the config, from 0.0 to 1.0, sets the strength of the changed-word highlight, and by default it follows the theme.

## Choosing between auto and a fixed theme

With `theme = "auto"`, gitty follows the terminal background and picks a light or dark theme. A fixed name pins the choice. To get a specific palette such as `tokyo-night` or `gruvbox-dark`, name it. Your own themes work the same way, because `theme` takes a theme name.

## Pick a theme at launch

The installation page shows a command-line form: `gitty --theme dracula` starts gitty with that theme.

## If the theme does not apply

The config page says unknown keys and bad values are reported at startup and fall back to the default. Read that startup report first, and check the theme file path against `~/.config/gitty/themes/<name>.toml`.

## More

The [themes page](/docs/themes/) is the reference for names and palette keys, and the [configuration page](/docs/configuration/) lists the config keys. [What is a git TUI?](/blog/what-is-a-git-tui/) places gitty among other terminal tools.
