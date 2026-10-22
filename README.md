# 10,000 Hours

A tracker for people who intend to become *trained enthusiasts* — not dabblers, not professionals by
accident, but people putting in the hours on purpose.

One skill, one page. A year of days laid out as a contribution graph. Three numbers that tell you
where you are, when you'll arrive, and whether you're actually moving. Click a square, type the hours,
close it. That's the whole loop.

---

## The premise

The 10,000-hour idea is often misread as a promise. It isn't. It's a unit of seriousness: a way to
make the distance visible, and to keep it visible on the days when nothing feels like progress.

Most habit apps optimise for the streak. This one optimises for the **trajectory**. A streak can be
kept alive with five minutes; a trajectory cannot. The graph is the memory, the three figures are the
diagnosis, and the only input is the honest number of hours you actually worked.

The audience is specific: someone learning piano, drawing, programming, running, Japanese — a skill
they chose, not one their job assigned. They don't need badges. They need a clean instrument and a
reason to open it tomorrow.

---

## What it does

### The graph

A GitHub-style contribution graph, 53 weeks wide, one cell per day. Colour intensity is relative to
*that skill's* daily target, so a cell at level 3 always means "on cadence", whatever the skill. Each
skill has its own hue — violet for piano, azure for drawing, green for programming, amber for running,
rose for Japanese — and the page takes on that hue in its data ink only.

The current week is partial because the future isn't rendered. Unlogged days sit at the palest grey,
waiting. The graph is both a record and an invitation.

### The three figures

| | Question | Visual |
| --- | --- | --- |
| **Cumulative** | How much have I actually done? | Hours, with a hairline bar toward 10,000 |
| **ETA** | When do I arrive at this pace? | A month and year, with a dot on a 0–10 year ruler |
| **Pace** | Am I moving fast enough? | h/day, with a 14-day sparkline and target line |

Each is one value, one visual, and a hint that appears only when you hover. No dashboard, no chart
junk, no percentage shouting for attention.

Pace is the mean over the **last 28 calendar days, including zero days**. That is deliberate. It
prevents one heroic weekend from producing a flattering completion date. The ETA is allowed to be
disappointing; that's what makes it useful.

### Logging

Click any cell. A small popover opens above it with the date, a large borderless input, and three
quick-adds (`+½`, `+1`, `+2`). Type, press `Enter`, and the square pulses, the bar grows, the numbers
count up from their previous values. `Esc` or a click outside cancels. `clear` deletes the day.

The graph is the date picker. There is no separate "add session" form, no notes field, no duration
wheels. One gesture from thought to recorded hour.

### Retargeting

The target in the subline — `3 h/day` — is editable. Tap it and a small slider opens under the text:
drag for coarse movement, use `−`/`+` for quarter-hour precision, then `save`. The graph repaints
live as the target moves, so you can see what "on cadence" will mean before you commit it. `Esc` or a
click outside restores the old target.

This is deliberately a different instrument from logging. A session is a number you type; a target
is a scale you calibrate.

### Timing a session

Press and hold any day and a stopwatch starts for it. A quiet bar appears at the bottom of the
console: the skill and date, the clock, the day's progress toward target, and two actions.
`log` rounds the elapsed time to the nearest minute and adds it to that day; `discard` drops it. The
clock keeps running when you release the press — stopping is always explicit.

