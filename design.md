# 10,000 Hours — Design System

**Status:** Canonical. Describes **Variant 1 — "Console"**, the product UI. Variants 2 ("Orbit") and 3 ("Ledger") are removed from interface and codebase; their styles live in **§17 — Archive**.
**Source of truth for the visual implementation:** [`index.html`](./index.html).
**Scope:** product UI, motion, data semantics, copy, extension rules.

If a future screen disagrees with this document, the document wins until deliberately revised.

---

## 1. The idea in one paragraph

A skill gets a page: mostly white, mostly empty, one number growing. The graph is the memory, the three figures the diagnosis, the popover the only place the user types. Nothing competes with the data: no shadowed cards, gradients, illustration, or chrome. Colour belongs to the skill, never the interface.

**One-line brief:** white canvas, hairline structure, thin type, one accent per skill, visuals before words, detail on approach.
---

## 2. Principles

1. **The number is the interface.** Hierarchy by size and weight, not boxes. A metric = value + unit + small evidence.
2. **Visual before verbal.** A fact that can be a bar, ruler dot, sparkline, or cell is not a sentence; text only anchors a visual.
3. **One accent per skill.** Hue is *data ink* only (cells, fills, dots, spark bars); chrome stays black/white/grey — never a border, button, or heading.
4. **Quiet by default, precise on approach.** Secondary evidence hidden until hover/focus.
5. **Motion reports change.** Only when a value changed, a surface arrived, or a control acknowledged a press; no ambient motion, no loops.
6. **Thin, not weak.** Weight 100–300 carries type; numbers tabular, rules exact, alignment merciless. Lightness from space, not vagueness.
7. **Nothing bounces.** One ease-out family; no springs, overshoot, or elastic.
---

## 3. Reference layout

Variant 1: two-column shell — fixed icon rail + centered canvas.

```
┌──────┬──────────────────────────────────────────────────────────────┐
│      │                                                              │
│  ◉   │   Piano                                                      │
│  ○   │   Tracking since Jan 2025 · target 3 h/day        less ▪▪▪▪ more
│  ○   │                                                              │
│  ○   │   Jan   Feb   Mar   Apr   May   Jun   Jul   Aug   Sep        │
│  ○   │   ░░░░ ░▓░░ ░░░▓ ░░░░ ░▓▓░ ░░░░ ░░░▓ ░░░░ ░▓░░ ░░░░          │
│      │   ░░▓░ ░░░░ ░░░░ ▓░░░ ░░░░ ░▓░░ ░░░░ ░░░░ ░░░░ ▓░░░          │
│      │   … 53 weeks × 7 days …                                      │
│      ├──────────────────┬──────────────────┬──────────────────────┤
│      │ ◷ CUMULATIVE     │ ▤ ETA            │ ∿ PACE               │
│      │ 1,284 h          │ Mar 2028         │ 1.4 h/day            │
│      │ ▬▬▬▬▬▬░░░░░░░░   │ ···•··········   │ ▁▂▅▃▆▂▁▄▅▇▃▂▅        │
│      └──────────────────┴──────────────────┴──────────────────────┘
└──────┴──────────────────────────────────────────────────────────────┘
   72px                     max 1020px, 56px gutters
```

- Rail `72px`, sticky, hairline right border.
- Canvas `max-width:1020px` (border-box, incl. gutters), `padding:74px 56px 140px`, centered in remaining space.
- Rhythm: header → graph `46px` → three tiles → milestone band (§21).
- Bottom `140px`: the page ends in air.

---

## 4. Tokens

### 4.1 Colour — interface

All interface colour is neutral; values are exact. Move them into CSS custom properties when componentised.

| Token | Value | Use |
| --- | --- | --- |
| `--bg` | `#ffffff` | page, rail, popover, modal |
| `--ink` | `#101010` | primary text, hero numbers |
| `--ink-strong` | `#111111` | active controls, tooltip/primary bg, focus ring |
| `--ink-muted` | `#7a7a7a` | meta emphasis (`<b>`), hovered rail icons |
| `--ink-soft` | `#b8b8b8` | subline, since metadata |
| `--ink-faint` | `#c6c6c6` | month axis labels |
| `--ink-ghost` | `#dcdcdc` | keyboard hints |
| `--ink-placeholder` | `#e2e2e2` | input placeholders |
| `--line` | `#f1f1f1` | dividers, top rule, borders |
| `--line-soft` | `#f3f3f3` | rail border, separators |
| `--line-faint` | `#f6f6f6` | popover dividers |
| `--surface-hover` | `#fafafa` | rail/row hover |
| `--surface-sunken` | `#f7f7f7` | quick-add, selected rows |
| `--cell-empty` | `#f4f4f4` | level-0 cell |
| `--danger` | `#c93a3a` | destructive text (hover) |
| `--accent` | `hsl(var(--hue) 55% 52%)` | bars, ruler dot, accent |
| `--accent-spark` | `hsl(var(--hue) 45% 80%)` | sparkline bars |

Icons use opacity, not extra greys: `opacity:.75` for line icons in labels.

### 4.2 Colour — skill hues

Each habit owns a hue, set on the page root as `--hue`, inherited by every visual; nothing else sets it. Hues are distinguishable at 44–58% lightness on white and survive the level ramp.

| Skill | Hue | Character |
| --- | --- | --- |
| Piano | `268` | violet |
| Drawing | `205` | azure |
| Programming | `152` | green |
| Running | `24` | amber |
| Japanese | `338` | rose |

Reserved hues for new skills: `45` (ochre), `185` (teal), `292` (magenta), `96` (moss). Never hue for red/danger; danger is always `#c93a3a`.

### 4.3 Contribution levels

Levels encode hours against the skill's daily target, so the five-step ramp means the same across skills.

| Level | Formula | Fill |
| --- | --- | --- |
| 0 | no entry | `#f4f4f4` |
| 1 | `r < 0.4` | `hsl(h 42% 88%)` |
| 2 | `0.4 ≤ r < 0.8` | `hsl(h 48% 74%)` |
| 3 | `0.8 ≤ r < 1.15` | `hsl(h 52% 58%)` |
| 4 | `r ≥ 1.15` | `hsl(h 58% 44%)` |

`r = hours / target`. Level 3 = "on cadence"; level 4 = "above cadence". The ramp is monotonic in lightness and saturation; never hue-shift inside a ramp.

### 4.4 Typography

**Family:** Inter, weights `100 200 300 400 500` (Google Fonts). **Fallbacks:** `-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif`. **Defaults:** `14px / 1.4`, weight `300`, letter-spacing `-0.01em`, antialiased.

| Role | Size | Weight | Tracking | Colour | Notes |
| --- | --- | --- | --- | --- | --- |
| Page title (`h1`) | `34px` | `200` | `-0.035em` | `#101010` | line-height `1` |
| Hero metric | `31px` | `200` | `-0.035em` | `#101010` | `font-variant-numeric: tabular-nums` |
| Date metric | `22px` | `200` | `-0.02em` | `#101010` | no wrap |
| Body | `14px` | `300` | `-0.01em` | `#101010` | |
| Subline | `11.5px` | `300` | inherited | `#b8b8b8` | emphasis `#7a7a7a`, weight 300 |
| Unit | `11px` | `300` | inherited | `#c2c2c2` | baseline-aligned, `5px` from value |
| Micro label | `9px` | `400` | `0.13em` | `#bdbdbd` | uppercase |
| Axis label | `9px` | `400` | `0.09em` | `#c6c6c6` | uppercase |
| Hint | `9.5px` | `300` | `0.04em` | `#c9c9c9` | reveal on hover |
| Tooltip | `10.5px` | `300` | `0.02em` | `#ffffff` on `#111111` | tabular numbers |
| Logger date | `10px` | `400` | `0.1em` | `#bdbdbd` | uppercase |
| Logger input | `26px` | `200` | `-0.03em` | `#111111` | tabular numbers |
| Popover hint | `9.5px` | `300` | `0.06em` | `#dcdcdc` | "↵ log · esc" |

Rules: never weight `600`+ or `700` for data (emphasis order: size, colour, weight `400`); numbers tabular, units separate/smaller/lighter; uppercase only for micro labels + logger date (tracking compensates); no `text-transform` on habit names.

### 4.5 Space, radius, border, shadow

**Spacing** follows a 2px grid; prototype literals map onto these steps.

| Token | Value | Typical use |
| --- | --- | --- |
| `--s-1` | `2px` | hairline offsets |
| `--s-2` | `4px` | icon-to-label, quick-add |
| `--s-3` | `6px` | tooltip padding-y, gaps |
| `--s-4` | `8px` | small stacks |
| `--s-5` | `11px` | subline offset, quick-add |
| `--s-6` | `13px` | popover padding |
| `--s-7` | `20px` | value-to-visual, header |
| `--s-8` | `28px` | tile padding |
| `--s-9` | `42px` | header → graph |
| `--s-10` | `56px` | canvas gutter |
| `--s-11` | `74px` | canvas top |
| `--s-12` | `140px` | canvas bottom |

**Radius:** `2.5px` cell · `6px` tooltip/legend swatch · `7px` quick-add · `8px` standard button · `11px` archived sidebar row (§17.3) · `12px` rail button · `14px` popover · `18px` modal/dialog and floating session bar (§18) · `999px` pills.

**Borders:** always `1px` — structural `#f1f1f1`, chrome `#f3f3f3`, internal `#f6f6f6`. No 2px, no coloured borders.

**Shadows:** only for surfaces floating above the page; tiles, sections, panels, buttons never cast one.

| Token | Value | Use |
| --- | --- | --- |
| `--shadow-pop` | `0 16px 40px -12px rgba(0,0,0,.18), 0 2px 8px rgba(0,0,0,.04)` | logger |
| `--shadow-modal` | `0 24px 60px -16px rgba(0,0,0,.22), 0 2px 10px rgba(0,0,0,.04)` | modal |
| `--shadow-pill` | `0 8px 24px -12px rgba(0,0,0,.12)` | floating pill |
| `--ring-cell` | `0 0 0 1.5px rgba(0,0,0,.5)` | hovered cell |

### 4.6 Motion

One easing family: **`cubic-bezier(.2, .8, .2, 1)`** (`--ease-out`). Linear only for a decorative opacity fade; never ease-in-out or bounce.

| Token | Value | Use |
| --- | --- | --- |
| `--d-press` | `120ms` | press scale |
| `--d-tip` | `140ms` | tooltip |
| `--d-pop` | `160ms` | logger enter, session bar enter |
| `--d-hover` | `180ms` | icon/button hover, cell transform, arm bloom |
| `--d-chrome` | `280ms` | rail selection, control colour |
| `--d-hint` | `320ms` | hover hint reveal |
| `--d-hold` | `380ms` | hold-to-time threshold (§18) |
| `--d-rule` | `450ms` | tile top rule |
| `--d-view` | `500ms` | page enter |
| `--d-pulse` | `550ms` | logged-cell acknowledgement |
| `--d-count` | `850ms` | number count-up |
| `--d-bar` | `950ms` | bar fill, ruler dot |
| `--d-spark` | `800ms` | sparkline growth |
| `--d-ring` | `1400ms` | archived cumulative ring (§17.2) |

### 4.7 Z-index

| Layer | Value |
| --- | --- |
| Hovered cell | `5` |
| Rail | `10` |
| Scrub readout (§20) | `200` |
| Session bar (§18) | `240` |
| Logger popover | `250` |
| Tooltip | `300` |
| Floating pills / archived topbar (§17.2) | `400` |
| Modal / sheet | `500` |
| Toast | `600` |

Tooltips sit above popovers: hovering a cell with the logger open must not be occluded. The session bar sits below both: logging is never covered by a running clock. The scrub readout sits above the cells and below every surface.

### 4.8 Root block

§4.1–4.6 values ship as `:root` custom properties (`--rail:72px`, `--canvas:1020px` included); no other literal hex in components.
---

## 5. Layout system

### 5.1 Shell

```
.console { display:flex; min-height:100vh }
.rail    { width:72px; flex:0 0 72px; position:sticky; top:0; height:100vh;
           display:flex; flex-direction:column; align-items:center; gap:4px;
           padding:30px 0; border-right:1px solid #f3f3f3; background:#fff; z-index:10 }
.canvas  { flex:1; width:100%; max-width:1020px; margin:0 auto; padding:74px 56px 140px }
```

The rail is the only persistent skill navigation (`--rail:72px`, `--canvas:1020px`): six skills fit (`6 × 44 = 264px`); beyond that, a "more" affordance.

### 5.2 Page rhythm

| Block | Margin below | Notes |
| --- | --- | --- |
| Header (title + subline + legend) | `42px` | legend baseline-aligned to title block |
| Graph block | `46px` | horizontal scroll inside, no visible gutter |
| Metric tiles | `28px` | then the milestone band (§21) |
| Milestone band | — | page ends after `140px` canvas padding |

If two blocks feel crowded, add space, never a border or background.

### 5.3 Grid

Graph: `grid-auto-flow:column`, `grid-template-rows:repeat(7,var(--cell))`, `grid-template-columns:repeat(53,var(--cell))`, `gap:var(--gap)`; metric row `grid-template-columns:repeat(3,1fr)`, `border-top:1px solid #f1f1f1`. Tiles divided by `1px` vertical hairlines, not gutters; the first tile drops its left padding to align with the page title.

### 5.4 Breakpoints

| Width | Behaviour |
| --- | --- |
| ≥ 1024px | Full console; 53-week graph fits without scrolling at `12px` cells |
| 861–1023px | Graph scrolls horizontally; canvas gutters reduce to `40px` |
| ≤ 860px | Rail becomes a bottom bar (§12); tiles stack; canvas padding `48px 26px 130px`; `h1` `28px` |
| ≤ 520px | Graph scrolls; tiles full width; logger clamps to `10px` viewport margins |

Never shrink cells below `10px`; never drop columns — the graph's meaning depends on a full year.
---

## 6. Components

### 6.1 Icon rail

Container `72px`, sticky, `padding:30px 0`, `gap:4px`, `border-right:1px solid #f3f3f3`; button `40 × 40px`, radius `12px`, icon `19 × 19`, stroke `1.2`, round caps and joins, `fill:none`. Rest `#cbcbcb`, hover `#8a8a8a` + `#fafafa` `280ms`, press `scale(.93)` `120ms`, active `#111`; marker `3 × 14px`, radius `2px`, `#111`, `left:-16px`, centred, `railIn` height `0 → 14px`, opacity `0 → 1`, `380ms`. One 24-box icon per skill (§6.2); no emoji or fills; tooltip = skill name.

