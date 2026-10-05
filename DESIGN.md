---
name: Jowie Trence Jurado — Portfolio Desktop
description: A portfolio presented as a faithful Ubuntu 26.04 (GNOME / Yaru) desktop in the browser.
colors:
  brand-orange: "#e95420"
  brand-fg: "#ffffff"
  accent-bark: "#787859"
  accent-sage: "#657b69"
  accent-olive: "#4b8501"
  accent-viridian: "#03875b"
  accent-prussian: "#308280"
  accent-blue: "#0073e5"
  accent-purple: "#7764d8"
  accent-magenta: "#b34cb3"
  accent-red: "#da3450"
  window: "#fafafa"
  headerbar: "#ebebeb"
  headerbar-backdrop: "#f2f2f2"
  view: "#ffffff"
  sidebar: "#ebebeb"
  fg: "#3d3d3d"
  fg-dim: "#6b6b6b"
  line: "rgb(0 0 0 / 0.1)"
  hover: "rgb(0 0 0 / 0.06)"
  press: "rgb(0 0 0 / 0.11)"
  secondary: "#e6e6e6"
  destructive: "#c7162b"
  window-dark: "#2c2c2c"
  headerbar-dark: "#303030"
  headerbar-backdrop-dark: "#2a2a2a"
  view-dark: "#242424"
  popover-dark: "#353535"
  fg-on-dark: "#f4f4f4"
  fg-dim-on-dark: "#b4b4b4"
  secondary-dark: "#3a3a3a"
  destructive-dark: "#ff5c6c"
  shell: "#fafafa"
  shell-fg: "#2e2e2e"
  shell-dark: "#2b2b2b"
  shell-card: "rgb(0 0 0 / 0.06)"
  shell-card-hover: "rgb(0 0 0 / 0.1)"
  panel: "rgb(14 14 14 / 0.92)"
  panel-fg: "#f7f7f7"
  dock: "rgb(26 26 26 / 0.78)"
  tooltip: "rgb(29 29 29 / 0.95)"
typography:
  display:
    fontFamily: "Montserrat Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(28px, 4vw, 40px)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Montserrat Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "28px"
    fontWeight: 700
    lineHeight: 1.25
    letterSpacing: "-0.02em"
  status-title:
    fontFamily: "Montserrat Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "22px"
    fontWeight: 700
  title:
    fontFamily: "Montserrat Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "14px"
    fontWeight: 700
  body:
    fontFamily: "Montserrat Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "14.5px"
    fontWeight: 500
    lineHeight: 1.625
  label:
    fontFamily: "Montserrat Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "13.5px"
    fontWeight: 700
  caption:
    fontFamily: "Montserrat Variable, ui-sans-serif, system-ui, sans-serif"
    fontSize: "13px"
    fontWeight: 400
  mono:
    fontFamily: "Ubuntu Mono, ui-monospace, monospace"
    fontSize: "13px"
    fontWeight: 400
rounded:
  sm: "6px"
  md: "8px"
  lg: "12px"
  xl: "14px"
  tile: "18px"
  card: "20px"
  popover: "24px"
  window: "12px"
  full: "9999px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "12px"
  lg: "16px"
  xl: "24px"