The bar exists only while a clock runs. One session runs at a time: holding another day logs the
first and starts the second. Switching skills does not stop the clock, and the bar keeps the timed
skill's hue until you end it. Keyboard users reach the same session through `timer` in the logger.
The whole gesture is specified in [`design.md` §18](./design.md#18-live-session--press-and-hold-to-time).

### Setting hours with a swipe

Press a day, keep the finger down, and drag: the square follows your hand and a small readout appears
beside it with the date, the new total, the change, and a hairline ruler from 0 to 24 hours. Release
to log it; `Esc` puts it back. Eleven pixels is a quarter hour at first, then the same travel buys
more as the drag continues, so a day can go from empty to eight hours in one gesture. A still press is
still the stopwatch, a flick still scrolls the page, and a sideways drag still moves the graph.
Ending where you started writes nothing.

The header hint reads `hold a day to time it · drag to set hours` and retires after the first session
or the first swipe. The gesture is specified in
[`design.md` §20](./design.md#20-swipe-to-log--press-a-day-drag-vertically).

### Milestones

Below the three figures, a row of eleven cards marks fixed thresholds — `1`, `10`, `25`, `50`, `100`,
`250`, `500`, `1,000`, `2,500`, `5,000`, `10,000` hours. Each stays grey until the skill's total crosses
it, then is struck gold; the nearest unachieved card carries a thin progress hairline and opens centred
when you land on the page. A crossing announces once and settles a single card, never a loop, and only
the highest threshold of a many-threshold write speaks. The `10,000` card alone has a distinct double
rim. The row is the only place gold appears in the interface; it is not a badge wall — nothing is
awarded for showing up, and every card marks hours the graph already counts. The material and the three
states are specified in [`design.md` §21](./design.md#21-milestones--struck-gold).

### Getting around

The icon rail holds one page per skill. Arrow keys move between skills; the rail's active marker
animates in, the canvas rises into place. On small screens the rail becomes a bottom bar.

The rail ends with an add button. It opens a small dialog — a name, an icon (42 line glyphs, from
piano and guitar to flask, scales, and binoculars), a hue, a daily target — and the new page arrives
empty, because the graph is the invitation. The icon picks itself as you type: name the skill
`guitar for beginners` and the guitar lights up behind a quiet `icon · guitar` line, with misspellings
(`gutar`) and partials (`guit`) resolving sensibly. Pick a glyph by hand and it stays picked. `Enter`
in the name field creates; `Esc` or a backdrop click cancels. New skills are not seeded with demo
hours; the first square is yours to fill.

Skills can be removed with the same restraint. Press and hold a rail icon — or right-click it, or focus
it and press `Delete`/`Backspace` — and a short confirm names the skill and what will be lost:
`42 sessions · 531 h will be removed.` Nothing is added to the rail at rest: no menu, no dot, no
delete button. `Esc` or `cancel` leaves everything intact, and the last remaining skill cannot be
deleted (`Keep at least one skill.`).

### Keyboard

The console is fully drivable from the keyboard, and the palette is the front door. `⌘K` (or `Ctrl+K`)
opens a command palette: type to fuzzy-find a skill or an action — `New skill…`, `Edit daily target…`,
`Log today…`, start or stop the session, `Delete…`, `Keyboard shortcuts`, `Switch to…` — then arrow to
it and press `Enter`. `?` opens the shortcut cheatsheet; `1`–`9` jump straight to a skill, `↑`/`↓`
(or the rail's `←`/`→`) move between them, and `N`, `T`, `L`, `S`, `D` reach new-skill, retarget,
log-today, the stopwatch, and delete. Single keys stay quiet while you are typing or while a surface is
open, and `Esc` always closes the topmost one. No browser shortcut is overridden.

---

## Philosophy

**Hours are the only currency.** No points, no levels, no badges. The milestone row is the single
ornament, and it marks the same hours the graph already counts: a threshold crossed, never an award for
showing up. The number is the reward, and it is allowed to be small.

**Projection beats motivation.** A completion date is a more honest coach than a streak counter. It
tells you what your current behaviour actually amounts to.

**Visual before verbal.** If a fact can be a bar, a dot, a sparkline, or a cell, it should not be a
sentence. Labels exist to anchor visuals, not to explain the product.

**Calm by default, precise on approach.** Most of the evidence is one hover away. The resting page is
quiet enough to leave open on a second monitor; the engaged page answers exactly what you asked.

**One accent per skill.** Colour is identity, not decoration. The interface itself is black, white,
and hairline grey. Nothing is tinted for style.

**Nothing bounces.** Motion exists to report change — a logged cell, a number moving, a page arriving.
One ease-out family, no springs, no confetti. Restraint is the aesthetic.

**Own the data.** Local-first by intent: the record of your practice should be a file you can read,
not a metric inside someone else's product.

---

## Design

The full specification — tokens, type scale, components, motion catalogue, data semantics, copy,
accessibility floors, and rules for extending the system — lives in [`design.md`](./design.md).

The short version:

- White canvas, Inter at weights 100–300, 14px body, `-0.01em` tracking.
- Structural hairlines at `1px #f1f1f1`; no cards, shadows, gradients, or glass.
- 12px contribution cells, 3px gaps, 2.5px radius, hover scale 1.4 with a thin black ring.
- One skill hue per page, expressed only in data ink (cells, bars, ruler dot, sparkline).
- Metric tiles separated by hairlines; a 1px black rule sweeps in on hover.
- Detail revealed on hover, never required for comprehension.
- Single easing curve: `cubic-bezier(.2,.8,.2,1)`.

---

## Status

This repository currently holds a **design prototype**, not a finished app.

- [`index.html`](./index.html) — self-contained HTML/CSS/JS prototype. No build step, no
  dependencies beyond the Inter webfont. **Variant 1 — "Console"** is final and is the only UI in
  the file: the rail, the 42-icon add-skill dialog, the graph, the three metrics, the milestone row,
  the logger, the target slider, the press-and-hold stopwatch, the press-drag swipe that sets a day's
  hours, gesture-only skill deletion, and the `⌘K` command palette with its shortcut layer. Variants 2
  and 3 have been removed.
- Data is **seeded demo data**, generated deterministically in the browser. Logging works for the
  session, but nothing is persisted yet; a running stopwatch is lost on reload. A skill created in
  the dialog starts with an empty log.
- [`design.md`](./design.md) — the canonical design system for everything built next. Its **§17
  Archive** keeps the reusable components from the retired variants (ring, pill nav, centered cards,
  sidebar list, mini bars, comparison rows) with full specifications.

### Running it

Open `index.html` in a browser. That's it.

```
open index.html
```

---

## Roadmap

Near term, in order:

1. **Console polish.** Tighten hover and keyboard states, verify the graph at every breakpoint, and
   finish the reduced-motion pass.
2. **Persistence.** Local storage first, with an exportable JSON file. No account required. Persist
   an in-flight session as `{skill, day, startedAt}` so a refresh can resume the clock against the
   same day.
3. **Real logging.** Accessible dialog semantics, cell hit areas on touch, a visible focus state in
   the input, and a polite live-region announcement on commit.
4. **Skill management.** Creation ships as the rail's add dialog (name, icon, hue, target), the
   subline target is editable, and deletion ships as a gesture-only confirm on the rail with a
   last-skill guard. Still to come: rename, reorder, archive — using the modal and form patterns
   already specified in `design.md`.
5. **Overview.** A single page that lists every skill as a hairline row with its own mini ramp and
   the same three figures — built from the archived Ledger row in `design.md` §17.3.
6. **Import / export.** CSV and JSON, so a decade of hours is never trapped.

Deliberately not planned: social feeds, leaderboards, notifications, streaks as a primary metric,
gamified badges, AI coaching. The product's value is its quietness.

---

## Project structure

```
.
├── index.html    # self-contained Console prototype (Variant 1 only)
├── gallery.html  # standalone port of the React Bits DraggableGrid hobby gallery
├── images/       # 20 hobby images used by gallery.html
├── design.md     # design system, tokens, motion, semantics, §13.11 name→icon, §17 archive, §18 live session, §20 swipe, §21 milestones
├── reference.html
└── README.md     # this file
```

---

## Principles for contributors

- Read `design.md` before adding a surface. If a new element isn't covered, extend the system
  deliberately and document it there.
- Prefer removing an element to styling it.
- Never introduce a second accent, a second icon family, or a second easing curve.
- Keep derived numbers in one place. The graph, the tiles, and any future overview must agree.
- If a change makes the page louder without making it clearer, it's the wrong change.

---

*Ten thousand hours is not a deadline. It's a direction.*
