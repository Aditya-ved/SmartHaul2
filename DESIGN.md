---
version: alpha
name: SmartHaul-design-analysis
description: A design language for SmartHaul, a shared-freight marketplace for India, built by blending four references. Uber supplies the personality (a black-and-white duet, pill buttons, bold sentence-case headlines). Airbnb supplies the marketplace screens (pill search bar, photo-first truck cards, sticky booking card). Linear supplies the dashboards (sidebar shell, dense tables, hairline borders, soft status badges). Stripe supplies the details (tabular figures for weights and rupees, blue-tinted soft shadows, one indigo accent). Components come from shadcn/ui (Radix-based, restyled through tokens). Type is Inter throughout. Black is the only action colour; indigo is reserved for focus, links, and the active sidebar item; muted status badges carry shipment and vehicle state.

colors:
  primary: "#000000"
  on-primary: "#ffffff"
  primary-hover: "#282828"
  ink: "#0a0a0a"
  body: "#5e5e5e"
  mute: "#9a9a9a"
  canvas: "#ffffff"
  surface: "#f7f7f7"
  surface-strong: "#efefef"
  hairline: "#e5e5e5"
  pressed: "#e2e2e2"
  accent: "#533afd"
  accent-deep: "#4434d4"
  accent-soft: "#ecebff"
  on-dark: "#ffffff"
  status-pending-bg: "#fff4d6"
  status-pending-text: "#8a5a00"
  status-booked-bg: "#e3edff"
  status-booked-text: "#1d4ed8"
  status-transit-bg: "#efe6ff"
  status-transit-text: "#6d28d9"
  status-delivered-bg: "#dcf5e4"
  status-delivered-text: "#15803d"
  status-danger-bg: "#fde4e4"
  status-danger-text: "#b91c1c"
  dark-canvas: "#0b0b0e"
  dark-surface-1: "#141418"
  dark-surface-2: "#1b1b21"
  dark-hairline: "#26262d"
  dark-ink: "#f5f5f7"
  dark-body: "#a1a1aa"
  dark-accent: "#7b6cff"

typography:
  display-xxl:
    fontFamily: Inter Variable, Inter, system-ui, Helvetica Neue, Arial, sans-serif
    fontSize: 52px
    fontWeight: 700
    lineHeight: 60px
    letterSpacing: -0.02em
  display-xl:
    fontFamily: Inter Variable, Inter, system-ui, Helvetica Neue, Arial, sans-serif
    fontSize: 36px
    fontWeight: 700
    lineHeight: 44px
    letterSpacing: -0.02em
  display-lg:
    fontFamily: Inter Variable, Inter, system-ui, Helvetica Neue, Arial, sans-serif
    fontSize: 28px
    fontWeight: 700
    lineHeight: 36px
  display-md:
    fontFamily: Inter Variable, Inter, system-ui, Helvetica Neue, Arial, sans-serif
    fontSize: 22px
    fontWeight: 600
    lineHeight: 30px
  display-sm:
    fontFamily: Inter Variable, Inter, system-ui, Helvetica Neue, Arial, sans-serif
    fontSize: 18px
    fontWeight: 600
    lineHeight: 26px
  stat:
    fontFamily: Inter Variable, Inter, system-ui, Helvetica Neue, Arial, sans-serif
    fontSize: 32px
    fontWeight: 600
    lineHeight: 40px
    letterSpacing: -0.02em
    fontFeature: tnum
  body-lg:
    fontFamily: Inter Variable, Inter, system-ui, Helvetica Neue, Arial, sans-serif
    fontSize: 18px
    fontWeight: 500
    lineHeight: 24px
  body-md:
    fontFamily: Inter Variable, Inter, system-ui, Helvetica Neue, Arial, sans-serif
    fontSize: 16px
    fontWeight: 400
    lineHeight: 24px
  body-md-strong:
    fontFamily: Inter Variable, Inter, system-ui, Helvetica Neue, Arial, sans-serif
    fontSize: 16px
    fontWeight: 500
    lineHeight: 20px
  body-sm:
    fontFamily: Inter Variable, Inter, system-ui, Helvetica Neue, Arial, sans-serif
    fontSize: 14px
    fontWeight: 400
    lineHeight: 20px
  body-sm-strong:
    fontFamily: Inter Variable, Inter, system-ui, Helvetica Neue, Arial, sans-serif
    fontSize: 14px
    fontWeight: 500
    lineHeight: 16px
  body-tabular:
    fontFamily: Inter Variable, Inter, system-ui, Helvetica Neue, Arial, sans-serif
    fontSize: 14px
    fontWeight: 400
    lineHeight: 20px
    fontFeature: tnum
  caption:
    fontFamily: Inter Variable, Inter, system-ui, Helvetica Neue, Arial, sans-serif
    fontSize: 12px
    fontWeight: 400
    lineHeight: 16px
  badge:
    fontFamily: Inter Variable, Inter, system-ui, Helvetica Neue, Arial, sans-serif
    fontSize: 12px
    fontWeight: 500
    lineHeight: 16px
  button-large:
    fontFamily: Inter Variable, Inter, system-ui, Helvetica Neue, Arial, sans-serif
    fontSize: 18px
    fontWeight: 500
    lineHeight: 24px
  button-md:
    fontFamily: Inter Variable, Inter, system-ui, Helvetica Neue, Arial, sans-serif
    fontSize: 16px
    fontWeight: 500
    lineHeight: 20px
  mono:
    fontFamily: JetBrains Mono, ui-monospace, SF Mono, Menlo, monospace
    fontSize: 14px
    fontWeight: 500
    lineHeight: 20px

rounded:
  none: 0px
  sm: 8px
  md: 12px
  lg: 16px
  pill: 999px
  full: 9999px

spacing:
  xxs: 4px
  xs: 8px
  sm: 12px
  md: 16px
  lg: 20px
  xl: 24px
  2xl: 32px
  3xl: 48px
  section: 64px