components:
  window-headerbar:
    backgroundColor: "{colors.headerbar}"
    textColor: "{colors.fg}"
    typography: "{typography.title}"
    rounded: "{rounded.window}"
    height: "46px"
  window-headerbar-backdrop:
    backgroundColor: "{colors.headerbar-backdrop}"
  title-button:
    backgroundColor: "rgb(61 61 61 / 0.09)"
    textColor: "{colors.fg}"
    rounded: "{rounded.full}"
    size: "24px"
  title-button-close-hover:
    backgroundColor: "{colors.brand-orange}"
    textColor: "{colors.brand-fg}"
  header-button:
    textColor: "{colors.fg}"
    rounded: "{rounded.lg}"
    height: "34px"
    padding: "0 8px"
  header-button-hover:
    backgroundColor: "{colors.hover}"
  button-suggested:
    backgroundColor: "{colors.brand-orange}"
    textColor: "{colors.brand-fg}"
    typography: "{typography.title}"
    rounded: "{rounded.lg}"
    height: "36px"
    padding: "0 16px"
  button-default:
    backgroundColor: "rgb(61 61 61 / 0.08)"
    textColor: "{colors.fg}"
    typography: "{typography.title}"
    rounded: "{rounded.lg}"
    height: "36px"
    padding: "0 16px"
  button-destructive:
    backgroundColor: "{colors.destructive}"
    textColor: "#ffffff"
    rounded: "{rounded.lg}"
    height: "36px"
  boxed-list:
    backgroundColor: "{colors.view}"
    rounded: "{rounded.xl}"
  row:
    typography: "{typography.body}"
    padding: "10px 16px"
    height: "54px"
  tag:
    backgroundColor: "rgb(61 61 61 / 0.07)"
    textColor: "{colors.fg}"
    rounded: "{rounded.md}"
    height: "24px"
    padding: "0 8px"
  quick-toggle:
    backgroundColor: "{colors.shell-card}"
    textColor: "{colors.shell-fg}"
    typography: "{typography.label}"
    rounded: "{rounded.full}"
    height: "52px"
  quick-toggle-active:
    backgroundColor: "{colors.brand-orange}"
    textColor: "{colors.brand-fg}"
  switch:
    rounded: "{rounded.full}"
    height: "26px"
    width: "48px"
  switch-checked:
    backgroundColor: "{colors.brand-orange}"
  shell-popover:
    backgroundColor: "{colors.shell}"
    textColor: "{colors.shell-fg}"
    rounded: "{rounded.popover}"
    padding: "12px"
  top-bar:
    backgroundColor: "{colors.panel}"
    textColor: "{colors.panel-fg}"
    height: "32px"
  top-bar-button:
    rounded: "{rounded.full}"
    height: "26px"
    padding: "0 12px"
  dock:
    backgroundColor: "{colors.dock}"
    width: "68px"
  dock-item:
    rounded: "{rounded.xl}"
    size: "54px"
  tooltip:
    backgroundColor: "{colors.tooltip}"
    textColor: "#ffffff"
    rounded: "{rounded.lg}"
    padding: "6px 12px"
---

# Design System: Jowie Trence Jurado — Portfolio Desktop

## Overview

**Creative North Star: "The Faithful Desktop"**

This portfolio desktop is not styled after Ubuntu; it is Ubuntu 26.04's Yaru look rebuilt in the browser, and the fidelity itself is the portfolio piece. Every surface answers to a GNOME or libadwaita original: the near-black top bar, the translucent left dock, the 46px headerbar with round title buttons, boxed lists, pill quick toggles, the Show Apps grid. Content lives in windows you open, never on a scrolling page.

The system is two-layered. The **shell** (top bar, dock, app grid, popovers, banners, session screens) floats over a full-bleed wallpaper with dark translucency and large soft radii. The **apps** sit inside windows on flat Yaru neutrals with hairline separators. One colour connects them: the live accent `--brand`, chosen by the visitor from Yaru's ten accents, which recolours wallpaper, suggested actions, toggles, switches, sliders, focus rings, selection and the close button on hover.

Density is desktop density: 13 to 15px text, 34 to 54px hit targets, 8 to 16px gaps. Light and dark styles are both first-class and swap the whole neutral set, shell included.

**Key Characteristics:**
- Faithful Ubuntu 26.04 / Yaru chrome, light and dark.
- One live accent (`--brand`) out of ten Yaru colours; everything else neutral.
- Montserrat everywhere; Ubuntu Mono only for terminal output and literal code.
- Shell surfaces translucent and dark; app surfaces flat and tonal.
- Containerless pixel-art app icons, procedural accent-painted wallpapers, ambient particles, and a sky that plays a sunrise or sunset when the style changes.
- Expo-out motion that disappears entirely under reduced motion or with Animations turned off.

## Colors

Yaru neutrals carry nearly every pixel; a single user-chosen accent is the only saturated voice.