Add: final `40 × 40px` `plus` → create dialog (§13.8); desktop rail bottom (`margin-top:auto`), after the skills in the bottom bar; no hue or marker; tooltip `Add skill`. Delete: gesture only, no resting affordance — hold `550ms`, right-click, or focus + `Delete`/`Backspace` (§6.13).

### 6.2 Iconography

A closed set of 42 24×24 line icons, `stroke:currentColor`, `stroke-width:1.2–1.4`, `stroke-linecap:round`, `stroke-linejoin:round`, `fill:none`, grouped by territory so the picker reads as a vocabulary:

| Territory | Icons |
| --- | --- |
| Music | piano, guitar, drums, mic |
| Visual | drawing, camera, film, palette, brush |
| Technical | code, terminal, gamepad, pen |
| Body | bicycle, run, waves, lotus, dumbbell, mountain, sprout |
| Craft | book, quill, yarn, vase, scissors, pan |
| Mind | japanese, globe, speech, chess, math, flask, star |
| Work | briefcase, chart, scales, stethoscope |
| Travel | sailboat, plane, car |
| Field | museum, binoculars |

Paths in `ICONS`; picker order = `ICON_CHOICES`, `book` first (default). Functional icons: `clock` cumulative, `cal` ETA, `pulse` pace, `plus` add. No second family. Micro-label icons `11px`, `opacity:.75`. Every glyph: two to four strokes, no fills, legible at `19px`; new icons drawn on the 24-box at optical size, checked at `19px`.

### 6.3 Page header

```html
<header class="head">
  <div>
    <h1>Piano</h1>
    <p class="hsub">Tracking since <b>Jan 2025</b> · target
      <button class="hsub-target" type="button">3 h/day</button></p>
  </div>
  <div class="legend">less ▪▪▪▪▪ more</div>
</header>
```

`display:flex; align-items:flex-end; justify-content:space-between; gap:24px`.

Subline: metadata, not a sentence — values in `<b>`, weight `300`, `#7a7a7a`, separators `·`. Target: the one editable value — borderless `<button>`, same size/weight as the meta, `1px #ececec` bottom rule, hover/focus `#111` text and rule, opens the target editor (§6.7). Legend `9px`, uppercase, `0.09em`, `#c8c8c8`; swatches `11px`, cells' radius and ramp; `less`/`more` flank them, `3px` side margins.

Empty subline `No sessions logged yet · target 3 h/day`; target stays visible for calibration, never blank, header keeps its height. Hold hint (§18, §20): below the legend, right-aligned, `9.5px/300`, `#767676`, removed after the first live session or first scrub.

### 6.4 Contribution graph

53 columns × 7 rows = 371 cells, one per day, weeks starting Sunday, oldest left. Window: the Sunday 52 weeks before the current week's Sunday → today; **future days are not rendered** — the in-progress week is partial.

Month axis `13px` tall, `7px` below-gap; label at the grid column of the first week whose Sunday falls in a new month, `grid-column:w+1`; 3-letter title case (`Jan`), `9px`, `0.09em`, `#c6c6c6`; clips at the right edge. Scroll `overflow-x:auto; overflow-y:hidden`, `6px` scrollbar, thumb `#eee` → `#ddd` on hover, transparent track; no border, background, or card — the grid *is* the surface.

### 6.5 Cell

| Property | Spec |
| --- | --- |
| Geometry | `var(--cell)` default `12px`; radius `2.5px`; gap `var(--gap)` default `3px`; no border |
| Base fill | `#f4f4f4` |
| Transition | `background-color .4s ease, transform .18s var(--ease-out), box-shadow .18s ease` |
| Hover | `scale(1.4)`, `z-index:5`, ring `0 0 0 1.5px rgba(0,0,0,.5)` |
| Focus | `outline:2px solid #111; outline-offset:1px` (required in production) |
| Press | no scale beyond hover; opens the logger |
| Logged | `cellPulse` `1 → 1.75 → 1`, `550ms`; restart by removing the class, forcing reflow, re-adding |
| Arming (§18) | `scale(1.55)`, ring `0 0 0 1.5px #111`, halo `0 0 0 5px rgba(0,0,0,.07)`; `180ms` |
| Live (§18) | ring `0 0 0 1.5px #111`, `z-index:4`; bottom-up accent fill at `elapsed / target` |
| Session fill | `::after`, `left/right/bottom:0`, `height` transitions `900ms`; clipped by the radius |

`<button type="button">`, `aria-label="Oct 21, 2.5 hours"`, `data-k` (day key), `data-v` (hours), `data-l` (level, derived, never authored). Hover transforms wrap in `@media (hover:hover) and (pointer:fine)`.

### 6.6 Tooltip

Fixed, `pointer-events:none`, `z-index:300`, bg `#111`, text `#fff`; padding `5px 9px`, radius `6px`, `10.5px/300`, `0.02em`, tabular. Content `Oct 21 · 2.5 h`; empty `Oct 21 · —`. Hidden `translate(-50%,-140%) scale(.94)` → visible `translate(-50%,-150%) scale(1)`, `140ms`, opacity `0 → 1`; anchored top-center of the cell; hidden on scroll and on leaving. Redundant with the cell's accessible name; `aria-hidden="true"`.

### 6.7 Logger popover

Only text-entry surface: a calculation, not a form. Order: date line (`TUE, OCT 21`, `10px/400/.1em/#bdbdbd`) · borderless value + `12px #c4c4c4` unit · `1px #eee` rule · quick-add row (`height:26`, radius `7`, `#f7f7f7`) · `1px #f6f6f6` rule · footer (`clear`, `timer` `10px #767676`; `↵ log · esc` `9.5px #dcdcdc`).

| Property | Spec |
| --- | --- |
| Panel | `198px` fixed; `#fff`, `1px solid #ececec`, radius `14px`, `--shadow-pop`, padding `13px 13px 10px` |
| Position | centered above the cell, `12px` gap; flip below if `top < 10`; clamp axes to `10px` |
| Enter | `hidden=false` → remove `.on` → rAF add `.on`; focus + select after `40ms`; opacity `0→1`, `translateY(6px) scale(.96)` → none, `160ms` |
| Exit | remove `.on`; `hidden` after `180ms` |
| Input | borderless, transparent, `26px/200`, tabular, spinner removed |
| Quick add | relative `+0.5 / +1 / +2`; commits immediately and closes |
| `clear` | commits `0`, deleting the day's entry |
| `timer` | closes without committing; starts the live session (§18) for that day |
| Keyboard | `Enter` commits, `Esc` closes, click-away closes |
| Clamp | hours `0–24`; manual entry normalised to whole minutes |
| Prefill | the day's existing value, selected on open; placeholder `0` |

No visible box, focus ring, or label; date line and `h` supply context; keyboard focus is exposed via the dialog's accessible name.

**Target editor.** Tapping the subline target opens a smaller anchored editor: slider + quarter-hour steppers, not text — calibration, not logging. Same surface and motion as the logger. Label `DAILY TARGET` `10px/400/.1em/#bdbdbd`.

| Property | Spec |
| --- | --- |
| Panel | `224px` fixed; `#fff`, `1px solid #ececec`, radius `14px`, `--shadow-pop`, padding `13px 13px 10px` |
| Position | centered below the target button, `10px` gap; flip above if it would cross the viewport; clamp axes to `10px` |
| Enter motion | opacity `0→1`, `translateY(-4px) scale(.96)` → none, `160ms` |
| Value | `26px/200`, tabular; unit `12px #c4c4c4`; range `0.25–12`, step `0.25` |
| Slider | `2px #f1f1f1` track, `9px #111` thumb with `3px` white halo; `1px × 6px #efefef` ticks at whole hours |
| Steppers | `26 × 26px`, radius `7px`, `#f7f7f7` → `#111`; `−`/`+` move `0.25h`; disabled at bounds |
| `save` | ghost `10px #767676` → `#111`; visible because a slider has no Enter key on touch |
| Preview | dragging/stepping repaints cell levels and subline target live; metrics and sparkline update on save |
| Save | click `save` or `Enter`; `refreshMetrics()`; announce `Daily target set to 3.5 hours.` |
| Cancel | `Esc`, click-away, or clicking the target restores the previous target and cell levels; focus returns to the button |
| Keyboard | range focused on open; arrow keys adjust; `Enter` saves; `Esc` cancels |
| Interactions | logger and target editor close each other; skill switch, scroll, resize close it without saving |

Two controls, not a modal: one continuous scale, one stepper pair. No presets, no text field, no second save path.

### 6.8 Metric tiles (the triad)

Three tiles, one row, hairlines between, answering in order: **how much**, **how long**, **how fast**. Each: label row, hidden hover hint, hero value + unit, one evidence visual.

| Property | Spec |
| --- | --- |
| Container | `border-top:1px solid #f1f1f1`; no background, radius, or shadow |
| Tile | `padding:28px 30px 26px`; first tile `padding-left:0`; vertical hairline `#f1f1f1` between |
| Hover | `::before` rule `1px #111`, full width, `scaleX(0→1)` from left, `450ms`; no background change |
| Label row | `min-height:12px`, flex space-between, `margin-bottom:20px` |
| Label | `9px/400`, `0.13em`, uppercase, `#bdbdbd`; `11px` icon at `opacity:.75`, `6px` gap |
| Hint | `9.5px/300`, `#c9c9c9`, hidden (`opacity:0`, `translateY(-3px)`), revealed on tile hover/focus-within, `320ms`; no wrap |
| Value row | baseline flex, `gap:5px`, `margin-bottom:20px` |
| Hero number | `31px/200`, `-0.035em`, tabular |
| Date value | `22px/200`, `-0.02em`, nowrap |
| Unit | `11px/300`, `#c2c2c2` |

| Tile | Label icon | Value | Evidence visual | Hover hint |
| --- | --- | --- | --- | --- |
| Cumulative | clock | total hours, `0` decimals | 2px progress bar to 10,000 | `N sessions · since Mon YYYY` |
| ETA | calendar | `Mon YYYY` or `—` | 0–10-year ruler with accent dot | `next N h · N days` / `no pace yet` |
| Pace | pulse | h/day, `1` decimal | 14-day sparkline with dashed target line | `1.42× target · 3 h/day` |

A fourth metric goes below (§13.4) or replaces a tile — never a 2×2 grid. The triad is a composition, not a container.

### 6.9 Progress bar

Track `2px` tall, `#f1f1f1`, radius `2px`, full tile-content width; fill `hsl(var(--hue) 55% 52%)`, same height and radius, width `0 → pct`, `950ms var(--ease-out)`, after a double `requestAnimationFrame`. `pct = min(100, total / 100)` (1% per 100h). The bar is *distance*, not a gauge. No percentage label, ticks, or gradient.

### 6.10 ETA ruler

`height:16px`, full tile width, relative; ten `1px` ticks, `7px` tall, `#efefef`, `space-between`. Dot `8px`, radius `50%`, accent fill, `translateX(-50%)`, `box-shadow: 0 0 0 3px #fff`. Position `years = etaDays / 365.25`, `left = min(years, 10) / 10 × 100%`. `years > 10`: dot pins right in the "off" style — white fill, `1px #ddd` border, white halo. `left` transitions `900ms var(--ease-out)`; no labels.

### 6.11 Sparkline

`height:26px`, flex row, `gap:2.5px`, `align-items:flex-end`; 14 bars, one per day, `flex:1`, radius `1.5px`, fill `hsl(var(--hue) 45% 80%)`. Heights scale to `max(14-day max, target, 0.5)`, `min-height:2px` keeps empty days visible. Target line: dashed `1px #d8d8d8` at `target / max × 100%`, full width. Reveal `height 0 → h%`, `800ms var(--ease-out)`, `18ms` stagger per bar, left to right. No axis, labels, or values; the hover hint carries ratio and cadence.

### 6.12 Page enter

On skill or route change, the new view enters with `viewIn`:

```css
@keyframes viewIn{
  from{opacity:0; transform:translateY(8px)}
  to  {opacity:1; transform:none}
}
.view{animation:viewIn .5s var(--ease-out)}
```

Only the canvas animates, never the rail (`railIn` owns the marker); no cross-fade — the old view is replaced, the new one rises into place.

### 6.13 Delete skill — gesture only

Deleting a skill adds no rail control: no menu dot, label, or button. The icon gains a second verb on the day cell's press grammar (§18.1).

| Action | Result |
| --- | --- |
| Hold a rail icon `550ms` (mouse or touch) | Open the confirm for that skill |
| Release before `550ms` | Ordinary click: switch skill |
| Move more than `8px` while holding | Cancel the hold, suppress the following click |
| Right-click a rail icon | Open the same confirm |
| `Delete` / `Backspace` on a focused rail icon | Open the same confirm |

Primary pointer only; the rail suppresses the context menu, selection, and iOS touch callout. The click from a successful hold is swallowed. The confirm is a modal per §13.5 with its own `#delBack` / `#delDialog`; never reuses or mutates create-skill state.

**Dialog.** Title `Delete Piano?`. Subline states real counts: `42 sessions · 531 h will be removed.`; sub-hour totals in minutes; empty skill `This page has no sessions yet.` Actions: ghost `cancel`, then `delete` as ghost text in `#c93a3a` — never a filled red button. Focus starts on `cancel`; `Tab` trapped; `Esc`, `cancel`, backdrop click cancel and return focus to the originating rail button; `Enter` on `delete` confirms. No extra checkbox, no type-the-name step.

**Rules.** At least one skill always remains — attempting the last announces `Keep at least one skill.` and opens no dialog. Delete removes the skill and its log, closing that page's logger and target editor. A live session of the deleted skill is discarded and its bar hidden; another skill's session keeps running. If the deleted skill was active, the nearest remaining skill takes over (same index clamped; the previous one if it was last), `render()` runs, focus moves to the new active rail button; otherwise the page stays and `state.hi` is adjusted. Announce `<name> deleted.` politely; nothing is persisted.
---

## 7. Motion catalogue