components:
  nav-bar:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md-strong}"
    height: 64px
    padding: "{spacing.md} {spacing.2xl}"
  nav-link:
    textColor: "{colors.ink}"
    typography: "{typography.body-md-strong}"
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.pill}"
    height: 44px
    padding: "{spacing.sm} {spacing.lg}"
  button-primary-hover:
    backgroundColor: "{colors.primary-hover}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.pill}"
  button-secondary:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    typography: "{typography.button-md}"
    rounded: "{rounded.pill}"
    height: 44px
    padding: "{spacing.sm} {spacing.lg}"
  button-subtle:
    backgroundColor: "{colors.surface-strong}"
    textColor: "{colors.ink}"
    typography: "{typography.button-md}"
    rounded: "{rounded.pill}"
    padding: "{spacing.sm} {spacing.md}"
  button-danger:
    backgroundColor: "{colors.status-danger-bg}"
    textColor: "{colors.status-danger-text}"
    typography: "{typography.button-md}"
    rounded: "{rounded.pill}"
    padding: "{spacing.sm} {spacing.lg}"
  button-large:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-large}"
    rounded: "{rounded.pill}"
    height: 56px
    padding: "{spacing.md} {spacing.xl}"
  button-icon-circular:
    backgroundColor: "{colors.surface-strong}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
    height: 40px
  link-accent:
    textColor: "{colors.accent}"
    typography: "{typography.body-md}"
  text-input:
    backgroundColor: "{colors.surface-strong}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.sm}"
    height: 48px
    padding: "{spacing.sm} {spacing.md}"
  text-input-focused:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "{colors.accent}"
    typography: "{typography.body-md}"
    rounded: "{rounded.sm}"
    height: 48px
  text-input-error:
    backgroundColor: "{colors.status-danger-bg}"
    textColor: "{colors.ink}"
    borderColor: "{colors.status-danger-text}"
    rounded: "{rounded.sm}"
    height: 48px
  card-content:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
  card-elevated:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
  card-soft:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
  card-on-dark:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-dark}"
    typography: "{typography.display-md}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
  card-stat:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    typography: "{typography.stat}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
  request-form-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: "{spacing.md}"
  search-bar-pill:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.pill}"
    height: 64px
    padding: "{spacing.sm} {spacing.xl}"
  search-orb:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.full}"
    height: 48px
  truck-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.lg}"
    padding: "{spacing.md}"
  truck-card-photo:
    rounded: "{rounded.lg}"
  capacity-bar:
    backgroundColor: "{colors.surface-strong}"
    textColor: "{colors.ink}"
    typography: "{typography.body-tabular}"
    rounded: "{rounded.pill}"
    height: 8px
  booking-panel:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
  status-badge-pending:
    backgroundColor: "{colors.status-pending-bg}"
    textColor: "{colors.status-pending-text}"
    typography: "{typography.badge}"
    rounded: "{rounded.pill}"
    padding: "{spacing.xxs} {spacing.sm}"
  status-badge-booked:
    backgroundColor: "{colors.status-booked-bg}"
    textColor: "{colors.status-booked-text}"
    typography: "{typography.badge}"
    rounded: "{rounded.pill}"
    padding: "{spacing.xxs} {spacing.sm}"
  status-badge-transit:
    backgroundColor: "{colors.status-transit-bg}"
    textColor: "{colors.status-transit-text}"
    typography: "{typography.badge}"
    rounded: "{rounded.pill}"
    padding: "{spacing.xxs} {spacing.sm}"
  status-badge-delivered:
    backgroundColor: "{colors.status-delivered-bg}"
    textColor: "{colors.status-delivered-text}"
    typography: "{typography.badge}"
    rounded: "{rounded.pill}"
    padding: "{spacing.xxs} {spacing.sm}"
  status-badge-rejected:
    backgroundColor: "{colors.status-danger-bg}"
    textColor: "{colors.status-danger-text}"
    typography: "{typography.badge}"
    rounded: "{rounded.pill}"
    padding: "{spacing.xxs} {spacing.sm}"
  category-chip:
    backgroundColor: "{colors.surface-strong}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm-strong}"
    rounded: "{rounded.pill}"
    padding: "{spacing.xs} {spacing.md}"
  category-chip-selected:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.body-sm-strong}"
    rounded: "{rounded.pill}"
    padding: "{spacing.xs} {spacing.md}"
  tab-pill:
    backgroundColor: "{colors.surface-strong}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md-strong}"
    rounded: "{rounded.pill}"
    padding: "{spacing.xs} {spacing.md}"
  sidebar:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.body}"
    borderColor: "{colors.hairline}"
    typography: "{typography.body-md-strong}"
    width: 248px
    padding: "{spacing.md}"
  sidebar-item:
    textColor: "{colors.body}"
    typography: "{typography.body-md-strong}"
    rounded: "{rounded.sm}"
    height: 40px
    padding: "{spacing.xs} {spacing.sm}"
  sidebar-item-active:
    backgroundColor: "{colors.accent-soft}"
    textColor: "{colors.accent}"
    typography: "{typography.body-md-strong}"
    rounded: "{rounded.sm}"
    height: 40px
  topbar:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    typography: "{typography.body-md-strong}"
    height: 56px
    padding: "{spacing.xs} {spacing.xl}"
  dashboard-canvas:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.ink}"
    padding: "{spacing.xl}"
  data-table-header:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.body}"
    typography: "{typography.body-sm-strong}"
    padding: "{spacing.sm} {spacing.md}"
  data-table-row:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    typography: "{typography.body-tabular}"
    height: 52px
    padding: "{spacing.sm} {spacing.md}"
  tracker-step-done:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.full}"
    height: 24px
  tracker-step-current:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    borderColor: "{colors.accent}"
    rounded: "{rounded.full}"
    height: 24px
  tracker-step-future:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.mute}"
    borderColor: "{colors.hairline}"
    rounded: "{rounded.full}"
    height: 24px
  verification-pane:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
  driver-action-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    borderColor: "{colors.hairline}"
    typography: "{typography.body-lg}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
  hero-band-light:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.display-xxl}"
    padding: "{spacing.2xl} {spacing.2xl}"
  hero-band-dark:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-dark}"
    typography: "{typography.display-xxl}"
    padding: "{spacing.2xl} {spacing.2xl}"
  faq-row:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md-strong}"
    padding: "{spacing.md} 0"
  modal-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: "{spacing.xl}"
  drawer-panel:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    width: 480px
    padding: "{spacing.xl}"
  toast:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.md}"
    padding: "{spacing.sm} {spacing.md}"
  empty-state-card:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.body}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: "{spacing.2xl}"
  skeleton-block:
    backgroundColor: "{colors.surface-strong}"
    rounded: "{rounded.sm}"
  footer:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-dark}"
    typography: "{typography.body-sm}"
    padding: "{spacing.2xl} {spacing.2xl}"
---

## Overview

SmartHaul is a shared-freight marketplace. A sender with 500 kg of goods fills the empty space of a truck that is already driving the same route, and the truck owner earns from capacity that would otherwise go unused. The interface has to feel as simple as booking a ride, as browsable as a rental marketplace, and as dependable as a business dashboard. No single brand does all three, so this system blends four, and each one has a fixed job.