### Primary
- **Ubuntu Orange** (brand-orange): the default value of `--brand`, the live accent. Suggested-action buttons, active quick toggles, checked switches, slider ranges, the focused-app dot in the dock, the close title button on hover, caret colour, text selection (38% mix) and focus rings (55% mix). The Resolute and Contour wallpapers and the Welcome app tile paint with it too.
- **The nine alternates** (accent-bark, accent-sage, accent-olive, accent-viridian, accent-prussian, accent-blue, accent-purple, accent-magenta, accent-red): the remaining Yaru accents from `src/os/theme.ts`. Any one of them can replace orange as `--brand`; they are values for the accent slot, not extra roles.
- **Brand foreground** (brand-fg): white text and icons on anything filled with `--brand`.

### Neutral
- **Window** (window / window-dark): the window body and app background.
- **Headerbar** (headerbar / headerbar-dark): the focused window's headerbar and the split-view sidebar. Unfocused windows drop to **Headerbar Backdrop** (headerbar-backdrop / headerbar-backdrop-dark).
- **View** (view / view-dark): boxed lists, cards, popovers and content wells set a step apart from the window.
- **Foreground** (fg / fg-on-dark) and **Dim Foreground** (fg-dim / fg-dim-on-dark): primary text and secondary text (subtitles, captions, status-page icons).
- **Line** (line): every hairline: headerbar bottom border, sidebar divider, boxed-list row dividers, input borders.
- **Hover / Press** (hover, press): translucent fills for flat controls; shadcn's `accent` token maps to `hover`, keeping its neutral hover meaning.
- **Secondary / Muted** (secondary / secondary-dark): neutral fills for shadcn secondary surfaces.
- **Destructive** (destructive / destructive-dark): Yaru red for destructive buttons and invalid fields.
- **Shell** (shell / shell-dark, shell-fg) with **Shell Card** (shell-card, shell-card-hover): quick settings, date menu, notification banners, power dialog and mobile notice. Shell surfaces follow the light/dark style, as GNOME does since Ubuntu 23.10.
- **Panel** (panel, panel-fg): the near-black translucent top bar, always dark in both styles.
- **Dock** (dock): the translucent dark dock, blurred over the wallpaper.

### Named Rules
**The One Accent Rule.** `--brand` is the only saturated UI colour. Anything that signals "selected", "on", "primary" or "focused" uses it; nothing else invents a second accent. Change the accent, and every such state must follow.

**The Neutral Accent Rule.** shadcn's `accent` token is a neutral hover fill, not the brand. Never map `accent` to `--brand`; use `brand` / `primary` for the colour.

## Typography

**Display Font:** Montserrat Variable (with ui-sans-serif, system-ui, sans-serif)
**Body Font:** Montserrat Variable
**Label/Mono Font:** Ubuntu Mono (with ui-monospace, monospace)

**Character:** One geometric sans carries the whole OS at desktop sizes; hierarchy comes from weight (400 / 500 / 600 / 700) and a tight negative tracking on large headings, not from a second face.

### Hierarchy
- **Display** (700, clamp(28px, 4vw, 40px), 1.05, -0.025em): the Welcome hero and project hero names only. The boot splash and Settings › About set the owner's name the same way: first name light, the rest bold.
- **Headline** (700, 28px, -0.02em): the page title at the top of each app page (Experience, Games, Contact, Welcome steps, project detail).
- **Status Title** (700, 22px): Adw status-page titles (empty states, errors).
- **Title** (700, 14px): window titles in the headerbar, boxed-list group titles, button labels.
- **Body** (500, 14.5px): row titles; paragraph copy uses the same size at 400 with relaxed leading (1.625) inside a 720px clamp.
- **Label** (700 / 600, 13.5px): quick-toggle titles, app-grid labels, shell menu items.
- **Caption** (400, 13px, dim foreground): row subtitles and secondary metadata; 12px for quick-toggle subtitles and tags.
- **Mono** (400, Ubuntu Mono): terminal output and inline literal code.

### Named Rules
**The One Family Rule.** Montserrat is the only UI face. Ubuntu Mono appears only where text is literally code or terminal output.

**The Tabular Clock Rule.** Clocks, countdowns, battery percent and stats use tabular figures (`.tabular`) so digits never jitter.

## Layout

