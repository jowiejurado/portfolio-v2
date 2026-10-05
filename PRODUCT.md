# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Vite + React 19 + TypeScript, Tailwind CSS v4 + shadcn/ui (Radix), Heroicons, Zustand. Chosen by the user.

## Users

Recruiters, hiring managers, prospective clients and fellow developers evaluating Jowie Jurado's work. They arrive from a link (CV, LinkedIn, GitHub), usually on a desktop browser, and want to learn quickly who Jowie is, what Jowie has built, and how to get in touch — while being entertained enough to keep exploring.

## Product Purpose

A personal portfolio presented as a web operating system modelled on Ubuntu 26.04 LTS. Portfolio sections (About, Projects, Experience, GitHub Stats, Games, Contact) are apps that open in windows. Success: a visitor finds projects, experience and contact info within seconds, and the OS itself demonstrates front-end craft.

## Positioning

The OS shell is the proof: a faithful, fast, keyboard-friendly desktop environment built from scratch in React is itself the strongest portfolio piece.

## Operating Context

Visited from links, mostly desktop browsers; mobile visitors must still be able to reach every section (maximized windows, bottom dock). Built in phases: phase 1 is the OS shell and built-in apps (Terminal, Files, Settings, notifications/calendar) plus simple portfolio app views; later phases add mini games, live GitHub stats and a real contact backend.

## Capabilities and Constraints

- Copy the Ubuntu 26.04 (GNOME / Yaru) UI — top bar, dock, app grid, window chrome, quick settings, settings layout — but not Ubuntu's built-in apps.
- Light and dark mode; Montserrat is the main font.
- System tray: volume, battery/power, clock and date, network.
- Must be optimized and fast: lazy-loaded apps, no heavy assets.
- Scalable: new apps are added through a single registry.

## Brand Commitments

- Ubuntu 26.04 Yaru look is binding (user-pinned).
- Montserrat main font (user-pinned).
- Heroicons for icons (user-pinned).
- Must not look generic or AI-templated.

## Evidence on Hand

None yet. All bio, projects, experience, socials and GitHub username are placeholders in `src/content/*` marked TODO; never present them as real claims.

## Product Principles

1. The OS is the showcase — fidelity and responsiveness of the shell matter as much as content.
2. Every portfolio fact is reachable in two clicks or one terminal command.
3. Content lives in data files, never hard-coded in UI.
4. Phase-friendly: adding an app never requires touching the shell.

## Accessibility & Inclusion

Full keyboard operation of shell and windows, visible focus rings, `prefers-reduced-motion` honored, WCAG AA contrast in both themes.