**Uber sets the personality.** The page is a black-and-white duet. Black `{colors.primary}` is the only action colour: every primary button, every dark promo band, the footer. Headlines are bold, sentence-case, and never letter-spaced beyond a slight tightening at display sizes. Every interactive element is a pill (`{rounded.pill}`), and cards are `{rounded.lg}` 16 px.

**Airbnb sets the marketplace screens.** Truck search uses a pill-shaped search bar (From, To, Pickup date, Weight) ending in a black circular orb. Results are photo-first truck cards with a capacity bar instead of a star rating. Booking happens in a sticky panel on desktop and a sticky bottom bar on mobile.

**Linear sets the dashboards.** Owner, company, driver, and admin screens sit inside a left sidebar plus a 56 px top bar, with hairline borders, compact 52 px table rows, and soft status badges. Hierarchy comes from surface steps and borders, not shadows. A dark theme is available for dashboards.

**Stripe sets the details.** Every number (kg, rupees, counts, dates in tables) uses tabular figures. Shadows are soft and blue-tinted. One accent colour, indigo `{colors.accent}`, appears only on focus rings, inline links, the active sidebar item, and the "current" step of the tracker. An optional pale gradient wash sits behind the landing-page hero only.

The type face is **Inter** throughout, a free substitute that both Uber's and Linear's design files recommend.

**Key Characteristics:**
- One action colour: a black pill `{colors.primary}` for the primary conversion target in each area of the screen.
- One accent colour: indigo `{colors.accent}` for focus, links, and active navigation. Never a button fill, never a section background.
- Pill geometry on every interactive element (buttons, chips, badges, search bar); 16 px radius on cards; 8 px on inputs.
- Status is always a soft badge: muted tinted background, darker text of the same hue, with a small dot and a text label. Colour is never the only signal.
- Capacity is always a bar plus numbers: black for occupied, light grey for available, red above 90 percent.
- Flat cards with a hairline border by default; shadows appear only on floating things (search bar, dropdowns, modals, hovered cards).
- Tabular figures for any numeric cell, right-aligned in tables.
- Light theme is the default for every role; a Linear-style dark theme is optional on dashboards.

## Colors

### Brand & Accent
- **Ink Black** (`{colors.primary}` — `#000000`): The only conversion colour. Primary buttons, selected chips, dark promo bands, footer, search orb.
- **Black Hover** (`{colors.primary-hover}` — `#282828`): Hover state of the primary button.
- **Indigo** (`{colors.accent}` — `#533afd`): Focus rings (2 px, 2 px offset), inline links, active sidebar item text and icon, current tracker step ring, chart main series.
- **Indigo Deep** (`{colors.accent-deep}` — `#4434d4`): Hover state of indigo links.
- **Indigo Soft** (`{colors.accent-soft}` — `#ecebff`): Background of the active sidebar item and selected soft chips.

### Surface
- **Canvas** (`{colors.canvas}` — `#ffffff`): Page background on public pages and card fill.
- **Surface** (`{colors.surface}` — `#f7f7f7`): Dashboard page background, soft cards, table headers, empty states.
- **Surface Strong** (`{colors.surface-strong}` — `#efefef`): Input fill at rest, chips, subtle buttons, capacity-bar track, skeletons.
- **Hairline** (`{colors.hairline}` — `#e5e5e5`): 1 px borders on cards, tables, sidebar, and top bar.
- **Pressed** (`{colors.pressed}` — `#e2e2e2`): Pressed state of light buttons and chips.

### Text
- **Ink** (`{colors.ink}` — `#0a0a0a`): Headings and body.
- **Body** (`{colors.body}` — `#5e5e5e`): Secondary text, table headers, inactive sidebar items.
- **Mute** (`{colors.mute}` — `#9a9a9a`): Placeholders, future tracker steps, fine print. Never used for essential text.
- **On Dark** (`{colors.on-dark}` — `#ffffff`): All text on black surfaces.

### Status (added for SmartHaul)
The Uber system has no status palette, but a logistics product cannot work without one. These muted pairs are the only extra colours in the system.

| Status | Background | Text | Used for |
|---|---|---|---|
| Pending | `{colors.status-pending-bg}` `#fff4d6` | `{colors.status-pending-text}` `#8a5a00` | Shipment pending, vehicle awaiting verification |
| Booked | `{colors.status-booked-bg}` `#e3edff` | `{colors.status-booked-text}` `#1d4ed8` | Shipment booked |
| In transit | `{colors.status-transit-bg}` `#efe6ff` | `{colors.status-transit-text}` `#6d28d9` | Shipment in transit |
| Delivered / Verified | `{colors.status-delivered-bg}` `#dcf5e4` | `{colors.status-delivered-text}` `#15803d` | Delivered shipment, verified vehicle |
| Rejected / Error | `{colors.status-danger-bg}` `#fde4e4` | `{colors.status-danger-text}` `#b91c1c` | Rejected vehicle, validation errors, capacity above 90 percent |

### Dark Theme (dashboards only, optional)
- **Canvas** `{colors.dark-canvas}` `#0b0b0e`, **Surface 1** `{colors.dark-surface-1}` `#141418`, **Surface 2** `{colors.dark-surface-2}` `#1b1b21`, **Hairline** `{colors.dark-hairline}` `#26262d`.
- **Ink** `{colors.dark-ink}` `#f5f5f7`, **Body** `{colors.dark-body}` `#a1a1aa`, **Accent** `{colors.dark-accent}` `#7b6cff`.
- Primary buttons invert to white pills with black text. Status badges keep their hues but use 15 percent opacity backgrounds.

## Typography

### Font Family
One family carries the whole system: **Inter Variable** (install with `@fontsource-variable/inter`). Fallback stack: `system-ui, Helvetica Neue, Arial, sans-serif`. **JetBrains Mono** is used only for vehicle numbers (for example `GJ 01 AB 1234`) and IDs.

Display sizes are weight 700 with a slight `-0.02em` tightening. Body is 400, buttons and labels are 500. Headings never go above 700 and button labels are never promoted to 700.

### Hierarchy