| Name | Trigger | Property | Duration | Easing | Notes |
| --- | --- | --- | --- | --- | --- |
| `viewIn` | skill/route change | opacity, `translateY(8→0)` | `500ms` | ease-out | canvas only |
| `railIn` | active skill change | height `0→14`, opacity | `380ms` | ease-out | marker only |
| cell hover | hover | `scale(1→1.4)`, ring | `180ms` | ease-out | precise pointers |
| cell pulse | log commit | `scale(1→1.75→1)` | `550ms` | ease-out | restart via reflow |
| cell fill | log commit | background-color | `400ms` | `ease` | colour is the data change |
| tile rule | tile hover | `scaleX(0→1)`, origin left | `450ms` | ease-out | `#111`, 1px |
| hint | tile hover | opacity, `translateY(-3→0)` | `320ms` | ease-out | no layout shift |
| bar fill | mount / log | width `0→pct` | `950ms` | ease-out | double rAF |
| spark grow | mount / log | height `0→h%` | `800ms` | ease-out | `18ms` stagger |
| ruler dot | mount / log | left | `900ms` | ease-out | "off" above 10y |
| count-up | mount / log | text | `850ms` | cubic ease-out | from previous value |
| logger in | open | opacity, `translateY(6px) scale(.96)` | `160ms` | ease-out | origin near anchor |
| logger out | close | reverse | `160ms` | ease-out | `hidden` after `180ms` |
| tooltip | cell hover | opacity, `translate(-50%,-140%) scale(.94)` | `140ms` | ease-out | above logger |
| arm bloom | hold `90ms` | `scale(1→1.55)`, ring, halo | `180ms` | ease-out | cancelled by release or `8px` |
| live fill | session tick | `--live` height `0→pct` | `900ms` | ease-out | bottom-up, radius-clipped |
| session bar in | start | opacity, `translateY(8→0) scale(.98→1)` | `160ms` | ease-out | `hidden=false` first |
| session bar out | log / discard | reverse | `160ms` | ease-out | `hidden` after `180ms` |
| session toast | after bar out | opacity, `translateY(6→0)` | `140ms` | ease-out | `190ms` delay, `2.4s` |
| press | `:active` | `scale(.93–.97)` | `120ms` | ease-out | rail `.93`, quick-add `.94` |

**Reduced motion:** `prefers-reduced-motion: reduce` sets all durations to `0.01ms`, disables cell and press scaling, renders numbers and bars at final value.

**Number count-up:** previous value per habit+metric; animate previous → next, never from zero on update (zero only on first mount). `toLocaleString('en-US')` for integers, `toFixed(1)` for pace.
---

## 8. Interaction specification

| Action | Result |
| --- | --- |
| Click/tap a cell | Open the logger at the cell, prefilled with the day's hours |
| Press and hold a cell (`380ms`) | Start the live session (§18) for that day; release does not stop it |
| Hold released before `380ms` | No session; the normal click opens the logger |
| Hold moves more than `8px` | Cancel the hold, suppress the click; the graph scrolls |
| Hover a cell | Tooltip with date and hours |
| Hover a metric tile | Black hairline sweeps in; hint appears |
| `←` / `→` | Previous/next skill (no input focused) |
| Rail click / `←` `→` | Close any open logger without committing, switch skill, re-render, animate marker |
| `+` in the rail | Close the logger, open the create-skill dialog (§13.8) |
| `create` in the dialog | Append an empty skill, switch with `viewIn`, focus its rail button |
| Hold a rail icon (`550ms`) | Open the delete confirm (§6.13) |
| Right-click a rail icon, or `Delete` / `Backspace` while focused | Open the same confirm |

**Logger (§6.7):** `Enter` commits the clamped value, pulses the cell, counts up, closes; `Esc` or click-away closes without committing; `+½ / +1 / +2` commit immediately; `clear` deletes the entry, pulses, closes; `timer` closes without committing and starts a session.

**Session bar (§18.4):** `log` adds the elapsed minutes, pulses the cell, closes; `discard` drops the time, closes; `delete` removes the skill and its log, switching only if it was active.

**Never** commit on blur, open a date picker (the graph *is* the date picker), or ask for a session note.

**Focus order** follows visual order: rail skills → cells (row-major within each week column) → tiles; within the logger input → quick adds → clear. Trap focus only while the logger is open on touch; on desktop click-away suffices.
---

## 9. Data semantics

These rules define the numbers. Any new surface uses the same functions, not approximations.

### 9.1 Model

```ts
type Habit = {
  id: string;
  name: string;          // "Piano"
  hue: number;           // 268
  target: number;        // hours/day, e.g. 3
  icon: IconName;
  goal: number;          // 10000 default, 1000 for a microskill (§23)
  micro: boolean;        // true only when the goal is the 1,000-hour horizon
  createdAt: string;     // ISO date, local
  log: Record<string, number>; // "YYYY-MM-DD" -> hours, local calendar day
};
```

`goal` is data, never inferred from `name` or `target`; `goalOf(h) = h.goal || 10000` is the single read path. A payload missing `goal` migrates to `10000`; `micro: true` without a goal migrates to `1000`.

- Day keys: **local** calendar days, zero-padded `YYYY-MM-DD`; never UTC — 11pm belongs to that evening. A day is absent or `> 0`; clearing deletes the key, never stores `0`.
- Hours at **minute precision**, rounded to `1/60`, clamped `0–24`. Manual entry offers quarter-hour steps (`+½`, `+1`, `+2`) but normalises to minutes on commit; a live session (§18) rounds elapsed to the nearest minute, minimum one.
- Graph window per §6.4.

### 9.2 Derived values

| Value | Definition |
| --- | --- |
| `total` | Σ hours across all days ≤ today |
| `sessions` | count of days with `hours > 0` |
| `first` | earliest day with `hours > 0` |
| `pace` | mean hours/day over the trailing **28 calendar days**, including zero days |
| `skillGoal` | `goalOf(h)` — `10000` by default, `1000` for a microskill |
| `remaining` | `max(0, skillGoal − total)` |
| `nextMs` | lowest threshold **inside this skill's horizon** not yet reached; `null` at the horizon |
| `goal` (`stats.goal`) | `nextMs ?? skillGoal` — the ETA target, never a second stored number |
| `toGoal` | `max(0, goal − total)` |
| `etaDays` | `toGoal / pace` while `nextMs` exists; `∞` if `pace = 0` or the horizon is complete |
| `eta` | `today + round(etaDays)`; `null` if no pace or the horizon is complete |
| `complete` | `total ≥ skillGoal` |
| `ratio` | `pace / target` |
| `streak` | consecutive logged days ending today; an empty today does not break it |

Zero days count in the pace window.

### 9.3 Level

```
r = hours / target
0 → 0 ; r<0.4 → 1 ; r<0.8 → 2 ; r<1.15 → 3 ; else → 4
```

### 9.4 Display formats

| Value | Format | Example |
| --- | --- | --- |
| Total hours | integer, thousands separator | `1,284` |
| Pace | 1 decimal | `1.4` |
| Ratio | 2 decimals + `×` | `1.42×` |
| ETA | `Mon YYYY` | `Mar 2028` |
| Day key / tooltip | `Mon D` | `Oct 21` |
| Day duration (tooltip, toast) | minutes under 1h; `h min` above | `25 min`, `2 h`, `2 h 25 min` |
| Live clock | `mm:ss`; `h:mm:ss` at ≥ 1h | `04:12`, `1:04:12` |
| Logger date | `Www, Mon D` uppercase | `TUE, OCT 21` |
| Days remaining | integer, thousands separator | `1,206` |
| Missing | em dash `—` | never `0`, never `N/A` |

### 9.5 Empty and edge states

**No sessions:** ETA `—`, pace `0.0`, bar at `0`, sparkline baseline only, subline `No sessions logged yet`; the graph remains. **No pace** (all-time zero in 28 days): ETA `—`, ruler ticks, no dot, hint `no pace yet`. **ETA horizon:** the date is the projected arrival at the *next* unachieved milestone (§21) **inside the skill's own horizon**, not at 10,000 h; a microskill therefore projects to its next threshold up to `1,000`. The ruler measures years to that threshold. **> 10-year ETA:** dot pins right in the "off" style, hint reports exact days. **Completed horizon:** bar `100%`, ETA reads `—` with hint `1,000 h reached` or `10,000 h reached`, one quiet state change (§13.7). **Future days:** not rendered; do not grey them in.
---

## 10. Copy

The interface speaks in labels, not sentences. Lowercase in controls, title case in names.

- Tiles `Cumulative` · `ETA` · `Pace`; units `h` · `h/day` · `×`; legend `less` … `more`; progress `of 10,000 h`.
- Hold hint `hold a day to time it · drag to set hours`; logger footer `clear` · `timer` · `↵ log · esc`; quick adds `+½` · `+1` · `+2`.
- Session bar `Piano · Oct 21` · `log` · `discard`; toast `1 min logged · Piano, Oct 21`; announcement `Stopwatch started for Piano, October 21.`
- Delete `Delete Piano?` · `42 sessions · 531 h will be removed.` · `cancel` · `delete`; guard `Keep at least one skill.`
- Subline `Tracking since Jan 2025 · target 3 h/day`; empty `No sessions logged yet` · `no pace yet`; tooltip empty `Oct 21 · —`.
- Separators `·`, single spaces; ellipses `…`; dashes `—`, never `--`; no exclamation marks, motivational copy, or emoji; the unit always separate, never part of the value; errors specific: `Enter between 0 and 24 hours.`
---

## 11. Accessibility

The prototype is intentionally low-contrast; production keeps the calm and meets these floors.

1. **Contrast.** Primary values `#101010` (17.4:1). Body and any text carrying required meaning `#6b6b6b` or darker (≥ 4.5:1). Decorative micro labels may stay `#bdbdbd`/`#c6c6c6` only where the fact repeats. Hover hints carrying unique information rise to `#767676`.
2. **Cells.** Every cell is a focusable `<button>` with an `aria-label` (`October 21, 2.5 hours`; empty `October 21, no hours logged`). Never colour alone. The graph exposes `role="grid"` with row/column semantics when refactored; month labels `aria-hidden`.
3. **Focus.** `outline:2px solid #111; outline-offset:1px` on every interactive element; never `outline:none` without a replacement. Production adds a `1px #111` underline on the logger input's `:focus-visible`.
4. **Keyboard.** All logging works without a pointer: tab to a cell, `Enter`/`Space` opens, type, `Enter` commits, `Esc` closes.
5. **Motion.** Honour `prefers-reduced-motion`; animation is never the only feedback.
6. **Touch.** Cells are visually `12px` but need a `24 × 24px` hit area via padding or pseudo-element at coarse pointers; rail buttons `40px`, logger quick-adds `26px` tall.
7. **Screen readers.** Announce commits politely: `2.5 hours logged for October 21.` Tooltips `aria-hidden`; the dialog is `role="dialog"` with `aria-label="Log hours for October 21"`.
8. **Live session.** §18.6.
---

## 12. Responsive behaviour

At `≤ 860px`:

- Rail → bottom nav bar: fixed, `height:56px` + safe-area inset, full width, white, `border-top:1px solid #f1f1f1`, buttons `44 × 44`, `gap:8px`. Active marker `3 × 14px` **above** the icon (or `2px` top border), not the left edge.
- Canvas `padding:48px 26px calc(130px + env(safe-area-inset-bottom))`. Tiles: one column, `1px #f1f1f1` bottom rule each, `padding:24px 0`; the first keeps the group's single `border-top`.
- `h1` `28px`. At `≤520px` the header stacks left: title, subline, legend, hold hint. Hide the legend before the subline wraps to three lines.
- Graph keeps 53 columns and scrolls — never 26 weeks; a scrolled graph opens at the current week (right edge), today's cell and any running session visible.
- Session bar and logger follow §18.7; the logger stays `198px`, clamped to the viewport, and flips below the cell when needed.
---

## 13. Extending the system
New surfaces must look like they were always there; use these patterns, do not invent.

### 13.1 Secondary pages (settings, about, all-skills)

Same shell and rail; `1020px` canvas, `74px 56px 140px` padding. Page title `34px/200`; one `11.5px` subline; sections separated by `1px #f1f1f1` rules, `42px` above, `0` below. No cards: rows are hairlines, controls right-aligned. Row `padding:24px 0`: label left (`12.5px/300 #101010` + `9px` uppercase `#bdbdbd` caption), control right; hover adds a `9.5px` explanation under the label (`320ms` max-height). All-skills index: the archived Ledger sidebar and rows (§17.3) ; hairline list with mini progress.

### 13.2 Forms and inputs

Field `height:32px`, transparent or white, `1px #ececec`, radius `8px`, `padding:0 10px`, `12.5px/300`; focus border `#111`, no glow. Numeric fields stay large, light, tabular, borderless until focus. Labels above: `9px/400`, `0.13em`, uppercase, `#bdbdbd`, `8px` gap — placeholders are not labels. Validation `10.5px #c93a3a` below the field, never a toast.

### 13.3 Buttons

| Variant | Spec |
| --- | --- |
| Primary | `height:34px`, `padding:0 16px`, radius `8px`, `#111` bg, `#fff` `12px/300`, hover `#000`, press `scale(.97)` |
| Secondary | transparent, `1px #ececec`, `#7a7a7a` text, hover `#fafafa` + `#111` text |
| Ghost | no border, `#7a7a7a`, hover `#111`; used for `clear`, `cancel` |
| Destructive | ghost in `#c93a3a`, no filled red buttons |
| Icon | `36 × 36px`, radius `10px`, `#cbcbcb` → `#111` on hover |

No button gets a shadow or the skill hue.

### 13.4 Adding a fourth metric or a comparison

Do not expand the triad. Add a **band** below: full-width, `1px #f1f1f1` top rule, `28px 0` padding, one `9px` uppercase label and one visual (small multiple, distribution, weekday average). One idea per band. Multi-skill comparison: the archived Ledger row (§17.3), one row per skill on a shared scale.

### 13.5 Modal / dialog

Backdrop `rgba(255,255,255,.72)` + `backdrop-filter: blur(8px)` — a white-out. Panel white, radius `18px`, `1px #ececec`, `--shadow-modal`, `padding:28px`, width `min(420px, calc(100vw - 32px))`. Title `22px/200`, optional `11.5px` subline, actions right-aligned at the bottom, `12px` gap. Enter opacity + `translateY(6px) scale(.98)` → none, `180ms`; exit reverse, `140ms`. Used for create skill and confirm delete; not for logging (popover) or retargeting (anchored slider, §6.7).