The viewport is a desktop, not a page. A 32px top bar spans the top; below it a 68px dock (the default; it follows the dock icon size) runs down the left edge with Show Apps pinned at the bottom; the remaining work area holds a desktop shortcut column, windows and the app grid. Under 768px the dock becomes a 64px bottom bar (`flex-col-reverse`), its icons drop from 54px to 48px, and windows open maximized.

Windows are absolutely positioned and resizable, snap to halves (Super + arrows, edge drag with a translucent 14px-radius preview) and lose their corner radius when maximized or tiled. App content sits in an Adw-style clamp: centred column, 720px max width by default, 24px padding (16px on mobile). Boxed lists group rows with 8px under a group title; quick settings use a two-column grid with 10px gaps. The app grid centres a column-fitted grid of 132px tiles under a 340px pill search field.

The spacing rhythm is a 4px base: 4, 8, 12, 16, 24.

### Stacking
Z-order is a fixed ladder; new layers slot into it rather than inventing values:
windows 10 to 8000 (renormalised back to 10+ when the top passes 8000), snap preview and app grid 9000, dock 9500, top bar 10000, notification banners 12000, popovers / menus / dialogs / tooltips 30000, mobile notice 40000, session screens (boot, power off) 50000, brightness filter 60001. Below the shell, in paint order: wallpaper, SkyTint, Particles canvas, Celestial (sun and moon).

## Elevation & Depth

Hybrid. App interiors are flat and tonal: window, view and headerbar steps plus hairline lines do the separation. Real shadows belong to things that float: windows, shell popovers, banners, menus and tooltips. Translucency and backdrop blur mark the shell layer (top bar, dock, app grid scrim).

### Shadow Vocabulary
- **Focused window** (`box-shadow: 0 18px 48px -8px rgb(0 0 0 / 0.42), 0 2px 6px rgb(0 0 0 / 0.18), 0 0 0 1px rgb(0 0 0 / 0.1)`): the active window. In dark style, `0 18px 48px -8px rgb(0 0 0 / 0.6), 0 0 0 1px rgb(255 255 255 / 0.07)`.
- **Backdrop window** (`box-shadow: 0 8px 24px -6px rgb(0 0 0 / 0.28), 0 0 0 1px rgb(0 0 0 / 0.08)`): unfocused windows sink.
- **Shell popover** (`box-shadow: 0 12px 40px rgb(0 0 0 / 0.45)`): quick settings and date menu.
- **Banner** (`box-shadow: 0 10px 34px rgb(0 0 0 / 0.4)`): notification banners.
- **Boxed list** (`box-shadow: 0 0 0 1px var(--line), 0 1px 3px rgb(0 0 0 / 0.05)`): a hairline ring with a whisper of lift.
- **Tooltip** (`box-shadow: 0 4px 14px rgb(0 0 0 / 0.3)`).
- **Control knob** (`box-shadow: 0 1px 2px rgb(0 0 0 / 0.3)`): switch thumbs and slider handles.

### Named Rules
**The Focus Lifts Rule.** Only the focused window carries the deep shadow and the full headerbar tone; every other window sinks to the backdrop shadow, backdrop headerbar and dimmed title.

## Shapes

Soft, consistent GNOME geometry. The base radius is 12px (`--radius`), and the scale steps from it: 6px (sm), 8px (md, tags and small fills), 12px (lg, windows, buttons, header buttons, tooltips), 14px (xl, boxed lists, dock items, snap preview). Shell surfaces round further: 18px app-grid tiles, 20px banners and submenus, 22px session dialogs, 24px popovers. Anything that is a toggle or a status chip is a full pill: quick toggles, top-bar buttons, title buttons, round action buttons, switches, slider tracks, the app-grid search field.

Windows clip their content to the 12px radius and go square when maximized or tiled.