| Token | Size | Weight | Line Height | Use |
|---|---|---|---|---|
| `{typography.display-xxl}` | 52px | 700 | 60px | Landing hero headline only ("Ship only what you need"). |
| `{typography.display-xl}` | 36px | 700 | 44px | Page titles, section headlines. |
| `{typography.display-lg}` | 28px | 700 | 36px | Section titles inside dashboards. |
| `{typography.display-md}` | 22px | 600 | 30px | Card titles, route headings ("Ahmedabad → Delhi"). |
| `{typography.display-sm}` | 18px | 600 | 26px | Sub-card headings, modal titles. |
| `{typography.stat}` | 32px | 600 | 40px | Dashboard stat numbers (tabular). |
| `{typography.body-lg}` | 18px | 500 | 24px | Lead paragraphs, driver screen text. |
| `{typography.body-md}` | 16px | 400 | 24px | Default paragraph body. |
| `{typography.body-md-strong}` | 16px | 500 | 20px | Nav links, sidebar items, emphasis. |
| `{typography.body-sm}` | 14px | 400 | 20px | Card metadata, helper text. |
| `{typography.body-sm-strong}` | 14px | 500 | 16px | Chips, table headers, form labels. |
| `{typography.body-tabular}` | 14px | 400 | 20px | Table cells and any figure (kg, ₹, counts). Uses `tnum`. |
| `{typography.caption}` | 12px | 400 | 16px | Fine print, timestamps. |
| `{typography.badge}` | 12px | 500 | 16px | Status badges. |
| `{typography.button-large}` | 18px | 500 | 24px | Large CTA (confirm booking, hero search). |
| `{typography.button-md}` | 16px | 500 | 20px | Default button label. |
| `{typography.mono}` | 14px | 500 | 20px | Vehicle numbers, shipment IDs. |

### Principles
- **Sentence case is the voice.** "Find a truck", not "FIND A TRUCK". Uppercase is allowed only for rare eyebrow tags.
- **Numbers are first-class.** Apply `font-variant-numeric: tabular-nums` to every weight, price, and count. Right-align numeric table columns.
- **Weight 700 is for headlines; 500 is for buttons and emphasis.**
- **No letter-spacing on body text.** Only display and stat sizes tighten by `-0.02em`.
- **Indian formats.** Currency as `₹12,500`, weights as `6,000 kg`, dates as `23 Aug 2026`.

## Layout

### Spacing System
- **Base unit**: 4 px.
- **Tokens**: `{spacing.xxs}` 4 · `{spacing.xs}` 8 · `{spacing.sm}` 12 · `{spacing.md}` 16 · `{spacing.lg}` 20 · `{spacing.xl}` 24 · `{spacing.2xl}` 32 · `{spacing.3xl}` 48 · `{spacing.section}` 64.
- **Card padding**: `{spacing.xl}` 24 px (16 px on mobile). Truck cards use 16 px so more fit per screen.
- **Section spacing**: 64 px on marketing pages, 32 px inside dashboards.
- **Gaps**: 16 px between dashboard cards, 24 px between marketing cards, 12 px between button siblings.

### Grid & Container
- **Marketing max width**: 1200 px, centred, 32 px gutters on desktop and 16 px on mobile.
- **Dashboard max width**: 1440 px, content area beside a 248 px sidebar.
- **Search results**: 3-up truck cards on desktop, 2-up on tablet, 1-up on mobile, with a sticky booking panel (320–380 px) when a truck is selected.
- **Stat rows**: 4-up desktop, 2-up tablet, 1-up mobile.
- **Verification view**: two panes, queue list left (360 px) and detail right.

### Whitespace Philosophy
Marketing pages are open and editorial: large headlines, black promo bands, and 64 px between sections. Dashboards are denser: 32 px between sections, 52 px table rows, and compact 40 px sidebar items. The contrast is deliberate, because a sender browsing wants calm and an owner managing twenty vehicles wants information.

### Responsive Strategy

#### Breakpoints

| Name | Width | Key Changes |
|---|---|---|
| Mobile | < 640px | Single column; public nav becomes hamburger; dashboard sidebar becomes a bottom tab bar (max 5 items); tables become stacked cards; booking panel becomes a sticky bottom bar; search bar collapses to one tappable pill that opens a full-screen sheet. |
| Tablet | 640–1023px | 2-column grids; sidebar collapses to 64 px icons. |
| Desktop | 1024–1439px | Full sidebar; 3-up truck cards; sticky booking panel. |
| Wide | ≥ 1440px | Content caps at max width; extra space becomes gutter. |

#### Touch Targets
Primary buttons are 44 px tall, large buttons 56 px, inputs 48 px, sidebar items 40 px (44 px on touch). The driver screens use 56 px buttons because drivers use them in a truck cab, often with one hand.

#### Collapsing Strategy
- **Public nav**: links, "Log in" and "Sign up" pills at desktop; logo plus hamburger below 768 px.
- **Sidebar**: 248 px, then 64 px icons, then bottom tab bar.
- **Tables**: below 640 px each row becomes a card with the status badge top-right and the primary action at the bottom.
- **Booking panel**: right rail on desktop, sticky bottom bar on mobile carrying only the price and the "Book" button.

#### Image Behavior
- **Truck photos**: 4:3, `{rounded.lg}` corners, never cropped to a circle. If a truck has no photo, show a neutral illustration of a truck on `{colors.surface-strong}`.
- **Hero illustrations**: 4:3 editorial line illustrations of trucks, drivers, and city objects; no stock photography.
- **Maps** (live tracking, later): full-bleed inside a card, corners follow the card, floating white pill for ETA.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| Level 0 — Flat | No shadow, 1 px `{colors.hairline}` border | Default cards, tables, sidebar, top bar. |
| Level 1 — Hover Lift | `rgba(10, 20, 60, 0.08) 0px 1px 3px` | Hovered truck cards (plus 2 px upward shift, 150 ms). |
| Level 2 — Floating | `rgba(10, 20, 60, 0.08) 0px 8px 24px, rgba(10, 20, 60, 0.04) 0px 2px 6px` | Search bar, dropdowns, modals, the hero request card. |
| Level 3 — Pill Float | `rgba(0, 0, 0, 0.16) 0px 2px 8px` | White floating pill over a map or photo. |

### Decorative Depth
- **Black bands as polarity flip**: a black promo band between white sections is the main depth cue on the landing page ("Own a truck? Earn from empty space.").
- **Surface steps on dashboards**: a `{colors.surface}` page background with white bordered cards on top gives depth without shadows.
- **Hero gradient wash**: a pale cream-to-lavender wash behind the top third of the landing hero only. It never appears inside the app.
- **Modal backdrop**: `rgba(0, 0, 0, 0.5)`.

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | Full-bleed bands, footer, table edges. |
| `{rounded.sm}` | 8px | Inputs, sidebar items, skeleton blocks. |
| `{rounded.md}` | 12px | Dropdowns, toasts. |
| `{rounded.lg}` | 16px | Every card, modal, panel, truck photo. |
| `{rounded.pill}` | 999px | Every button, chip, badge, tab, search bar, capacity bar. |
| `{rounded.full}` | 9999px | Circular icon buttons, search orb, avatars, tracker dots. |