### 13.6 Toasts

Bottom center (above mobile nav), `#111` surface, white `11px/300`, radius `999px`, `padding:9px 16px`, no icon, one line, auto-dismiss `2.4s`, enter `140ms` translateY(6px) → 0. Never more than one; never for validation.

### 13.7 Completion and milestones

At the skill's horizon — 10,000 hours normally, 1,000 for a microskill — the page may shift once: subline `1,000 h reached`, bar `100%`, ETA reading `—` (§9.5). No confetti, modal, or sound. An acknowledged milestone gets one `550ms` cell-style pulse on the cumulative value and a one-line toast.

### 13.8 Create-skill flow (concrete)

The rail's add affordance (§6.1) is the only discovery point for a new skill; no second button in the header or canvas. It has two modes: a plain click creates a 10,000-hour skill, and a modifier click creates a 1,000-hour microskill (§23). The palette action and `⌘⇧N` reach the same micro mode for keyboard users.

1. Modal per §13.5: title `New skill`, subline `A page, a graph, a target.` Micro mode changes the title to `New microskill` and the subline to `A page, a graph, a thousand hours.`
2. Name field: borderless `26px/200`, `9px` uppercase label above, `1px #eee` underline → `#111` on focus; focused and selected on open; `Enter` creates. Required; errors `10.5px #c93a3a` below (`Enter a name.`, `That name is already in use.`), never a toast.
3. Icon picker: 42 `40px` buttons (§6.2) in `repeat(auto-fill, 40px)`, `8px` gaps (`6px` at `≤520px`), `#cbcbcb` rest, `#111` selected with a `1.5px #111` ring, `12px` radius. `book` first and default; six and five columns on narrow screens, the dialog scrolls rather than clips. Typing pre-selects the best match and names it quietly below the field (§13.11).
4. Hue picker: one `18px` circle per documented hue (§4.2) — four reserved first, then the five in use — in `28px` targets. Selected: `1.5px #111` outer ring, `2px` white gap. Default `45` (ochre).
5. Target stepper: `− 3 h/day +`, `0.25` steps, `0.25–12`, tabular, disabled at bounds; default `3`.
6. Footer: ghost `cancel`, primary `create`, `12px` apart. `Esc`, `cancel`, backdrop click close without creating; focus starts in the name, trapped in the panel.
7. On create: append a skill with `goal: 10000 | 1000`, `micro` matching the mode, an empty log, and `createdAt` today (no seeded hours), switch with `viewIn`, focus its rail button, announce `<name> added.` politely. Subline `No sessions logged yet · target 3 h/day` plus `· 1,000 h` in micro mode.

### 13.9 Empty states

No illustrations, no mascots; the graph is the empty state. At most one `11.5px` subline and, if actionable, a ghost button (`log your first session`). Keep normal geometry.

### 13.10 Loading

Skeleton cells `#f6f6f6` with a `1.6s` opacity pulse (`1 → .55 → 1`), same grid geometry. Text skeletons: `6px` tall bars, radius `3px`, `#f4f4f4`. Never spinners. Numbers render `—` until known, then count up once.

### 13.11 Create dialog — the name matches the icon

Typing picks the icon. Each of the 42 glyphs carries a lowercase vocabulary (`ICON_KEYWORDS` in `index.html`); the normalised name is scored against every vocabulary and the grid scrolls the match into view (`scrollIntoView`, `block/inline:'nearest'`), and a quiet line names it: `icon · guitar`, `10px/300`, `0.04em`, `#bdbdbd`, in the existing `24px` gap below the field. Empty and hidden when nothing matches.

- **Normalise:** lowercase, strip diacritics, drop a trailing possessive, collapse non-letter/digit runs to single spaces.
- **Scoring, strongest first:** exact keyword › keyword starts with a name token › name token starts with the keyword › multi-word phrase (`public speaking`, `art history`) in the name › substring › fuzzy subsequence (both sides ≥ 4 letters, ≥ 70% coverage). Earlier tokens weigh more (`1 / (1 + 0.45·i)`); a `15%` bonus rewards a second matching token; connective/learner words (`learn`, `practice`, `beginner`, `my`, …) de-weight `×0.25`, so `learn spanish` is **globe**, not **book**. Ties keep `ICON_CHOICES` order; below the fuzzy floor, default `book`, no line.
- **Own id and picker label:** each glyph also answers to its id and label (`ICON_KWS` folds both in), so `flask`, `stethoscope`, `scales`, `globe`, `mic`, `dumbbell`, `writing` resolve to the glyph that carries them.
- **A manual pick always wins.** Clicking `.icon-opt` pins that icon for the dialog session; typing never overrides it, and the line names the chosen icon (`icon · drums`). Clearing the field re-arms auto-match and returns to `book`.
- **Announce, don't toast.** The line is its own `role="status" aria-live="polite"` region; `aria-pressed` carries selection. Repaint only when the chosen icon changes; never move focus.
- Untouched: `Enter` creates, `Esc` closes, hue picker, target stepper, validation, focus trap, `40`-character limit. Offline and dependency-free.
---

## 14. Do / Don't

**Do.** White space separates; the value is the largest thing in any block; one accent per page, on data ink only; secondary facts hidden until hover/focus, one gesture away; animate values, not containers; align the first tile's value with the page title; hairlines at `1px`, always; one material exception — the milestone cards (§21) — confined to that row.

**Don't.** No cards, shadows, gradients, glass, or rounded containers around sections (the milestone row excepted; its gold never leaks); no skill hue on buttons, links, headings, borders; no legend of words where a visual communicates; one idea per metric tile; no scroll animation, no ambient loops; no bold weights for numbers or labels; no percentage next to the progress bar; no fourth tile in the metric row.
---

## 15. Implementation notes

### 15.1 Files

| File | Role |
| --- | --- |
| `index.html` | Self-contained prototype: tokens, components, demo data, interactions |
| `share-card.css` | Hold affordance on the page title (§22) |
| `share-card.js` | 1080 × 1920 poster composer, download, keyboard fallback (§22) |
| `store.js` | Local-first persistence: `tenk.v1` envelope, validation, migration, corrupt fallback (§23.6) |
| `store.test.js` | Node tests for the store contract (`node store.test.js`) |
| `microskill.css` | Microskill create-dialog mode and plus hint |
| `gallery.html` | Standalone image-led index of hobbies; supported tiles deep-link into the console (§24) |
| `theme.css` | Theme tokens, dark overrides, control, transition, gallery paper mode (§25) |
| `theme.js` | Theme engine: preference, shortcut, controls, circular reveal (§25) |
| `design.md` | This document — canonical visual and behavioural spec |
| `README.md` | Product premise, philosophy, status, roadmap |
| `.nojekyll` | Tells GitHub Pages to serve the files verbatim (no Jekyll pass) |

### 15.2 Structure inside `index.html`

- Base reset, cell/legend styles; floating surfaces outside the view mount: `.tip`, `.logger`, `.runner`, `.toast`, `.backdrop` / `.dialog`.
- Theme boot script in `<head>` (resolves `auto | light | dark` before the first paint), then `theme.css`; `theme.js` at the end of `<body>` owns the control, shortcut, live system changes, and the transition. No view or component code is theme-aware.
- `.v1` console styles only; Variant 2/3 styles removed (§17).
- `ICONS`, starter habits (`seedHabits`), `goalOf`/`milestonesFor`, `stats`, formatters; `graphHTML`, `metricsHTML1`, `view1`, `animateNumbers`, `revealBars`, `render`, `refreshMetrics`. `BOOT` hydrates from `TenkStore` before the first render; `saveState` is the single write path.
- Surfaces and machines: `openLogger`/`commit`/`closeLogger`, `openDialog`/`createSkill`/`closeDialog`, `openDeleteConfirm`/`deleteSkill`/`closeDeleteConfirm`, `startSession`/`tickSession`/`finishSession`/`discardSession`/`paintSessionCell` (pointer hold: `press`, `cancelArm`), `openPalette`/`paletteResults`/`fuzzyScore`/`runPaletteItem`/`closePalette`, `openKeys`, `ICON_KEYWORDS`/`normName`/`matchIconFor`/`applyIconMatch` and the `icon · …` line, `MILESTONES`/`milestonesHTML`/`refreshMilestones`; one delegated `keydown` map and the polite live region.

### 15.3 Porting to a component app

- Move §4 tokens into `:root`; no literal hex values in components.
- Variants 2 and 3 are gone; to revive an archived pattern, import the component only — never the retired shell (§17.4).
- Starter habits begin fresh with empty logs on first run; persisted habits use the same derived functions and `goalOf`. Never let a second store own a habit field.
- Promote the logger to an accessible dialog with a touch focus trap and `aria-label`s.
- Add hit-area padding at coarse pointers, and a `:focus-visible` underline in the input.
- Keep count-up semantics: previous → next per habit and metric, `850ms`, cubic ease-out.
- Preserve `prefers-reduced-motion` in the animation helpers, not per component.
- Live clock stays wall-clock (`Date.now()`), not an interval count. If persisted, store `{skill, dayKey, startedAt}` and resume against the same day key; never move a running session across midnight.
- Normalise every written value to minutes in one place (`toMinute`) so no two surfaces can disagree.
- Never adopt a component library's default shadows, radii, or font sizes; map them to §4.

### 15.4 Performance

371 cells per page is trivial; never re-render the whole graph on commit — update the single cell's `data-l`/`data-v` and replace only the metrics block. Batch reads: all stats once per habit change, once per commit. Delegate cell events at document or graph level, never `371` listeners. Animate only `transform`, `opacity`, `width/height` on small elements, and `left` on one dot.
---

## 16. Decisions log

| Decision | Rationale |
| --- | --- |
| Variant 1 (Console) is canonical | rail + graph + triad = "one skill, three answers"; scales without redesign |
| Variants 2 (Orbit) and 3 (Ledger) removed | Orbit over-centers one figure; Ledger duplicates the rail as text and adds chrome; parts in §17 |
| Archived components kept | ring, pill nav, centered cards, sidebar list, mini bars, hover rows stay useful; pages gone |
| Hue per skill, not per level | levels are intensity of one hue, so the graph reads as one material |
| Pace uses 28 calendar days including zeros | honest ETA; binges cannot flatter the projection |
| Logger is a popover, not a modal | graph stays in view while typing; filling a square preserved |
| No labels on the ETA ruler | the date is the answer; the ruler is orientation |
| Hover reveals hints, not click | the resting page stays quiet; revealed facts are secondary |
| White-out modal backdrop | stays inside the light, paper-like system |
| 10,000h bar maps 100h → 1% | a 0–100% bar over 10,000h never moves; it shows felt distance |
| Hold-to-time adds a mode without chrome | tap stays the logger; the gesture is the second verb |
| The clock starts at the 380ms threshold | arming is gesture, not practice; counting it would flatter the record |
| One clock at a time | a second hold logs the first; two clocks make the day ambiguous |
| Live sessions store minutes, not quarters | a 20-minute session rounded to `0` or `0.25` is a lie |
| The session bar is unconfirmed on discard | `discard` is labelled and the bar temporary; a modal would be louder |
| Deletion is a hold, not a menu | one icon per skill; the second verb shares the timing grammar |
| The last skill is undeletable | an empty console has no page to stand on; guard announced, never disabled |
---

## 17. Archive — components from the retired variants

Variants 2 ("Orbit") and 3 ("Ledger") are gone from the interface and `index.html`; their **component styles remain part of this system** — approved patterns for future surfaces.

**The rule:** reuse a component, never a page. The Console shell is final; an archived component serves that structure or a clearly secondary surface, never Orbit's centered column or Ledger's second sidebar.

### 17.1 Reuse matrix

| Archived component | Origin | Approved reuse | Not for |
| --- | --- | --- | --- |
| Cumulative ring | Orbit | Milestone view for one skill; 10,000h recap | Replacing the metric triad |
| Pill topbar | Orbit | Segmented control inside a page | Primary navigation (rail owns it) |
| Centered metric cards | Orbit | Mobile summary, recap, modal review | Desktop console metrics |
| Skill sidebar list | Ledger | All-skills index without the rail | A second column beside the rail |
| Mini progress bar | Ledger | Per-skill progress in lists and pickers | The hero cumulative bar |
| Ledger row | Ledger | Comparisons, settings, data tables | The three core metrics |
| Hover-reveal row hint | Ledger | Dense lists with hidden secondary detail | Information required to act |
| Detail band | Ledger | Extra chart sections below the triad | Replacing the contribution graph |

Originals preserved; restated against §4 tokens; map remaining literals when porting, add none.

### 17.2 Orbit components

#### Pill topbar

Floating segmented control; switched skills above the ring in Orbit.

| Property | Spec |
| --- | --- |
| Container | inline-flex, `gap:2px`, `padding:5px`, white, `1px solid #f2f2f2`, radius `999px` |
| Placement | centered; `60px` below-margin originally; `z-index:400` when floating |
| Enter | `viewIn`, `500ms` |
| Button | `42 × 42px`, radius `50%`, grid center, icon `19px`, stroke `1.2` |
| Rest | `#cccccc` |
| Hover | `#8a8a8a`, background `#fafafa`, `280ms` |
| Press | `scale(.92)`, `120ms` |
| Active | skill hue at `52% 50%`, icon white |

**Adaptation:** inside the Console, active fill `#111` with a white icon — hue never becomes chrome. Hue-filled pills only on a standalone, single-skill surface where the pill is the identity. Text variant: `12px/300`, `padding:0 14px`, height `34px`; keep `999px` radius and `5px` inner padding.

#### Cumulative ring

Single-value radial gauge; the only sanctioned full circle.