**App Icons.** The real Ubuntu Yaru app icons, unmodified (`src/assets/yaru/`, rendered 256×256 PNGs from github.com/ubuntu/yaru, CC BY-SA 4.0 — credited in Settings › About and in `src/assets/yaru/README.md`). Each portfolio app borrows the closest Ubuntu app: Help (Welcome), the default user avatar (About), Displays — a monitor with a set square (Projects); two Yaru-style light round badges in `src/assets/icons/` fill the gaps Yaru has no icon for: original reading glasses (Experience) and the GitHub mark (GitHub Stats), Games (Games), Mail (Contact), Files (Files), Terminal (Terminal), Settings (Settings). They are fixed artwork, so they do not follow the accent. Sizes: dock 36px (32px on phones), desktop 48px, app grid 64px. There is no Text Editor app; Files opens documents in an in-place read-only reader (`src/apps/files/Reader.tsx`). No logo or brand mark is used anywhere for now.

## Components

### Window Chrome
- **Headerbar:** 46px, hairline bottom border, three-column grid (start, centred 14px bold title, end). Focused uses headerbar tone; unfocused uses headerbar-backdrop, title at 60% opacity, title buttons at 70%.
- **Title buttons:** 24px circles at 9% foreground, 16% on hover, 24% on press, 12px apart, order minimize, maximize, close. Close fills with `--brand` and brand-fg on hover.
- **Split headerbar:** apps with a sidebar pass `split` (sidebar width) and `sidebar` content to `HeaderBar`; the headerbar then renders a sidebar-toned pane with its own right hairline over the sidebar column (AdwNavigationSplitView), and the content side takes the window tone.
- **Slots:** apps never draw their own headerbar; they portal `start`, `title` and `end` content into the window via `HeaderBar`.

### Buttons
- **Shape:** gently rounded (12px), 36px tall, 16px horizontal padding, 14px bold labels.
- **Suggested:** `--brand` fill with brand-fg; hover `brightness(1.1)`, press `brightness(0.95)`. One per view, on the primary action.
- **Default:** 8% foreground fill, 13% on hover, 19% on press.
- **Flat:** transparent, hover and press fills only.
- **Destructive:** Yaru red fill, white text.
- **Header button:** 34px square-min flat button (12px radius, 18px icon) for headerbar actions; `active` holds the press fill.
- **Round button:** 40px circle on shell-card, used for Settings and Power (there is no login or lock screen) in quick settings.

### Chips
- **Tag:** 24px tall, 8px radius, 7% foreground fill, 12px semibold text. Used for tech stacks and metadata.
- **Placeholder note:** dashed 25% foreground border, 11.5px semibold dim text; marks content that is still placeholder.

### Cards / Containers
- **Boxed list:** view-toned card, 14px radius, hairline ring, rows divided by hairlines.
- **Row:** min 54px, 10px by 16px padding, optional prefix and suffix, 14.5px medium title over 13px dim subtitle; clickable rows take hover and press fills.
- **Status page:** centred 96px dim icon, 22px bold title, 14.5px dim description, optional action below.

### Inputs / Fields
- **Switch:** 48 by 26px pill, 20px white thumb with knob shadow sliding 22px on ease-out-expo; unchecked track 20% foreground, checked `--brand`.
- **Slider:** 5px pill track at 18% current colour, `--brand` range, 20px white handle that scales on hover and press.
- **Search (shell):** 40px pill, 12% white fill, white/10 border, 18% fill on focus, `--brand` focus outline.
- **Focus:** every focusable element shows a 2px outline in `--ring` (brand at 55%) offset 2px.

### Navigation
- **Top bar:** 32px near-black translucent panel; 26px pill buttons (white 15% hover, 22% open): the Activities workspace pill on the left (7px dots, the active one 22px wide, 30px when the overview is open), the semibold tabular clock centred, network/volume/battery right.
- **Dock:** 68px translucent dark column with backdrop blur, 54px items at 14px radius holding 36px app icons by default. Settings → Ubuntu Desktop → Dock → Icon Size (24–56px, `dockIconSize`) scales it: item = icon + 18, column = icon + 32, and the work area for maximized and tiled windows follows (`setDockIconSize` in `src/store/layout.ts`). The phone bottom bar stays fixed. Desktop shortcuts have Small / Standard / Large sizes (36 / 48 / 64px icons, `desktopIconSize`) under Desktop Icons → Size; white 12% hover, 10% for the focused app. Running-window dots (5px, up to four) sit on the outer edge, `--brand` for the focused app and white 80% otherwise. A hairline divider separates pinned from running apps; the list fades out at its trailing edge with a mask.
- **App grid:** 45% black scrim with heavy blur and saturation, 72px icons in 18px-radius tiles with 13.5px semibold white labels carrying a soft text shadow; pages with the wheel, type-to-search.
- **Quick settings:** 380px shell popover; battery pill and three round buttons, volume and brightness slider rows, then a two-column grid of 52px pill toggles. Toggles with options split off a 40px chevron segment that opens a 20px-radius submenu inline.