### Photography Geometry
- **Truck photos**: 4:3 inside `{rounded.lg}`.
- **Driver portraits**: square or circle, never rounded-square.
- **Illustrations**: 4:3 or 16:9 hard-edge rectangles inside card chrome.
- **Vehicle documents** (admin verification): shown at natural ratio in a bordered frame with a click-to-zoom lightbox.

## Components

### Buttons

**`button-primary`** — the black pill; one per area of the screen ("Book truck", "Create shipment", "Approve").
- Background `{colors.primary}`, text `{colors.on-primary}`, label `{typography.button-md}`, height 44 px, padding `{spacing.sm} {spacing.lg}`, shape `{rounded.pill}`. Hover `{colors.primary-hover}`. Loading shows a spinner and keeps the width fixed. Disabled is 40 percent opacity.

**`button-secondary`** — the white pill with a hairline border ("Cancel", "View details").
- Background `{colors.canvas}`, text `{colors.ink}`, border `{colors.hairline}`, same size as primary. Pressed `{colors.pressed}`.

**`button-subtle`** — the grey pill for tertiary actions inside cards.
- Background `{colors.surface-strong}`, text `{colors.ink}`, shape `{rounded.pill}`.

**`button-danger`** — destructive action ("Reject vehicle", "Cancel booking").
- Background `{colors.status-danger-bg}`, text `{colors.status-danger-text}`, shape `{rounded.pill}`. Always paired with a confirmation step.

**`button-large`** — the 56 px black pill for the main form action ("Confirm booking", "Start journey", "Mark as delivered").
- Background `{colors.primary}`, text `{colors.on-primary}`, label `{typography.button-large}`, shape `{rounded.pill}`.

**`button-icon-circular`** — 40 px circular icon container for toolbar actions and notification bells.
- Background `{colors.surface-strong}`, dark icon, shape `{rounded.full}`.

**Focus state for every button**: 2 px `{colors.accent}` ring with a 2 px offset.

### Inputs & Forms

**`text-input`** — the canonical field, used for every form.
- Background `{colors.surface-strong}`, text `{colors.ink}`, label above in `{typography.body-sm-strong}`, height 48 px, shape `{rounded.sm}`. No border at rest.
- Prefix icons in `{colors.mute}` (map pin for locations, weight icon for kg, calendar for dates).

**`text-input-focused`** — background flips to `{colors.canvas}` and a 2 px `{colors.accent}` border appears. No glow.

**`text-input-error`** — background `{colors.status-danger-bg}`, border `{colors.status-danger-text}`, helper text below in `{colors.status-danger-text}`. Errors are announced with `aria-live`.

Selects, date pickers, and number steppers share the same height, radius, and states.

### Cards & Containers

**`card-content`** — the canonical card.
- Background `{colors.canvas}`, 1 px `{colors.hairline}` border, padding `{spacing.xl}`, shape `{rounded.lg}`. Flat.

**`card-elevated`** — same card with Level 1 or Level 2 shadow; used for floating or hovered cards.

**`card-soft`** — `{colors.surface}` background, no border; used as a nested region.

**`card-on-dark`** — black card with white text and a white pill button; landing promo bands.

**`card-stat`** — dashboard number card.
- Label in `{typography.body-sm}` `{colors.body}`, value in `{typography.stat}`, optional caption below in `{typography.caption}`. Used for "Active shipments", "Available capacity (kg)", "Pending verifications".

**`request-form-card`** — the landing hero card.
- Stacked From, To, Pickup date, Weight inputs and a black "See trucks" pill. Level 2 shadow, max width 490 px.

### Search & Marketplace

**`search-bar-pill`** — the Airbnb-style global search.
- White, `{rounded.pill}`, 64 px tall, Level 2 shadow. Segments **From**, **To**, **Pickup date**, **Weight (kg)** separated by hairline dividers, each with a small label above the value.

**`search-orb`** — the black 48 px circle ending the search bar, white magnifier icon.

**`truck-card`** — a search result.
- White card, hairline border, `{rounded.lg}`, padding 16 px. Top: truck photo (4:3) with a "Verified" badge top-left. Below: route in `{typography.display-md}` ("Ahmedabad → Delhi"), vehicle type and pickup date in `{typography.body-sm}` `{colors.body}`, then a `capacity-bar` with "4,000 kg available of 10,000 kg". Bottom row: price (tabular) on the left and a black "Book" pill on the right. Hover applies Level 1 and a 2 px lift.

**`capacity-bar`** — 8 px pill track in `{colors.surface-strong}`; the occupied portion is `{colors.primary}`; above 90 percent the fill turns `{colors.status-danger-text}`. The numbers beside it use `{typography.body-tabular}`.

**`booking-panel`** — the sticky reservation card.
- White, hairline border, `{rounded.lg}`, padding 24 px. Contains the route summary, pickup date, goods weight, a price breakdown (base, platform fee, total in `{typography.display-md}`), and a full-width `button-large` "Confirm booking". On mobile it becomes a sticky bottom bar with price and a "Book" pill.

**`category-chip`** — grey pill filter ("Open truck", "Container", "Refrigerated", "Today"). The selected state (`category-chip-selected`) is a black pill with white text. Rows scroll horizontally on mobile.

### Status & Progress

**`status-badge-*`** — five variants (pending, booked, transit, delivered, rejected).
- Pill, 24 px tall, padding `{spacing.xxs} {spacing.sm}`, label in `{typography.badge}`, preceded by a 6 px dot in the text colour. Vehicle verification reuses these: Pending, Verified (delivered colours), Rejected.

**`tracker-step-*`** — the shipment stepper: Pending, Booked, In transit, Delivered.
- Done steps are filled black dots with a white check. The current step is a black dot with a 2 px `{colors.accent}` ring. Future steps are hairline outlines. Connecting lines are black for completed segments and hairline for the rest. Under the stepper sits the truck and driver card, and later a live map with a floating ETA pill.

### Navigation

**`nav-bar`** — the public sticky top nav.
- White, 64 px tall, hairline bottom border on scroll. Logo left, links centre, "Log in" (`button-secondary`) and "Sign up" (`button-primary`) right.

**`sidebar`** — the dashboard shell (Linear).
- 248 px wide, white, hairline right border, collapsible to 64 px. Logo on top, nav items in the middle, profile and logout at the bottom.

**`sidebar-item`** / **`sidebar-item-active`** — 40 px tall, `{rounded.sm}`, 18 px icon plus label. Active: `{colors.accent-soft}` background with `{colors.accent}` icon and text.