| Property | Spec |
| --- | --- |
| Wrapper | `262 × 262px`, grid center, relative |
| SVG | `viewBox="0 0 260 260"`, `260 × 260`, `transform: rotate(-90deg)`, absolutely inset |
| Radius | `120` |
| Track | `fill:none`, stroke `#f3f3f3`, `stroke-width:1.5` |
| Progress | stroke `hsl(var(--hue) 52% 50%)`, `1.5px`, `stroke-linecap:round` |
| Geometry | circumference `2π × 120 = 753.98`; `dasharray = 753.98`; `dashoffset = C × (1 − pct)` |
| Fill | `pct = min(1, total / 10000)` |
| Motion | `stroke-dashoffset` `1400ms var(--ease-out)`; update starts from the previous offset, not full |
| Centre value | `47px/200`, `-0.045em`, tabular, `#101010`; count-up `850ms` |
| Centre label | `of 10,000 h`, `9px/400`, `0.16em`, uppercase, `#c8c8c8`, `11px` below the value |

`stroke-dasharray`/`stroke-dashoffset` come from that geometry, never a CSS keyframe — always previous → new offset. The ring replaces the bar only when completion *is* the page; the triad stays the default. No tick marks, gradients, or second arc.

#### Centered metric cards

Two or three equal centered columns inside a bordered strip; for surfaces with no left-aligned title.

| Property | Spec |
| --- | --- |
| Container | flex, `width:min(600px,100%)`, top and bottom `1px #f3f3f3`, `48px` above |
| Card | `flex:1`, `padding:26px 22px 24px`, centered, right hairline, last card none |
| Hover | background `#fcfcfc`, `350ms`; no rule sweep |
| Label | centered, `16px` below |
| Value | centered, `16px` below |
| Evidence | under the value (ruler or sparkline) |
| Hint | `9.5px #c9c9c9`, centered, `12px` above, opacity `0 → 1` on hover, `320ms` |

Not for the console triad: centered rhythm fights the left-aligned graph.

#### Orbit strip

Graph as a centered band: `max-width:900px`, `54px` above, `overflow-x:auto`, `padding-bottom:4px`.

### 17.3 Ledger components

#### Skill sidebar list

Text-forward index with inline progress; best for an all-skills page.

| Property | Spec |
| --- | --- |
| Column | `264px`, sticky, `100vh`, `padding:46px 18px`, right `1px #f3f3f3`, scrolls internally |
| Heading | `9px/400`, `0.15em`, uppercase, `#c8c8c8`, margin `0 12px 20px` |
| Item | flex, `gap:11px`, full width, `padding:11px 12px`, radius `11px`, left-aligned |
| Hover | `#fafafa`, `250ms` |
| Press | `scale(.985)`, `250ms` |
| Active | background `#f7f7f7` |
| Icon | `17px`, stroke `1.25`, `#c8c8c8`; active becomes the skill hue (`52% 50%`) |
| Name | `12.5px/300`, `#8a8a8a`, ellipsis; active `#111` |
| Mini bar | `36 × 2px`, radius `2px`, track `#efefef`, fill `hsl(h 52% 55%)` |
| Mini fill | width `min(100, total/100)%`, transition `800ms var(--ease-out)` |

The active icon's hue is the one archived exception to "no hue in chrome": the icon *is* the identity; otherwise icons stay neutral.

#### Detail header and band

Header title `36px/200`, `-0.04em`, `14px` below; subline `11.5px/300 #bdbdbd`, `46px` below. Band: graph or chart region, `52px` below, horizontal scroll, `2px` bottom padding. Canvas `padding:70px 64px 150px`, `max-width:880px` — text-heavy secondary pages only; the Console stays `1020px`.

#### Ledger row

Dense comparison row; for "all skills", settings groups, anything scanned vertically.

```
◷   CUMULATIVE                    1,284 h        ▬▬▬▬▬░░░░░░
    sessions · since Jan 2025 · 12.8% of 10,000        ← hover only
```

| Property | Spec |
| --- | --- |
| List | `border-top:1px solid #f2f2f2` |
| Row | grid `22px 1fr 172px`, align center, `gap:22px`, `padding:27px 0`, bottom `1px #f2f2f2` |
| Icon | `16px`, stroke `1.3`, `#d2d2d2`; hover → `hsl(h 52% 50%)`, `350ms` |
| Middle | flex, baseline space-between, `gap:20px`, `min-width:0` |
| Label | `9px/400`, `0.13em`, uppercase, `#c2c2c2`, nowrap |
| Value | `27px/200`, `-0.035em`, tabular; unit `10.5px #c8c8c8`, `5px` gap |
| Visual | fixed `172px` column; opacity `.75`, hover `1`, `350ms` |
| Hint | grid-column `2 / 4`; `9.5px/300 #cfcfcf`; `max-height:0`, opacity `0`; hover `max-height:20px`, opacity `1`, `margin-top:8px`; `350ms` |

`max-height` lets the hint appear without reserving space; keep the `20px` cap, longer copy clamps or moves to a tooltip. Hover-only is acceptable only for redundant detail; unique information also reveals on `focus-within`, text `#767676`.

#### Responsive behaviour (archived)

`≤860px`: the sidebar becomes a horizontal strip — static, full width, bottom hairline, `padding:18px`, horizontal scroll, heading hidden, items `flex:0 0 auto`, mini bars hidden. The detail canvas becomes `44px 26px 130px`; rows `20px 1fr`, `14px` gap; the visual moves to the second column, full width. Reuse this collapse for any future index; the Console keeps its bottom rail.

### 17.4 Porting an archived component

Copy **structure and measurements**, not old selector names or page wrappers. Replace literal colours and easings with §4 tokens; preserve the accent rule. Keep the intrinsic size (ring `262px`, sidebar `264px`, row visual `172px`) unless the destination forces a change. If it would replace or expand the triad, stop — use a band. Verify focus, keyboard, reduced motion, and contrast to §11; document any adaptation here.

### 17.5 What not to resurrect

- Orbit's centered page column, full-page symmetry, or skill topbar as primary navigation.
- Ledger's second sidebar beside the icon rail, or its narrow `880px` canvas for the main console.
- A hue-filled control in ordinary UI chrome; rows as a replacement for the metric triad.
- The old `.v2` / `.v3` class names and hardcoded literals; the code is gone.
- Any layout justified only by exploration taste.
---

## 18. Live session — press and hold to time

A second verb on a day cell: the stopwatch. Nothing appears until `90ms` into a press, so a tap never flashes; nothing is added to header, tiles, or rail. The bar exists only while a session runs.

### 18.1 Gesture

```
pointerdown ──90ms──▶ arm bloom ──380ms──▶ clock starts ──release──▶ clock keeps running
      │                   │
      └──── release ──────┴──▶ ordinary click: logger opens
```

| Constant | Value | Meaning |
| --- | --- | --- |
| `HOLD_MS` | `380ms` | Press before the clock starts |
| `ARM_DELAY` | `90ms` | Quiet period before the arm bloom |
| `MOVE_CANCEL` | `8px` | Travel that cancels the press |
| Click suppression | `1500ms` after fire | Swallows the click from a long press |
| Move suppression | `600ms` after cancel | Swallows the click from a drag |

Clock starts at the threshold, never at `pointerdown`. Release after the threshold does **not** stop the clock; stopping is explicit `log` or `discard`. Release before the threshold leaves the browser's click intact, so the logger opens as usual. Travel beyond `8px` cancels and suppresses the next click. Primary pointer only; secondary buttons ignored; cells suppress the context menu, native selection, and the iOS touch callout. A cell already the live session's day ignores a new press — one clock per day.

### 18.2 Cell states

Five states; one cell live at a time.

| State | Appearance | Duration |
| --- | --- | --- |
| Rest | the day's level; empty day `#f4f4f4` | — |
| Hover | `scale(1.4)`, `rgba(0,0,0,.5)` ring; precise pointers only | `180ms` |
| Arming | `scale(1.55)`, `#111` ring, `5px` halo `rgba(0,0,0,.07)`, `z-index:6` | `180ms`, after `90ms` |
| Live | `#111` ring, `z-index:4`, bottom-up accent fill | fill `900ms` |
| Logged | `cellPulse` `1→1.75→1`, then the new level | `550ms` |

**Arm bloom.** Close to hover (`1.4 → 1.55`); halo `7%` black. Reduced motion: no scale, ring instant.

**Live fill.** `::after` at the cell bottom, `min(100, elapsedHours / target × 100)%` of the cell height, `hsl(h 55% 52%)`, clipped by the `2.5px` radius. Additive: the base colour stays the day's total, the fill reports this session. `250ms` tick, `900ms` transition, never ahead of the clock.

**Transitions out.** `log` removes the live ring, clears `--live`, writes `data-v`/`data-l`, pulses; `discard` removes ring and fill, nothing else. No live state survives a render.

### 18.3 Session bar

Floating row at the bottom centre: the day, the clock, progress toward target, two ways to end it.

| Property | Spec |
| --- | --- |
| Placement | `position:fixed`, `left:50%`, `bottom:24px`, `translateX(-50%)`, `z-index:240` |
| Width | `352px`; `max-width:calc(100vw - 24px)` |
| Surface | `#fff`, `1px solid #ececec`, radius `18px`, `--shadow-pop` |
| Layout | flex, `gap:16px`, `padding:11px 12px 12px 18px` |
| Meta | `10px/300`, `#b0b0b0`, one line, ellipsis; `Piano · Oct 21` |
| Clock | `23px/200`, `-0.03em`, tabular; `mm:ss`, `h:mm:ss` at ≥ 1h |
| Progress | `2px` track `#f1f1f1`, fill `hsl(h 55% 52%)`, width `(base + elapsed) / target`, capped `100%` |
| Separator | `1 × 30px`, `#f3f3f3` |
| `log` | `30px` tall, `999px`, `#111` on `#fff`, `11.5px/400`, `padding:0 13px` |
| `discard` | `30px` tall, text-only, `10px/300`, `#767676`; hover `#c93a3a` |
| Enter | opacity, `translateY(8px) scale(.98)` → none, `160ms` |
| Exit | reverse `160ms`; `hidden` after `180ms` |

Bar = whole day, cell = session: bar fill `(existing + elapsed) / target`, cell fill only the new time. Hue fixed at start to the session's skill; a skill switch does not recolour a running clock. Clock is the largest type in the bar, below the metric values (`31px/200`). `discard` is a labelled text button, the only destructive action, with no confirmation. Hidden and absent from layout with no session. After `log` the bar exits and a toast appears `190ms` later — `1 min logged · Piano, Oct 21` — for `2.4s`; automatic commits skip the toast.

### 18.4 Behaviour

| Event | Result |
| --- | --- |
| Hold a day past `380ms` | Start a session; cell live; bar enters |
| `timer` in the logger | Close without committing, start the same session, focus `log` |
| Release after start | Clock keeps running |
| Hold another day while running | Commit the running session at the nearest minute (min `1`), then start the new one; no toast |
| Click another day while running | Open that day's logger; clock keeps running |
| Edit the same day while running | The committed total becomes the session's new `base`; clock keeps running |
| Switch skill while running | Clock and bar continue; bar keeps the session hue; the new graph has no live cell |
| `log` | Add elapsed minutes to the day, pulse the cell, count up metrics, close the bar, focus the cell |
| `discard` | Drop the elapsed time, close the bar, focus the cell; no data change, no toast |
| Reload or close | A running session is lost; only committed day totals are kept (no storage in the prototype) |
| `Esc` while the bar is focused | No effect on the clock; ending needs `log` or `discard` |

Clock is wall-clock (`Date.now()`), not a tick count, so a throttled or backgrounded tab catches up. No idle detection, no auto-stop.

**One clock at a time.** A second hold commits the first session — the only implicit commit.

**Focus.** A hold leaves focus where it was, normally the cell. `timer` moves focus to `log`; logging or discarding returns it to the day's cell (or the active rail button if that day unmounted).

### 18.5 Data semantics

```ts
type Session = {
  hi: number;        // skill index, fixed for the life of the session
  k: string;         // local day key "YYYY-MM-DD", fixed at start
  startedAt: number; // Date.now() at the 380ms threshold
  base: number;      // that day's total when the session began
};
```

- `elapsed = max(0, now − startedAt) / 1000`; displayed `mm:ss` or `h:mm:ss`.
- Commit: `mins = max(1, round(elapsed / 60))`, then `v = clamp(toMinute(base + mins / 60), 0, 24)`; a session always records ≥ one minute.
- Day key never recomputed: a session crossing midnight belongs to the day it started on.
- `base` re-read only from an explicit edit of the same day (§18.4); otherwise existing total + elapsed is the truth.
- No session record, notes, or start/end history; day totals only (§9.1).

### 18.6 Accessibility

The hold is never the only path: the logger's `timer` starts the same session. The bar is `role="group"` with a changing label (`Session in progress, Piano, October 21`); buttons carry their text, `discard` is not an unlabelled glyph. The ticking clock is **not** a live region — announce only `Stopwatch started for Piano, October 21.`, `1 minute logged for October 21.`, `Session discarded.` Focus moves to `log` when starting from `timer`, back to the cell after `log` or `discard` (§18.4). Clock and both actions carry ≥ 4.5:1 (clock `#101010`, `discard` `#767676`, `log` white on `#111`); the meta line may stay `#b0b0b0`, and `discard` turns red only on hover. Coarse pointers: `log` and `discard` extend the hit area to `44px` tall with a transparent `::before`, keeping the bar's height. Reduced motion: no arm scale (ring only), fill and bar transitions collapse, the clock still updates as text.

### 18.7 Responsive

`≤860px`: bar sits `calc(72px + env(safe-area-inset-bottom))` above the viewport bottom (`56px` rail + `16px` gap), spans `calc(100vw - 24px)`, never covers the rail. `≤520px`: padding `10px 10px 11px 15px`, radius `16px`, `gap:12px`, clock `21px`, separator hidden, `log` padding `0 11px`, `discard` `9.5px`. Meta truncates before the clock shrinks; the clock never wraps; `log` and `discard` stay on one line. The toast shares the bar's bottom offset.

### 18.8 What not to add

A start/stop button in header, rail, or FAB; pause (`discard` covers a false start); a session history list; notes, tags, or "what are you working on"; confetti, celebrations, or sound at `log`; an always-visible timer, menu-bar companion, or widget; auto-stop on idle, blur, or tab hide; two concurrent sessions, or one that moves to a new day at midnight.
---

## 19. Command palette and keyboard shortcuts

The console is fully operable without a pointer. Nothing added at rest: `⌘K` / `Ctrl+K`, the palette footer, and the cheatsheet explain the keys.

### 19.1 Command palette