### App Icon (signature)
See App Icons in Shapes. The manifest holds no icon; art is keyed by app id in `appArt.tsx`.

### Procedural Wallpapers (signature)
Four inline SVG wallpapers (Resolute bands, Aubergine, Contour, Graphite) drawn at 1600 by 1000. Gradients, strokes and points reference `var(--brand)`, so changing the accent repaints the desktop with no image assets.

### Adding an App
Register in three places only: metadata (title, description, Heroicon, default size, singleton, inGrid) in `src/apps/manifest.ts`; a default-export component at `src/apps/<id>/index.tsx`; a lazy import in `src/apps/registry.ts`. Build the app from `src/apps/_ui.tsx` primitives (HeaderButton, Button, BoxedList, Row, GroupTitle, Tag, StatusPage, Clamp) and `HeaderBar`; the shell needs no changes.

### Motion
- **Easing:** ease-out-expo (`cubic-bezier(0.16, 1, 0.3, 1)`) for opening, settling and state changes; ease-gnome (`cubic-bezier(0.25, 0.46, 0.45, 0.94)`) for minimize.
- **Window open:** 220ms `win-open`, animating the individual `scale` (0.95 to 1) and `translate` (2.5% to 0) properties plus opacity, so it composes with the inline `transform` that positions the window. Close reverses to 0.96 / 2%.
- **Minimize:** 260ms flight toward the app's dock icon.
- **Overview:** 260ms fade, scale 1.04 to 1 and blur 6px to 0. **Banner:** 320ms drop from -14px.
- **Controls:** 150ms colour transitions; 200ms switch thumb.
- **Reduced motion:** `prefers-reduced-motion: reduce` collapses all animation and transition durations to 0.01ms. The same happens through the `.no-anim` root class when the Animations setting is off. The particle canvas then draws a single still frame and the sky jumps straight to its end state.

## Do's and Don'ts

### Do:
- **Do** route every "on / selected / primary / focused" state through `--brand` so the accent switch recolours it.
- **Do** keep window chrome exact: 46px headerbar, 12px radius, 24px round title buttons, close turning `--brand` on hover.
- **Do** build app UI from the `_ui.tsx` libadwaita primitives and portal headerbar content through `HeaderBar`.
- **Do** use shell tokens (shell, shell-card, panel, dock) for anything that floats over the desktop, and window tokens for anything inside a window.
- **Do** take a z-index from the fixed stacking ladder in Layout.
- **Do** honour reduced motion and the Animations setting: every new animation must collapse under `.no-anim` and the media query.
- **Do** use Heroicons (solid) for app and UI icons, with custom SVG glyphs only where GNOME has no Heroicons equivalent.

### Don't:
- **Don't** map shadcn's `accent` token to the brand; it is the neutral hover fill.
- **Don't** introduce a second saturated UI colour or a font other than Montserrat (Ubuntu Mono is for code only).
- **Don't** use raster wallpapers or heavy image assets; wallpapers are procedural SVG painted with the accent.
- **Don't** give a window its own drawn headerbar or title buttons; the shell owns window chrome.
- **Don't** animate a window with `transform`; use the individual `scale` and `translate` properties so the positioning transform survives.

## Day and Night

The desktop has a sky layer that follows the style setting.