**`topbar`** — 56 px, white, hairline bottom border. Page title or breadcrumb left; search, notifications, and avatar menu right.

**`tab-pill`** — pill tabs for status filters ("All", "Pending", "In transit", "Delivered") and role selection on the register page.

**`footer`** — black band with white text, `{typography.body-sm}`.

### Tables

**`data-table-header`** — `{colors.surface}` background, `{typography.body-sm-strong}` in `{colors.body}`, no uppercase.

**`data-table-row`** — white, 52 px tall, hairline bottom border, hover `{colors.surface}`. Numeric columns are right-aligned in `{typography.body-tabular}`. Status columns use badges. Row actions sit in a trailing icon menu. Every table ships with a loading skeleton, an empty state, and pagination.

### Role Screens

**Sender dashboard** — sidebar: Overview, New shipment, My shipments, Find trucks, Profile. Overview has stat cards, a recent-shipments table, and the tracker for the latest in-transit shipment.

**Owner / company dashboard** — sidebar: Overview, Vehicles, Drivers, Bookings, Profile. Vehicles appear as cards or a table with a capacity bar, a verification badge, and the assigned driver's avatar. Create and edit forms open in a 480 px `drawer-panel`.

**`driver-action-card`** — mobile-first driver screen.
- Large card, `{typography.body-lg}` text, one primary action at a time ("Start journey", then "Mark as delivered") in a 56 px `button-large`. Shows the assigned truck, pickup and drop locations, weight, and date.

**`verification-pane`** — admin vehicle verification.
- Queue list on the left (vehicle number in mono, owner, submitted date, status badge) and detail on the right (specifications, documents). Footer actions: **Approve** (`button-primary`) and **Reject** (`button-danger`, requires a reason field). Stat cards above show Pending, Verified, and Rejected counts.

### Overlays & Feedback

**`modal-card`** — `{rounded.lg}`, Level 2 shadow, max width 480 px (640 px for forms), backdrop `rgba(0, 0, 0, 0.5)`.

**`drawer-panel`** — right-side panel, 480 px, for create and edit forms.

**`toast`** — white, `{rounded.md}`, Level 2 shadow, status icon on the left. Bottom-right on desktop, top on mobile.

**`empty-state-card`** — `{colors.surface}` card, 48 px icon, one line of text, one primary action ("Add your first vehicle").

**`skeleton-block`** — `{colors.surface-strong}` shapes matching the final layout. Never use a lone spinner for a full page.

### Landing Page

**`hero-band-light`** — white hero: `{typography.display-xxl}` headline on the left ("Ship only what you need"), `request-form-card` on the right, soft gradient wash behind the top third.

**`hero-band-dark`** — black band used mid-page for the truck-owner call to action, with a white pill button.

**Page rhythm**: hero, three-step "How it works" cards, black promo band ("Own a truck? Earn from empty space."), stats row (trucks, cities, kg shipped), FAQ, black footer.

**`faq-row`** — accordion rows with hairline dividers, no card chrome.

### Links

**`link-accent`** — inline link in `{colors.accent}`, no underline at rest, underline on hover, `{colors.accent-deep}` on hover.

## Motion
- **Durations**: 150 ms for hover and press, 250 ms for drawers and modals, easing `cubic-bezier(0.2, 0, 0, 1)`.
- **Page content**: fade in with an 8 px rise, once on mount.
- **Capacity bars and stat numbers**: animate once on first load.
- **Reduced motion**: when `prefers-reduced-motion` is set, remove transforms and keep only opacity fades.

## Accessibility
- Text contrast of at least 4.5:1; `{colors.mute}` is never used for essential text.
- Visible 2 px indigo focus ring on every interactive element.
- Tap targets of at least 44 px.
- Status always has a text label (and dot or icon), never colour alone.
- Every input has a visible label; errors are announced with `aria-live`.

## Implementation Notes

### Libraries (Vite + React)