| Property | Spec |
| --- | --- |
| Open | `⌘K` / `Ctrl+K`; closes on `Esc`, `⌘K`, backdrop click; focus returns to the previous element |
| Backdrop | modal white-out (§13.5); top-aligned at `min(14vh, 110px)` |
| Panel | `min(560px, calc(100vw - 32px))`, white, radius `18px`, `1px #ececec`, `--shadow-modal`; enter `180ms` |
| Search | borderless `16px/300`, no box, focused on open, placeholder `Type a command or skill…`; `1px #f1f1f1` hairline below |
| Groups | `9px/400` `.13em` uppercase `#bdbdbd`: **Skills**, then **Actions** |
| Row | `40px`, radius `8px`, `12.5px/300`; skill rows carry the `17px` line icon (`#cbcbcb`, selected `#111`) |
| Selected | `#f7f7f7` + a `1.5px #111` inset mark; no hue in the palette chrome |
| Key hint | `9.5px #dcdcdc`, right-aligned: `N` `⌘⇧N` `T` `L` `S` `D` `?` `1–9` |
| Footer | true result count left; `↑↓ navigate · ↵ run · esc` right; both `9.5px #dcdcdc` |
| Match | fuzzy subsequence — exact prefix > word boundary > subsequence; skills above actions; capped at `24` rows with the true count |
| Empty | `No matches.` |
| Nav | `↑`/`↓` wrap, `Home`/`End` jump, `Enter` runs, `Tab` never leaves; hover selects, click runs |

Actions: `New skill…`, `New microskill…`, `Edit daily target…`, `Log today…`, `Start`/`Stop session`, `Delete <skill>…`, `Keyboard shortcuts`, and `Switch to <skill>` per skill; a `Switch to X` row hides while X already matches under **Skills**. `New microskill…` opens the create dialog in micro mode (§23.1); its search terms include `micro`, `microskill`, `1000`, `thousand`, and `shorter horizon`. Running a row closes the palette first (focus restored) so dialogs open against the right trigger. `Log today…` falls back to the most recent rendered day if today is missing from the graph, and says so.

### 19.2 Shortcut map

| Key | Action |
| --- | --- |
| `⌘K` / `Ctrl+K` | command palette |
| `?` | keyboard shortcuts (this sheet) |
| `↑` `↓` / `←` `→` | previous / next skill |
| `1`–`9` | jump to skill N |
| `N` | new skill |
| `⌘⇧N` / `Ctrl+Shift+N` | new microskill (§23.1) |
| `T` | edit this skill's daily target |
| `L` | log today |
| `S` | start / stop the session for today |
| `D` | delete this skill (opens the confirm; never deletes outright) |
| `⌘⇧L` / `Ctrl+Shift+L` | cycle theme: auto → light → dark → auto |
| `Enter` | run the selected palette row / activate the focused control |
| `Esc` | close the topmost surface |

`←`/`→` is the rail grammar; `↑`/`↓` aliases it. Single-key shortcuts stay silent in `input`, `textarea`, `select`, `[contenteditable]`, and while any surface is open (session bar, logger, target editor, dialog, palette); exception: `S` ends a session while the bar is focused. `Esc` belongs to the open surface. Modifier combinations pass through, except the theme chord (§25.5), which is handled in the capture phase. On macOS the browser may reserve `⌘⇧N` for a new incognito window, so `New microskill…` in the palette is the guaranteed keyboard path.

### 19.3 Shortcuts cheatsheet

A compact modal per §13.5, `min(520px, calc(100vw - 32px))`, two columns at ≥ `520px` (one below). Four groups — **Navigate**, **Skills**, **Time**, **Surfaces** — each row a hairline `kbd` chip (`10px`, tabular, radius `4px`, `1px #ececec`) and a `10.5px #767676` label. The theme row (`⌘⇧L` / `Ctrl+Shift+L`, `cycle theme`) is appended to **Surfaces** by `theme.js`, so the index markup stays unaware of it. Opened by `?` or the palette action; `Esc`, `close`, or a backdrop click closes; focus trapped and restored.
---

## 20. Swipe to log — press a day, drag vertically

Three verbs on one square: press, and the finger's direction decides — logger, hold, or swipe. Nothing new is drawn at rest; the only chrome is a readout that lives while the finger is down.

### 20.1 Gesture

```
pointerdown ─90ms─▶ arm bloom ─vertical, 6px─▶ scrub ─release─▶ day written
     │                 │                          │
     │                 └─380ms still─▶ clock        └─esc / pointercancel─▶ restored
     └─release─▶ logger    flick─▶ page scroll    sideways─▶ graph pan
```

| Constant | Value | Meaning |
| --- | --- | --- |
| `SCRUB_STEP` | `0.25 h` | Snap increment |
| `SCRUB_PX` | `11px` | Travel per quarter hour at rest |
| `SCRUB_DOMINANCE` | `1.5×` | Vertical must beat horizontal by this factor |
| `SCRUB_TRAVEL` | `6px` | Vertical travel that enters a scrub (touch/pen) |
| `SCRUB_TRAVEL_FINE` | `4px` | The same, for a mouse |
| `SCRUB_RAMP_MS` | `600ms` | Calm period before sensitivity rises |
| `SCRUB_RAMP_DUR` | `800ms` | Time to reach the ceiling |
| `SCRUB_RAMP_MAX` | `4×` | Ceiling multiplier |

Entry: vertical dominant, `|dy| > |dx| × 1.5` and `|dy| > 6px`; below that a flick scrolls, a sideways drag pans, a shaky press cancels on `MOVE_CANCEL`. Touch waits for the arm (`90ms`); a mouse scrubs as soon as the move is vertical. The move that would open a scrub is cancelled in the single non-passive `touchmove` listener. Travel measured from the press origin. `HOLD_MS`, `ARM_DELAY`, `MOVE_CANCEL` unchanged: a still finger starts the clock at `380ms`, a vertical drag clears both timers. The click after release is suppressed for `600ms`.

### 20.2 Mapping

`start` = the day's current total (`0` when empty); value `clamp(start + round(raw / 0.25) × 0.25, 0, 24)` — snapping is relative, so `2.75` moves to `3`. `raw += −Δy × (0.25 / 11) × ramp` per move, with `getCoalescedEvents()` when available. `ramp` holds `1×` for `600ms`, then smoothsteps to `4×` over `800ms`. Paint on `requestAnimationFrame`, never per event.

### 20.3 Readout

| Property | Spec |
| --- | --- |
| Placement | `position:fixed`, centred on the cell, `12px` above (below when no room), clamped `10px` from every edge |
| Surface | `#fff`, `1px solid #ececec`, radius `14px`, `--shadow-pop`, `padding:11px 13px 11px 14px` |
| Day | `10px/400`, `.1em` uppercase, `#bdbdbd`, one line |
| Value | `26px/200`, `-0.03em`, tabular, `#101010`; unit `h` at `12px/300` `#c4c4c4` |
| Delta | `10px/300`, `#b0b0b0`: `+1.25`; `0` at `#dcdcdc` |
| Ruler | `13 × 64px`: hairline track, ticks every 2h, `7px` dot at the value with a `2.5px` white halo |
| Entry | opacity + `translateY(4px) scale(.97)` → none, `120ms` ease-out |
| Exit | reverse; `hidden` after `180ms` |
| Layer | `z-index:200` — above the cells, below the session bar, logger, and tooltip (§4.7) |
| Pointer | `pointer-events:none`; it never intercepts the drag it describes |

The ruler is content: the number says where you are, the dot how far that is from zero. No accent colour — the swipe sets the scale rather than reporting a level. No scale, rotation, or bounce; the value change is the motion.

### 20.4 Cell and commit

The armed cell keeps its arm ring for the whole gesture; no new cell state. Every change repaints through `levelFor` + `data-l`, previewing the day as it will be. Release commits through the same write path as the logger and timer, ; release with no change writes nothing. Announcements: `Dec 2 · 2.5 h logged.` or `Dec 2 · cleared.` Cancels: `Esc` restores the original without writing; `pointercancel` and window `blur` do the same; a release anywhere still lands (pointer capture).

### 20.5 Accessibility, copy, reduced motion

The swipe is never the only path: the logger remains the keyboard and assistive-tech entry. The readout is `aria-hidden`; the commit is announced once through the live region. Hint `hold a day to time it · drag to set hours`, one line at every breakpoint (§6.3). Reduced motion: the readout enters without scale; value, dot, and cell level still move.

**What not to add.** A sensitivity setting, a "precise" modifier, an always-visible readout, haptics, or a second axis that scrubs the target.
---

## 21. Milestones — struck gold

Eleven fixed thresholds, one card each, in a row that scrolls sideways below the metrics. A card stays grey until the skill's total crosses it, then becomes a small gold medal. Gold appears here and nowhere else.

### 21.1 Thresholds

Ascending, one card per value, order fixed: `1 · 10 · 25 · 50 · 100 · 250 · 500 · 1,000 · 2,500 · 5,000 · 10,000` hours.

The list is filtered to the skill's horizon: `milestonesFor(h)` keeps every threshold `≤ goalOf(h)`. A 10,000-hour skill renders all eleven; a microskill (§23) renders the first eight and its row is titled and counted `achieved / 8`. The last visible card is the summit, whatever the horizon.

| Hours | Caption | Hours | Caption |
| --- | --- | --- | --- |
| `1` | first hour | `250` | committed |
| `10` | the habit | `500` | a craft |
| `25` | a cadence | `1,000` | a thousand |
| `50` | the work | `2,500` | a calling |
| `100` | a hundred | `5,000` | a discipline |
| | | `10,000` | the mark |

Captions are engraved, terse, fixed — never a count or date. The last visible card is the summit: the only card with a distinct (double) rim and the deepest foil. For a microskill the `1,000` card takes that role and keeps its `a thousand` caption.

### 21.2 States

| State | Rule | Material |
| --- | --- | --- |
| **achieved** | `total ≥ threshold` | warm gold foil, bevel + inner shadow, embossed numeral, engraved hairline, rim, subtle specular; full opacity |
| **next** | the lowest threshold not yet reached | grey, but resolved: brighter foil, a live progress hairline at `total / threshold` in the skill hue, no gold |
| **locked** | every other unachieved card | grey foil at `~50%` opacity, hairline border, no specular, no progress |

Exactly one card is `next`; `achieved → next → locked`, computed per render from `stats(h).total` against the filtered list. The section head's count reads `achieved / visible`, so `achieved / 11` normally and `achieved / 8` for a microskill. `next` is the only card carrying colour, and it is data ink (§4): `hsl(var(--hue),55%,52%)`.

### 21.3 The strip

| Property | Spec |
| --- | --- |
| Section | sibling of `.metrics`; `border-top:1px solid #f1f1f1`, `padding:28px 0 0` — the §13.4 band |
| Head | `t-label` "Milestones" left, count right |
| Row | `overflow-x:auto`, gap `12px`, `scroll-snap-type:x mandatory`, `scroll-snap-align:start` |
| Card | `128 × 164`, radius `6px`, centred content |
| Numbers | `30px` for ≤3 digits, `26px` ≤5, else `22px`; weight `200`, tabular |
| Scrollbar | the global `6px` hairline; the strip never widens the page |
| ≤640px | `24px` top pad, `10px` gap, fewer cards in view — full-size look, still snapping |

The strip scrolls inside itself, never the page. First paint opens on the **next** card; snapping is mandatory, so it lands on the nearest snap slot — the next card within half a step (`~70px`) of the middle — instantly, never an animated scroll.

### 21.4 Refresh and motion

A write updates the strip **in place** — `data-state`, `aria-label`, fill width mutated on existing `<li>`s, so `scrollLeft` survives every logger, scrub, and timer commit; only a full `render()` rebuilds it. Entering a skill is quiet: the strip is seeded without announcing. On a crossing, exactly one card settles — a `~500ms` lift plus one shine sweep, never a loop. One write crossing several thresholds (a `24h` day from zero crosses `1` and `10`) settles and announces the **highest** only; the rest turn gold silently.

### 21.5 The gold

Layered CSS only — no image, canvas, or webfont:

- **Foil** — `linear-gradient` at `158°` through seven warm stops (`#fff6d9 → #b98f37`); the summit runs deeper (`#fdefc6 → #a67c2a`).
- **Grain** — two `repeating-linear-gradient`s at `0°` and `90°`, `1px` on / `1px` off, white and dark umber, crossed into a mesh.
- **Rosette** — inline SVG `MS_ROSE`, three faint dashed concentric circles, `116px`, `currentColor`.
- **Bevel** — `inset` `box-shadow`s: light top hairline, dark bottom hairline, side hairlines, faint inner ring; the summit adds a rim (`inset` `0 0 0 4px` / `5px`).
- **Numeral** — embossed by layered `text-shadow` (light up-left, dark down-right, soft drop), never a second colour over a stroke.
- **Specular** — low-alpha `radial-gradient` at the top-left; the only highlight, never animated.

The silhouette is calm and identical in every state: only the material changes.

### 21.6 Accessibility, copy, reduced motion

`<ul role="list">` with `<li>` cards. Every card carries a name: `100 hours — achieved`, `250 hours — 148 of 250, not yet`, `500 hours — not yet`. A card is not a control: no `button` role, click, or focus target; the strip is `tabindex="0"` with an `aria-label` to scroll the overflow. A crossing announces once — `Milestone reached — 100 hours, Piano.` — and one quiet toast (`Milestone · 100 hours`). `prefers-reduced-motion`: no settle, no sheen, no animated scroll; the state changes at once.

**What not to add.** Gold outside these cards, a countdown or "hours to go" string, a per-card click, a looping shine, a header badge, or an editable threshold.

---

## 22. Share card — hold the title

The page's outward face: a poster for a story, not a screenshot of the console. It adds no resting surface. The title gains a second verb, the same grammar as a held day or rail icon.

### 22.1 Trigger

| Action | Result |
| --- | --- |
| Hold the `.head h1` for `650ms` (mouse, touch, pen) | Compose a `1080 × 1920` PNG and download it |
| Release before `650ms` | Nothing; an ordinary click still only focuses the heading |
| Move more than `10px`, scroll, `pointercancel`, `blur`, or a skill switch | Cancel quietly; no card |
| Focus the title, press `Shift + Enter` | Same card, no hold |
| Hover or focus the title | Hairline track under the word and one hint: `hold to share · ⇧↵` |