- **SkyTint** (`src/os/shell/Sky.tsx`): a warm daylight wash (soft-light) in the light style and a deep navy night wash (multiply, 82%) in the dark style, cross-faded over 2.4s.
- **Celestial:** the sun and moon sit at opposite ends of one orbit whose hub is below the horizon, left of centre (30vw, 74vh; radius 62vh, or 32vh on phones so the bodies land below the home-screen icons). The sun is a white-hot disc with two faint, blurred counter-turning ray rings (12–16% opacity, 90s and 140s per turn) and a soft breathing halo; while setting it deepens from gold to ember red. Each style change turns the orbit half a revolution, always in the same direction, so the pair circles around each other: the setting body swings down one side while the other rises up the opposite side. The bodies counter-rotate to stay upright. A vertical mask (opaque to 50%, clear by 66%) melts them into the horizon haze. Nothing animates on first paint.
- **Particles** (`src/os/shell/Particles.tsx`): one canvas with roughly one particle per 18,000 px², capped at 110. In the light style they are warm gold dust motes rising slowly; in the dark style they are cool white twinkling stars that barely drift. The blend eases with the sky. The canvas pauses when the tab is hidden and draws one static frame under reduced motion or with Animations off.
- **Brightness floor:** software brightness never drops below 20% (`MIN_BRIGHTNESS` in `src/store/systemSlice.ts`). The quick-settings slider paints the unreachable 0–20% zone solid green (#3cc58f, soft glow) and shows a "Minimum" label when the thumb rests on the floor.

## Windows and Dock

- **Window size by device.** On phones and tablets (below 1024px) apps open full screen; phones (below 768px) always stay full screen and show only Close. On desktops apps open as floating windows at their default size, centred in the work area.
- **Dock.** The dock keeps its translucent dark panel; the app icons on it have no tiles. Icons lift and grow slightly on hover, with the accent running-dots beside them, and Show Apps is a plain white grid glyph pinned at the trailing end.
- **Closing.** A macOS-style close: the window shrinks to 88% toward its centre while fading out and softening (2px blur) over 200ms on an ease-in curve (`win-close`), then it is removed.
- **Minimizing.** A macOS genie (`src/os/window/genie.ts`): the window's dock-side edge pinches toward its dock icon (a smoothstepped `clip-path` funnel), then the whole window slides into the icon as the funnel collapses (560ms, ease-in). Restoring plays the same path in reverse (500ms, ease-out). On phones the bottom edge pinches toward the bottom dock. Skipped under reduced motion or with Animations off.

## Cursor

Ubuntu's Yaru-style cursor set (`public/cursors/*.svg`, 32px canvas): near-black glyphs (#1a1a1a) with a 1.5px white outline and a soft drop shadow, so they read on any surface. The set covers the arrow (default), the pointing hand (anything clickable: links, buttons, tabs, menu items, switches, checkboxes, options, file rows; disabled controls get not-allowed), the I-beam (text fields), the open and closed hand (the contact lanyard), not-allowed, and double-headed arrows for the four resize axes. They are exposed as `--cursor-*` variables in `src/styles/index.css`, and each falls back to the native cursor. They are not tinted with the accent, matching Ubuntu.

## Boot

A launch sequence (`src/os/shell/BootScreen.tsx`) that does real work: fonts, every app chunk (the loaders in `src/apps/registry.ts`) and the 3D lanyard are loaded while an Ubuntu-style `[  OK  ]` log scrolls in Ubuntu Mono and a 24-segment fuel gauge fills orange, then butter, then mint. A warp-speed starfield sits behind it all. Holding Space (or pressing and holding) boosts: stars streak, fuelling runs four times faster and the engine plume grows. At 100% the gauge reads ALL SYSTEMS GO and the rocket launches off screen into the desktop. Enter or Escape skips.

## Contact Lanyard

Contact Me opens as a dismissible full-screen overlay instead of a window (`presentation: 'overlay'` in the manifest): a port of React Bits' Lanyard (Rapier rope and spherical joints, drag to fling) over a dimmed, blurred desktop. The card and strap are painted on canvases rather than loaded as assets. The front is a "CREW PASS" in the accent with the astronaut badge, the name set light/bold, the role in accent capitals, and the email and socials; the back shows the rocket and "Thanks for stopping by". Pill actions along the bottom (Email me, Copy email, socials). Close with the Close button, Esc, or a click on empty space.