| Purpose | Library |
|---|---|
| Styling | Tailwind CSS v4 (`@tailwindcss/vite`) |
| Components | **shadcn/ui** (built on Radix UI; the code is copied into your project so you own and restyle it) |
| Icons | lucide-react (shadcn's default icon set) |
| Font | `@fontsource-variable/inter` |
| Animation | `tw-animate-css` (installed by shadcn) and `motion` for page transitions |
| Forms | `react-hook-form` + `zod` (works with the shadcn form components) |
| Tables | `@tanstack/react-table` (shadcn's Data Table pattern) |
| Charts | shadcn Chart component (wraps `recharts`) |
| Toasts | `sonner` (shadcn's toast) |
| Maps (later) | `react-leaflet` |
| Dates | `date-fns` (used by the shadcn Calendar and date picker) |
| Class merging | `clsx` + `tailwind-merge` (shadcn creates the `cn()` helper for you) |

Use one library per job. shadcn/ui is the single source of UI components: if shadcn has it, use it instead of installing another component library.

### Why shadcn/ui

shadcn/ui is not a package you import from. The CLI copies component files into `src/components/ui/`, so you can edit them freely. That matters here: SmartHaul's look (black pills, 16 px cards, soft status badges) is a restyle of shadcn's defaults, done once in a handful of files, and every page inherits it. Components are accessible by default (keyboard, focus, screen readers) through Radix UI.

### Setup (JavaScript project, one-time)

1. **Install Tailwind**: `npm install tailwindcss @tailwindcss/vite`
2. **`vite.config.js`**: add the Tailwind plugin and the `@` alias:

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { fileURLToPath, URL } from "node:url";

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
});
```

3. **`jsconfig.json`** (project root) so the editor and shadcn understand the alias:

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": { "@/*": ["./src/*"] }
  }
}
```

4. **Initialise shadcn**: `npx shadcn@latest init`. Choose the **Neutral** base colour and accept the default `src/index.css`. If asked for TypeScript, choose No (the CLI writes `.jsx` files and sets `"tsx": false` in `components.json`).
5. **Replace the generated theme variables** in `src/index.css` with the SmartHaul tokens below.
6. **Add components** (the full starter set for SmartHaul):

```
npx shadcn@latest add button input label textarea select checkbox radio-group switch card badge table tabs dialog sheet dropdown-menu popover calendar sonner skeleton separator avatar progress tooltip sidebar accordion form
```

### CSS tokens (`src/index.css`)

shadcn reads its colours from CSS variables with fixed names (`--primary`, `--background`, and so on). The block below maps the SmartHaul palette onto those names, so every shadcn component picks up the brand automatically.

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "@fontsource-variable/inter";

@custom-variant dark (&:is(.dark *));

:root {
  /* shadcn semantic tokens mapped to SmartHaul */
  --background: #ffffff;
  --foreground: #0a0a0a;
  --card: #ffffff;
  --card-foreground: #0a0a0a;
  --popover: #ffffff;
  --popover-foreground: #0a0a0a;
  --primary: #000000;                 /* black action colour */
  --primary-foreground: #ffffff;
  --secondary: #efefef;               /* surface-strong: chips, inputs, subtle buttons */
  --secondary-foreground: #0a0a0a;
  --muted: #f7f7f7;                   /* surface: dashboard background, table headers */
  --muted-foreground: #5e5e5e;        /* body text */
  --accent: #efefef;                  /* shadcn hover background */
  --accent-foreground: #0a0a0a;
  --destructive: #b91c1c;
  --border: #e5e5e5;                  /* hairline */
  --input: #efefef;
  --ring: #533afd;                    /* indigo focus ring */
  --radius: 0.75rem;                  /* 12px: sm 8, md 10, lg 12, xl 16 */

  /* sidebar (Linear-style shell) */
  --sidebar: #ffffff;
  --sidebar-foreground: #5e5e5e;
  --sidebar-primary: #000000;
  --sidebar-primary-foreground: #ffffff;
  --sidebar-accent: #ecebff;          /* active item background */
  --sidebar-accent-foreground: #533afd;
  --sidebar-border: #e5e5e5;
  --sidebar-ring: #533afd;

  /* SmartHaul extras (not part of shadcn) */
  --brand: #533afd;
  --brand-deep: #4434d4;
  --brand-soft: #ecebff;
  --pressed: #e2e2e2;
  --mute: #9a9a9a;
  --pending-bg: #fff4d6;
  --pending-text: #8a5a00;
  --booked-bg: #e3edff;
  --booked-text: #1d4ed8;
  --transit-bg: #efe6ff;
  --transit-text: #6d28d9;
  --delivered-bg: #dcf5e4;
  --delivered-text: #15803d;
  --danger-bg: #fde4e4;
  --danger-text: #b91c1c;
}

.dark {
  --background: #0b0b0e;
  --foreground: #f5f5f7;
  --card: #141418;
  --card-foreground: #f5f5f7;
  --popover: #141418;
  --popover-foreground: #f5f5f7;
  --primary: #ffffff;
  --primary-foreground: #000000;
  --secondary: #1b1b21;
  --secondary-foreground: #f5f5f7;
  --muted: #141418;
  --muted-foreground: #a1a1aa;
  --accent: #1b1b21;
  --accent-foreground: #f5f5f7;
  --destructive: #f87171;
  --border: #26262d;
  --input: #1b1b21;
  --ring: #7b6cff;
  --sidebar: #0b0b0e;
  --sidebar-foreground: #a1a1aa;
  --sidebar-primary: #ffffff;
  --sidebar-primary-foreground: #000000;
  --sidebar-accent: #1b1b21;
  --sidebar-accent-foreground: #7b6cff;
  --sidebar-border: #26262d;
  --sidebar-ring: #7b6cff;
  --brand: #7b6cff;
}

@theme inline {
  --font-sans: "Inter Variable", system-ui, "Helvetica Neue", Arial, sans-serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;

  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);

  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);

  --color-brand: var(--brand);
  --color-brand-deep: var(--brand-deep);
  --color-brand-soft: var(--brand-soft);
  --color-pressed: var(--pressed);
  --color-mute: var(--mute);
  --color-pending-bg: var(--pending-bg);
  --color-pending-text: var(--pending-text);
  --color-booked-bg: var(--booked-bg);
  --color-booked-text: var(--booked-text);
  --color-transit-bg: var(--transit-bg);
  --color-transit-text: var(--transit-text);
  --color-delivered-bg: var(--delivered-bg);
  --color-delivered-text: var(--delivered-text);
  --color-danger-bg: var(--danger-bg);
  --color-danger-text: var(--danger-text);

  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);

  --shadow-1: 0 1px 3px rgba(10, 20, 60, 0.08);
  --shadow-2: 0 8px 24px rgba(10, 20, 60, 0.08), 0 2px 6px rgba(10, 20, 60, 0.04);
  --shadow-3: 0 2px 8px rgba(0, 0, 0, 0.16);
}

@layer base {
  * { @apply border-border outline-ring/50; }
  body {
    @apply bg-background text-foreground font-sans antialiased;
  }
}