Primary pointer only. The hold suppresses native text selection, the iOS callout, and the context menu; a hairline under the title fills in `hsl(var(--hue),55%,52%)` at hold progress. The click produced by a completed hold has no action to swallow — the `h1` has no click verb.

The hint is not resting chrome: it exists only on `:hover`, `:focus`, or while the card is being prepared. Its full instruction lives in the heading's `aria-label` and `title`.

### 22.2 Format

| Property | Spec |
| --- | --- |
| Size | `1080 × 1920` (9:16), exactly |
| Renderer | Canvas 2D, no libraries, no external images |
| Type | Inter `200`/`300`/`400`; wait for `document.fonts.ready` |
| Surface | full-bleed page colour, no rounded frame or browser chrome |
| File | `10k-<slug>-<YYYY-MM-DD>.png`; slug is diacritic-stripped lowercase |
| Delivery | `canvas.toBlob` → object URL → temporary `<a download>` click → revoke |

### 22.3 Composition

Two compositions were built and inspected. **Editorial** is canonical: left-aligned, 88px margins, the same vertical spine as the console. A centred **plate** was tested and rejected — symmetrical, generic, and less like a page torn from this product.

| Block | Baseline (1080 × 1920) |
| --- | --- |
| Wordmark `10,000 HOURS` and date | `124` |
| Section rule | `176` |
| Skill title `140px/200` | `382` |
| Cumulative number `250px/200` | `782` |
| Distance bar `6px` | `836` |
| Graph label / month axis / grid | `990` / `1034` / `1056` |
| Next milestone and pace | label `1286`, value `1370` |
| Milestone band | `1570` |
| Footer rule / `10k · one skill, one page` | `1780` / `1842` |

The graph is the hero: 53 columns × 7 rows, `4px` gaps, `13.13px` cells in the §4.3 ramp on the skill hue, future days absent. Months are a `22px` tracked axis; colliding labels drop, and the current month is kept at the right edge so the year closes. A `2px` hairline at `1224` separates the graph from the two answers beneath it.

ETA reads the **next milestone**, never 10,000 unless that is the next threshold: the label carries `NEXT MILESTONE` and the exact threshold, the value is `Mon YYYY`, and a ten-tick ruler places the dot by years. Pace is the `28-day mean`, with a 14-bar sparkline and a dashed target. Zero days are a neutral `2.5px` baseline, not a second accent rule. The cumulative bar is proportional to the skill's own goal (§23), so it is distance rather than a gauge.

### 22.4 Palette

The card reads the page at composition time with `getComputedStyle(document.documentElement)`: `--bg`, `--ink`, `--ink-soft`, `--line`, `--surface`, `--muted`, `--cell-empty`. Missing values fall back to `#fff`, `#101010`, `#6b6b6b`, `#f1f1f1`, `#fff`, `#bdbdbd`, `#f4f4f4`. A background luminance below `0.45` selects the dark variant: dark hairlines and empty cells, a lighter cell ramp, and the skill hue at `62% 64%` for legibility.

Neutral type and hairlines carry every word; the skill hue appears only in data ink — graph cells, bar fill, ETA dot, sparkline. Gold appears only in the milestone band, using §21's foil gradient, rim, inner ring and specular on achieved discs; the next disc is a hollow hairline with a hue progress arc between its neighbours; locked discs are hollow hairlines. No second accent, no gradients in the page itself, no decorative colour.

### 22.5 Copy, feedback, accessibility

Micro labels, not sentences: `CURRENT SKILL`, `CUMULATIVE HOURS`, `OF <goal> H`, `PRACTICE`, `53 WEEKS`, `NEXT MILESTONE`, `PACE`, `28-DAY MEAN`, `MILESTONES`, `n / <goal milestones>`. The footer is `10k · one skill, one page`; no URL, QR, handle, or product pitch.

After download: `showToast('Share card saved · Piano')` and a polite live-region line — `Share card saved for Piano. 1080 by 1920 pixels.` A failure toasts `Could not save the card` and announces it. The heading is `tabindex="0"`, carries `aria-keyshortcuts="Shift+Enter"`, an `aria-label` naming the skill and both paths, and a `title`. Keyboard focus uses a `2px` outline in `--ink` at `6px`. The hold is never the only path.

`prefers-reduced-motion` keeps the hold and its progress meter but removes the flourish: no transition on the track, no completion flash. The card itself is always a still image.

**What not to add.** A screenshot of the console, browser chrome, URLs or QR codes, a Web Share dependency, a file picker, confetti or sound, all-skill recaps, an animated poster, an ETA to 10,000 when the next threshold is nearer, gold outside the milestone discs, or a second accent.
---

## 23. Microskills — a shorter horizon

Some practices are not aimed at ten thousand hours. A page, a graph, and a thousand hours is still a
serious instrument — the same console, the same cells, the same pace. A **microskill** is a skill whose
horizon is `1,000` hours instead of `10,000`. It is not a second product, a smaller page, or a lighter
version: every derived number reads the skill's own goal, so the page tells the truth at either scale.

### 23.1 Trigger

| Path | Result |
| --- | --- |
| Click `.rail-add` | `New skill` — `goal: 10000` |
| `⌘`-click (macOS) / `Ctrl`-click (Windows, Linux) `.rail-add` | `New microskill` — `goal: 1000`, `micro: true` |
| `⌘⇧N` / `Ctrl+Shift+N` | `New microskill` |
| Palette → `New microskill…` | `New microskill` |
| `N`, or a plain `Enter` in the dialog | `New skill` |

The modifier is read **at click time** from the actual event: `event.metaKey || event.ctrlKey`. There is
no sticky mode, no last-used preference, and no keydown listener that changes what the next click will
do. Closing the dialog resets the mode; the next plain click is a normal skill again.

On macOS a `Ctrl`-click is delivered as a `contextmenu` event, not a `click`. The delegated
`contextmenu` listener therefore checks for `.rail-add` **and** `ctrlKey` first, prevents the native
menu, and opens the micro dialog. Right-clicking a rail skill, and every other Ctrl-click, keeps the
existing delete-confirm behaviour. A hover or focus tooltip on the plus states the affordance quietly:
`⌘ click · microskill` (or `Ctrl click · microskill`), one line, only while the button is engaged.

The keyboard path is the palette action; the shortcut is a convenience. macOS browsers may reserve
`⌘⇧N` for a new incognito window, in which case the palette action is the guaranteed route. The
shortcut stays silent while a dialog, palette, cheatsheet, logger, or target editor is open, so it can
never replace a typed value; it is part of the same guarded `keydown` map as §19.

### 23.2 Horizon semantics

`goalOf(h) = h.goal || 10000` is the single read path. `goal` drives the data; `micro` drives only the
presentation. A stored `micro: true` without a goal migrates to `1000`; a missing goal without the flag
migrates to `10000`. Neither field is ever inferred from the skill's name or daily target.

`stats(h)` keeps its shape and gains two fields:

| Field | Meaning |
| --- | --- |
| `skillGoal` | `goalOf(h)` — `1000` or `10000` |
| `complete` | `total >= skillGoal` |
| `remaining` | `max(0, skillGoal − total)` |
| `nextMs` | lowest threshold **inside the horizon** not yet reached, or `null` |
| `goal` | `nextMs ?? skillGoal` — the ETA target, preserving next-milestone semantics |
| `eta` / `etaDays` | projection to `nextMs`; `null` / `∞` at the horizon or with no pace |

Everything downstream follows:

- **Cumulative** — `min(100, total / (skillGoal / 100))`. Two hours is the same felt distance on a
  `1,000`-hour page as twenty are on a `10,000`-hour page; the bar itself is unchanged.
- **ETA** — still answers "when is the next milestone?", never "when is the horizon?". It projects to
  `nextMs`, reports `no pace yet` when pace is zero, and at the horizon reads `—` with the hint
  `1,000 h reached` / `10,000 h reached`. It never renders a countdown, `0 days`, or a percentage.
- **Milestones** — `milestonesFor(h)` filters the fixed threshold list to `≤ goalOf(h)`. A microskill
  shows `1 · 10 · 25 · 50 · 100 · 250 · 500 · 1,000` (eight cards); a 10,000-hour skill shows eleven.
  The count reads `achieved / visible`, and the last visible card is the summit with the double rim —
  `1,000` for a microskill. Captions never change.
- **Pace, levels, graph, target, streak** — untouched. A microskill is not a different unit of work;
  it is the same work with a nearer horizon.

### 23.3 No rail or header marker

Microskills are **not** marked in the rail or in the page header. A micro rail button uses the same
icon, title, active marker, hover fill, and press scale as every other skill. The subline carries only
the editable target. The shorter horizon is communicated structurally, by the milestone row ending at
`1,000` (§23.2), and named once at creation by the dialog (§23.4).

The plus keeps its quiet modifier hint (`⌘ click · microskill` / `Ctrl click · microskill`) because
that is a creation affordance, not a per-skill mark. For assistive technology the rail button's
accessible name still carries the fact — `<name>, microskill, 1,000 hours` — so the horizon is never
lost to a screen reader. No dot, tooltip, badge, ring, or header mark exists in the visual UI.

### 23.4 Create dialog

Micro mode is a class on the existing dialog — `.dialog.is-micro` — not a second modal.

| Element | Spec |
| --- | --- |
| Title | `New microskill` (normal: `New skill`) |
| Subline | `A page, a graph, a thousand hours.` (normal: `A page, a graph, a target.`) |
| Goal badge | opposite the title in a flex `.dlg-head`, `20 × 20px` ring + `1,000 h` label |
| Ring | `1.4px` track `#f1f1f1`; `1.4px` arc in ink `#101010`, one tenth-turn, `5.027 / 50.265` dash |
| Label | `10px/300`, `#b8b8b8`; `1,000` at `400`, ink; tabular numerals |
| Entry | opacity `0 → 1` with `translateY(-2px) → 0`, `280ms` ease-out; reduced motion instant |
| Reset | closing removes `.is-micro`, hides the badge, restores title/subline; all other fields unchanged |

The badge is the only new material in the dialog: no gold, no hue, no gradient, no extra field. The
name, 42-icon picker, hue picker, and target stepper are identical in both modes. `create` writes
`goal: 1000, micro: true` in micro mode and `goal: 10000, micro: false` otherwise.

### 23.5 No header marker

The page header is unchanged for a microskill: title, tracking line, target button, legend, gallery,
and theme control are identical. No horizon text or dot follows the target. The milestone row is the
only visual record of the shorter goal.

### 23.6 Persistence

All skills — normal and micro — live under one local-first key. The store is `store.js`; `index.html`
hydrates from it **before the first render**.

```json
{
  "version": 1,
  "hi": 0,
  "habits": [
    {
      "name": "Piano",
      "hue": 268,
      "target": 3,
      "icon": "piano",
      "goal": 10000,
      "micro": false,
      "createdAt": "2025-01-02",
      "log": { "2025-01-02": 1.5 }
    }
  ]
}
```

| Rule | Behaviour |
| --- | --- |
| Key | `tenk.v1`; backups at `tenk.v1.backup`; theme stays at `tenk.theme`, untouched |
| Version | `version: 1`; another version is treated as unreadable, not silently migrated |
| Hydrate | `TenkStore.load()` → `{status: ok \| empty \| invalid \| unavailable}`; `ok` supplies habits and `hi` |
| Seed | only when the key is absent; the starter habits are initialized once and written back |
| Corrupt | the raw payload is copied to `tenk.v1.backup`, then starter habits are reseeded; the page never throws |
| Validate | names trimmed to `40`; hue `0–360`; target `0.25–12`; goal positive; `createdAt` a local day key |
| Logs | only `YYYY-MM-DD` keys with finite `> 0` values; minute precision; a day clamped to `24`; `0` deletes the key |
| Migration | missing `goal` → `10000`; `micro: true` without a goal → `1000`; missing `createdAt` → today |
| Save | after create, delete, log/clear, target change, session finish, and skill selection |
| Timing | mutations debounce `80ms`; create/delete write immediately; `pagehide` flushes the current state |
| Storage guard | every read and write is wrapped; absent, blocked, quota-full, or `file://` storage returns safely |

A running stopwatch is still not persisted; it is written only when logged or discarded (§18, roadmap).
There is no cross-tab merge: the last write wins, and the page is not a collaborative document.

### 23.7 Accessibility, copy, reduced motion

- The rail's accessible name is the complete fact — `<name>, microskill, 1,000 hours` — even though the
  visual rail is identical to every other skill.
- The plus keeps `aria-label="Add skill"` and gains `aria-keyshortcuts="Meta+Shift+N Control+Shift+N"`;
  the palette action and shortcut mean the modifier gesture is never the only route.
- The dialog remains `role="dialog"`, `aria-modal="true"`, labelled by its title; the goal badge is
  static text and is not announced as a control. Focus still starts in the name field and returns to
  the rail button after creation.
- Copy uses **microskill** as one word, lowercase in running text, capitalised only in the dialog title.
  The horizon is always formatted with a thousands separator: `1,000 h`.
- `prefers-reduced-motion`: the dialog badge appears without transform. No other motion is added. Gold
  remains confined to §21; the only hue remains data ink.

### 23.8 What not to add

A sticky modifier or "last used mode"; a separate micro page, route, or storage key; a second accent,
badge, or icon family; a dot, ring, tooltip, or header mark for a microskill; a special graph, cell
style, or level scale; a countdown, percentage, or "hours to go"; gold outside the milestone row;
auto-promoting a skill to micro because its target is small; or an in-dialog horizon slider. The horizon is chosen once, at
creation, and everything else stays the same instrument.

---

## 24. Gallery — the visual index

The gallery (`gallery.html`) is the one image-led surface. It is not a second console: no rail, no metrics, no skill hue. A black field, photography as the only colour, and two hairline pills as chrome. It is the visual answer to "which hobbies could I keep?", linked from the console header and back into an exact skill page.

### 24.1 Entry on the console

One control, in the header's right cluster before the legend. It is the first thing in `.head-tools`; the legend follows, the hold hint stays below. It never enters the rail or the canvas.

| Property | Spec |
| --- | --- |
| Control | `30px` tall, `1px solid #ececec`, radius `8px`, `padding:0 10px 0 8px`, `gap:6px`, `flex:0 0 auto` |
| Icon | `17px` 2×2 grid — four `7 × 7` rounded rects on the 24-box, `stroke 1.2`, `fill:none`, `rx:1.6`; no fifth stroke |
| Label | `gallery`, lowercase, `10.5px/300`, `0.02em`, `#767676` |
| Hover | text `#111`, background `#fafafa`, border `#e4e4e4` |
| Press | `scale(.97)`, `120ms` |
| Focus | `outline:2px solid #111; outline-offset:2px` |
| Access | real `<a href="gallery.html">`, `aria-label="Open the hobby gallery"` |
| Arrival | the four cells fade/scale in place, `420ms`, `60ms` stagger; the page's own `viewIn` still owns the canvas |

At `≤520px` the control keeps icon and label; `.head-tools` tightens to `14px`. It sits on the header's left stack with the legend and must not wrap or split. Reduced motion removes the cell stagger. No tooltip repeats the label; no second gallery link is added to the rail, palette, or canvas.

### 24.2 The field

| Property | Spec |
| --- | --- |
| Grid | `15 × 15 = 225` tiles, `200px` square, `20px` gaps, tile radius `15px`, deterministic seed `0xc0ffee` (`distribute2DGrid`) |
| Surface | `background:var(--bg,#000)`; tile `var(--surface,#1a1a1f)`; text `var(--ink,#fff)` |
| Drag | unchanged: `CLICK_SLOP 5px`, exponential inertia `τ .325s`, rest speed `8px/s`, velocity window `100ms`, `MAX_SPEED 5000` |
| Vignette | fixed, `pointer-events:none`: radial `125% × 105%` at `50% 48%`, transparent `38%` → `rgba(0,0,0,.28)` `72%` → `.66` `100%`; plus `rgba(0,0,0,.32)` at top/bottom `13%` |
| Entrance | tile `opacity 0→1`, `scale(.975)→1`, `translateY(6px)→0`, `720ms`; delay `(row + col) × 13ms`, `animation-fill-mode:backwards` |
| Hint | centred `33px` hairline pill: four-way move glyph + `drag to explore`, `·`, pointer glyph + `click to open`; `9.5px/300`, `rgba(255,255,255,.55)` |
| Home | top-left `33px` hairline pill, `14px` back chevron + `home`; `aria-label="Back to the 10,000 Hours console"` |
| Chrome in | `opacity 0→1`, `translateY(-4px)→0`, `550ms`; home at `420ms`, hint at `720ms`, `backwards` |

The hint retires on the first pointerdown or keyboard focus in the field: `opacity → 0`, `translate(-50%, 6px)`, then `hidden` after `420ms` (`0ms` under reduced motion). It is `aria-hidden`, never a banner, and never returns in the session. The home pill stays quietly at `rgba(0,0,0,.42)` with a `14px` blur; hover raises text to `--ink` and border to `rgba(255,255,255,.32)`.

No skill hue appears here. No counters, filters, chips, search field, tile captions, or card material.

### 24.3 Supported and unsupported

Mapping lives in one documented table at the top of `gallery.html`:

| Hobby image | Console skill |
| --- | --- |
| `Piano` | `Piano` |
| `Painting` | `Drawing` |
| `Coding` | `Programming` |
| `Running` | `Running` |

There is no Japanese image; `Japanese` is therefore unsupported. `DEFAULT_SKILLS = Piano, Drawing, Programming, Running, Japanese` is the fallback only. On boot the gallery reads `tenk.v1` defensively: `{habits:[{name}]}`; absent, corrupt, malformed, or empty falls back to the defaults. It never writes the key. A saved skill whose name equals a hobby case-insensitively wins first (`Chess` lights `Chess`); otherwise the mapped target must exist, and the stored casing is preserved (`piano` → `index.html?skill=piano`).

**Supported.** Colour photograph, `role="link"`, `tabindex="0"`, `aria-label="Open <skill>"`, `data-href="index.html?skill=<skill>"`. Click (after a sub-`5px` press), `Enter`, or `Space` navigates in the same tab. A drag never navigates; pointercancel never navigates.

**Unsupported.** `filter:grayscale(1)`, brightness `.82`, `opacity:.45`; no pointer cursor; `role="link"`, `aria-disabled="true"`, `tabindex="-1"`, `aria-label="<Hobby> — coming soon"`. Hover lifts opacity to `.6` only. It remains visible as a preview, not hidden and not removed.

### 24.4 Names on approach

Each tile carries one `aria-hidden` bottom layer: a gradient from `rgba(0,0,0,.72)` to transparent, `padding:38px 14px 13px`, revealed at `opacity 0→1`, `translateY(4px)→0`, `280ms`. The name is `13px/300` with a soft text shadow. Supported tiles end in a `23px` hairline circle with an up-right arrow; unsupported tiles end in a `4px` dot + `soon`, `8px/400`, `.15em` uppercase at `55%` white. No permanent labels.

On precise pointers a supported photograph scales to `1.035` over `650ms`; unsupported stays still. While dragging, `.is-dragging` cancels the zoom and hides every meta layer. Keyboard focus uses the same reveal, so names are never pointer-only.

### 24.5 Deep link back to a skill

On boot the console reads `?skill=<name>` from `URLSearchParams`, trims it, and selects the first habit whose name matches case-insensitively. Found: the page renders that skill, the rail marker follows, `scrollY` stays `0`. Not found: the default selection stays and nothing is announced. The URL is not rewritten when skills switch; the parameter is honoured once, at boot. The gallery's home pill returns to `index.html` without a parameter.

### 24.6 Motion

| Element | Motion | Duration |
| --- | --- | --- |
| Tile entrance | opacity, `scale(.975→1)`, `translateY(6→0)` | `720ms`, delay `13ms × (row + col)` |
| Home / hint | opacity, `translateY(-4/6→0)` | `550ms`, delays `420/720ms` |
| Meta reveal | opacity, `translateY(4→0)` | `280ms` |
| Image approach | `scale(1→1.035)` | `650ms` |
| Home focus pan | transform to bring the tile inside a `64px` margin | `450ms` |
| Hint retire | opacity, `translate(-50%, 6px)` | `350ms` |

One easing: `cubic-bezier(.2,.8,.2,1)`. No loops, springs, parallax, or ambient drift. `prefers-reduced-motion: reduce` removes tile/chrome entrances, image zoom, focus-pan transition, and meta transitions; the overlay still appears and the grid still drags.

### 24.7 Accessibility

Supported tiles are links to assistive technology: `role="link"`, `tabindex="0"`, `aria-label="Open Piano"`, `Enter`/`Space` activation. Unsupported tiles expose their hobby name and disabled state but are removed from the tab order. The focus ring is `2px` in `--ink` with `3px` offset and a dark halo so it survives photography. Focusing a tile outside the viewport pans the field until the tile sits inside a `64px` margin — pointer drags are unaffected, and the pan transition cancels the moment a drag begins.

The drag surface itself is a `role="group"` labelled `Hobby gallery`; a visually hidden `h1` names the screen. The home pill is a real link with an explicit accessible name; the hint is decorative and `aria-hidden`. Images keep their hobby `alt`; the meta layer is `aria-hidden` so names are not announced twice.

### 24.8 What not to add

Permanent labels on every tile, a second accent, the skill hue, tile cards or shadows, counts and progress on the gallery, hidden unsupported tiles, a filter/search bar, an explicit drag mode, a second back button, or a text banner in place of the hint. Keep the photography and the drag as the interface.
---

## 25. Theming — auto, light, dark

The page after dark is the same page: same grid, same hairlines, same silence. Light is the canonical canvas of §4; dark is a second set of values for the same tokens, not a second design. Nothing in the view, data, or interaction layers knows which one is active.

### 25.1 Modes and persistence

| Mode | Meaning |
| --- | --- |
| `auto` | Follow `prefers-color-scheme`; the default when no choice exists |
| `light` | White canvas, §4 values, regardless of the system |
| `dark` | Near-black canvas, §25.2 values, regardless of the system |

The choice lives in `localStorage` under `tenk.theme` as `auto`, `light`, or `dark`; a missing or invalid value means `auto`. The product's own data key (`tenk.v1`) is never touched. A storage failure (private mode, some `file://` contexts) degrades to a session-only preference rather than an error.

`auto` is live: while it is selected, a system appearance change repaints the page; an explicit `light` or `dark` choice wins and ignores the system until the user cycles back to `auto`.

`?theme=light|dark|auto` is a **preview override** for screenshots and debugging. It paints the page without being persisted; the first deliberate change (control click or shortcut) removes the parameter with `history.replaceState` and stores the real preference. It is not a sharing mechanism.

`window.TenkTheme` exposes `get()`, `set(pref)`, `cycle()`, and `refresh()` so a component port can drive the same engine.

### 25.2 Token values

Dark is tuned, never inverted. Values are exact.

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `--bg` | `#ffffff` | `#0b0b0c` | page, rail, fab |
| `--surface` | `#ffffff` | `#121214` | popovers, dialogs, session bar |
| `--surface-2` | `#f7f7f7` | `#17171a` | quick-add, selected rows |
| `--surface-hover` | `#fafafa` | `#141416` | rail/row hover |
| `--ink` | `#101010` | `#f2f2f1` | primary text, hero numbers |
| `--ink-soft` | `#b8b8b8` | `#9a9a9e` | subline, hints, empty states |
| `--muted` | `#7a7a7a` | `#8f8f94` | meta emphasis, quiet controls |
| `--line` | `#f1f1f1` | `#1f1f21` | dividers, rules, tile borders |
| `--line-strong` | `#e7e7e7` | `#2c2c2f` | input underline, chrome |
| `--cell-empty` | `#f4f4f4` | `#1b1b1e` | level-0 cell |
| `--shadow` | `0 16px 40px -12px rgba(0,0,0,.18), 0 2px 8px rgba(0,0,0,.04)` | `0 18px 44px -12px rgba(0,0,0,.75), 0 2px 8px rgba(0,0,0,.5)` | floating surfaces |
| `--shadow-modal` | `0 24px 60px -16px rgba(0,0,0,.22), 0 2px 10px rgba(0,0,0,.04)` | `0 28px 70px -18px rgba(0,0,0,.8), 0 2px 12px rgba(0,0,0,.55)` | modal, palette |

`color-scheme` follows the resolved theme so native form controls and scrollbars match. `::selection` inverts (`ink` on `bg` in dark). `--accent` and `--accent-spark` are re-tuned on `.v1` / `.runner`, where the skill hue lives, so a hue is never resolved at the root.

**Dark cell ramp.** Luminance rises monotonically away from the field; saturation rises with it, so a full cell reads as ink rather than as a grey card.

| Level | Dark fill | Character |
| --- | --- | --- |
| 0 | `#1b1b1e` | quiet field, still visible |
| 1 | `hsl(h 30% 24%)` | a mark |
| 2 | `hsl(h 37% 35%)` | a habit forming |
| 3 | `hsl(h 44% 47%)` | on cadence |
| 4 | `hsl(h 52% 59%)` | above cadence |

### 25.3 What changes, what does not

Only colour changes. Hairlines stay `1px` hairlines; the metric triad, graph, header, and rail keep their exact geometry. **No new cards, panels, gradients, glass, or decorative shadows are introduced**; the only shadow in dark is the existing elevation on surfaces that already floated in light. The only gold remains the milestone row, and it keeps its foil and bevel (§21.5); inert milestone cards become dark metal rather than flat panels. The tooltip, toast, and primary button invert to ink-on-background. Skill hue still appears only in data ink — never on chrome, headings, or controls. `:focus-visible` outlines use `--ink` everywhere.

### 25.4 The control

A single 24-box line glyph, `14px`, at rest in `--muted`, turning `--ink` on hover/focus. The glyph reports the **preference**, not the resolved theme: a half-filled disc for `auto`, a sun for `light`, a moon for `dark`. On approach it names itself, `theme · auto`; assistive technology hears the full state and the next action, `Theme: auto, dark. Activate for light.`

- **Console:** appended to the header legend after `MORE`, separated by a `1px` hairline. The legend's existing gap, type, and baseline are untouched; at `≤520px` the control is `12px` tall so the stacked header does not shift the page by a pixel.
- **Gallery:** a `32px` floating square at bottom-right, same glyph and tip, `--bg` fill with a hairline border.
- Both are ordinary `<button>`s with `aria-keyshortcuts="Meta+Shift+L Control+Shift+L"`, keyboard focus, and a `:focus-visible` ring.
- The cheatsheet row is injected by `theme.js` into the last group, so `index.html` stays free of theme markup.

### 25.5 Shortcut

`⌘⇧L` on macOS, `Ctrl+Shift+L` elsewhere. It cycles `auto → light → dark → auto`, is handled in the capture phase so an open surface cannot swallow it, never fires without the platform modifier, and announces the new mode politely. The current mode is always visible in the control's tip and `aria-label`; the shortcut never depends on remembering the order.

### 25.6 The transition

A **circular reveal** via the View Transitions API: the new theme is clipped from a circle at the control (or the viewport centre for the shortcut), expanding to the farthest corner. Duration `480ms`, easing `cubic-bezier(.2,.8,.2,1)` — the same single curve as everything else. Element-level colour transitions are held still while the snapshots are captured (`html.tenk-vt`), so the revealed frame is the final theme rather than a half-faded one.

Where `document.startViewTransition` is unavailable, a colour-only crossfade runs for `380ms` (`html.tenk-switching`). Under `prefers-reduced-motion: reduce`, both are skipped and the theme changes at once. Nothing animates on load, on system change in `auto`, or on a storage sync from another tab; the reveal belongs to a deliberate choice.

### 25.7 Gallery

The gallery keeps its near-black field (`#050506`) and dark tile placeholders (`#1a1a1f`); light mode is paper (`#f7f7f6`, placeholders `#e9e9e5`, placeholder ink `#6d6d69`). The document backdrop matches the field, so overscroll and safe areas never flash black in light mode. Photographs are the only colour on the page in either mode. The floating theme control is the only chrome.

### 25.8 What not to add

A settings page, an account-level preference, a per-skill theme, a third "dim" theme, a theme preview grid, a hue-tinted dark canvas, glow or neon, a different font for dark, or a second accent. Do not animate theme changes on page load, and do not persist the `?theme` preview. If a new surface needs a colour, add it to the token table for both modes before using it.