.num { font-variant-numeric: tabular-nums; }
```

With `--radius: 0.75rem`, shadcn's `rounded-xl` is 16 px (cards, dialogs), `rounded-lg` is 12 px (dropdowns), and `rounded-sm` is 8 px (inputs). Pills use `rounded-full`.

### shadcn component mapping

| SmartHaul element | shadcn component | Restyle needed |
|---|---|---|
| Primary / secondary / danger buttons | `Button` | Yes: pill shape, 44 px height, new variants (see below) |
| Form fields | `Input`, `Textarea`, `Select`, `Label` | Yes: 48 px height, grey fill, indigo focus border |
| Cards, stat cards, truck cards | `Card` | Light: flat, hairline border, no shadow |
| Status and verification badges | `Badge` | Yes: pending, booked, transit, delivered, rejected variants |
| Dashboard shell | `Sidebar` (with `SidebarProvider`, `SidebarInset`) | Light: tokens already map the active item to indigo-soft |
| Data tables | `Table` + `@tanstack/react-table` | Light: header on `bg-muted`, 52 px rows |
| Status filters, role selector | `Tabs` | Yes: pill triggers |
| Filter chips | `Button` (secondary) or `Toggle` | Selected state is black |
| Create / edit vehicle, driver, shipment | `Sheet` (right side, 480 px) | None |
| Confirm reject, confirm booking | `Dialog` / `AlertDialog` | None |
| User and row action menus | `DropdownMenu` | None |
| Date picker (pickup date) | `Popover` + `Calendar` | None |
| Capacity bar | `Progress` | Yes: 8 px pill, black fill (red above 90 percent) |
| Loading placeholders | `Skeleton` | None |
| Notifications | `Sonner` toaster | None |
| Landing FAQ | `Accordion` | Light: hairline dividers, no card chrome |
| Driver and owner avatars | `Avatar` | None |
| Hover hints on icon buttons | `Tooltip` | None |
| Form validation | `Form` / `Field` with `react-hook-form` + `zod` | None |

Components with no direct shadcn equivalent are built from shadcn parts: the **search bar** (a pill `div` with four `Popover`/`Input` segments and a black circular `Button`), the **truck card** (`Card` + `Badge` + `Progress` + `Button`), the **booking panel** (`Card` + `Separator` + `Button`), and the **shipment tracker** (custom component using tokens).

### Restyling the base components (edit once, applies everywhere)

**`src/components/ui/button.jsx`**: replace the `buttonVariants` definition with:

```jsx
const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-[#282828]",
        secondary: "bg-secondary text-secondary-foreground hover:bg-pressed",
        outline: "border border-border bg-background text-foreground hover:bg-secondary",
        destructive: "bg-danger-bg text-danger-text hover:bg-danger-bg/70",
        ghost: "hover:bg-secondary",
        link: "text-brand underline-offset-4 hover:text-brand-deep hover:underline",
      },
      size: {
        default: "h-11 px-5 text-base",
        sm: "h-9 px-4 text-sm",
        lg: "h-14 px-6 text-lg",
        icon: "size-10",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
);
```

**`src/components/ui/input.jsx`**: set the class list to:

```
h-12 w-full rounded-sm border border-transparent bg-secondary px-4 text-base outline-none
placeholder:text-mute transition-colors
focus-visible:border-ring focus-visible:bg-background focus-visible:ring-0 focus-visible:border-2
aria-invalid:border-danger-text aria-invalid:bg-danger-bg
disabled:opacity-40
```

**`src/components/ui/card.jsx`**: keep `rounded-xl border bg-card`; remove `shadow-sm` so cards are flat. Use `hover:shadow-1` only on clickable cards (truck cards).

**`src/components/ui/badge.jsx`**: change the base to `rounded-full px-2.5 py-1 text-xs font-medium` and replace the variants with `pending`, `booked`, `transit`, `delivered`, `rejected`:

```jsx
variants: {
  variant: {
    pending: "bg-pending-bg text-pending-text",
    booked: "bg-booked-bg text-booked-text",
    transit: "bg-transit-bg text-transit-text",
    delivered: "bg-delivered-bg text-delivered-text",
    rejected: "bg-danger-bg text-danger-text",
    outline: "border border-border text-foreground",
  },
}
```

Then wrap it once as a reusable status badge, with the dot and the text label that the design rules require:

```jsx
// src/components/shipments/StatusBadge.jsx
import { Badge } from "@/components/ui/badge";

const MAP = {
  pending:   { variant: "pending",   label: "Pending" },
  booked:    { variant: "booked",    label: "Booked" },
  in_transit:{ variant: "transit",   label: "In transit" },
  delivered: { variant: "delivered", label: "Delivered" },
  verified:  { variant: "delivered", label: "Verified" },
  rejected:  { variant: "rejected",  label: "Rejected" },
};

export default function StatusBadge({ status }) {
  const s = MAP[status] ?? MAP.pending;
  return (
    <Badge variant={s.variant} className="gap-1.5">
      <span className="size-1.5 rounded-full bg-current" />
      {s.label}
    </Badge>
  );
}
```

**`src/components/ui/tabs.jsx`**: make `TabsList` `bg-transparent gap-2` and `TabsTrigger` `rounded-full px-4 py-1.5 bg-secondary data-[state=active]:bg-primary data-[state=active]:text-primary-foreground`.

**`src/components/ui/progress.jsx`**: set the track to `h-2 rounded-full bg-secondary` and the indicator to `bg-primary`; pass `className="[&>div]:bg-danger-text"` when usage is above 90 percent.

### Rules for working with shadcn
- Always add components with the CLI (`npx shadcn@latest add <name>`); never hand-copy from random sources.
- Restyle in `src/components/ui/` and in `index.css` tokens only. Do not scatter one-off colours across pages.
- Use semantic classes (`bg-primary`, `text-muted-foreground`, `border-border`) in pages, never raw hex values.
- Prefer composing shadcn parts over adding a second UI library.
- Do not edit a component's behaviour (Radix props) unless needed; edit only its classes.

### Folder structure

```
src/
  index.css                tokens (above)
  components/
    ui/                    shadcn/ui components (generated by the CLI, restyled)
    layout/                PublicNav, DashboardShell, Sidebar, Topbar
    shipments/             ShipmentForm, ShipmentTracker, StatusBadge
    trucks/                SearchBar, TruckCard, CapacityBar, BookingPanel
    admin/                 VerificationQueue, VerificationPane
  pages/
    public/                Landing, Login, Register
    sender/ owner/ company/ driver/ admin/
  lib/                     api.js (axios), utils.js (cn helper)
```

### Build order (one step at a time)
1. Install Tailwind, Inter, and shadcn/ui (setup steps above); paste the SmartHaul tokens into `src/index.css`; add the shadcn components.
2. Restyle the shadcn base components: Button, Input, Card, Badge, Tabs, Progress; create `StatusBadge`.
3. Redesign Login and Register as the first test page.
4. Build the dashboard shell (sidebar and top bar) and apply it to one dashboard.
5. Truck search: SearchBar, TruckCard, BookingPanel.
6. Shipment tracker and driver screens.
7. Admin verification view.
8. Landing page with the hero wash.
9. Polish: skeletons, empty states, motion, optional dark theme.

## Do's and Don'ts

### Do
- Reserve `{colors.primary}` black for the primary action in each area of the screen.
- Use `{rounded.pill}` on every button, chip, badge, tab, and the search bar.
- Render cards at `{rounded.lg}` 16 px with a hairline border; keep them flat.
- Use tabular figures and right alignment for every weight, price, and count.
- Show status as a soft badge with a dot and a text label.
- Show capacity as a bar plus numbers ("4,000 kg available of 10,000 kg").
- Use the Linear shell (sidebar, top bar, dense tables) for every logged-in dashboard.
- Reuse one Button, one Badge, and one Card component everywhere.
- Ship empty, loading, and error states with every list and table.
- Use polarity-flipped black bands on the landing page to break up white-on-white rhythm.

### Don't
- Don't introduce more accent colours (no orange, green, or pink buttons). The status pairs are the only extra colours.
- Don't use indigo as a button fill, card fill, or section background; it is for focus, links, and the active sidebar item.
- Don't use all-caps headlines or weight-700 button labels.
- Don't mix sharp rectangles and pills in the same toolbar.
- Don't put a shadow on every card; shadows belong to floating elements.
- Don't use colour alone to show status.
- Don't use stock photography for hero art; use editorial illustrations.
- Don't apply the gradient wash anywhere except the landing hero.
- Don't use `{colors.mute}` for essential text.
- Don't ship a full-page spinner where a skeleton would do.