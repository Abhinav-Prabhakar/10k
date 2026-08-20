# 10k — Product Document

## Why this exists

Every goal app measures the wrong thing. They track outcomes — weight, grades, completion bars, streak counts — and outcomes lag. In any skill worth having, the gap between effort and visible progress is months. So the user works hard for six weeks, opens the app, sees no movement in the numbers it chose to show them, and concludes the whole thing isn't working. The app's own metrics manufacture the quitting.

The 10,000-hour rule offers a different frame. In a domain with a long learning curve, accumulated hours of deliberate practice are the best leading indicator of ability. You cannot control how good you are today. You can fully control whether you sat down today.

So 10k is a goal app that measures exactly one thing: **time spent**. Its psychology is built around accumulating, not comparing. An AI coach plans *what to do* with those hours — generating a skill-specific roadmap for anything you want to master, built on Scott Young's Ultralearning principles — but the scoreboard never leaves hours. The app's entire job is to make the one input you control visible, bankable, and pointed at a known date.

The second failure of goal apps: they punish gaps. Duolingo-style streaks teach that one missed day destroys your standing, so the first miss becomes the uninstall. GitHub's contribution graph is the counterexample — it shows gaps honestly and still motivates, because empty squares aren't moral judgments, they're just history. We follow GitHub.

## Philosophy

- **One currency.** Everything the app says to the user, it says in hours. No XP, no points, no levels. A second score devalues the first.
- **Control the input, trust the output.** Results are a lagging indicator; hours lead. Worry a little less about results. Focus on time spent.
- **The bank never decays.** Hours don't expire. Gaps are forgiven by design. Comebacks carry no guilt — "your hours don't expire" is the brand.
- **The ledger must be true.** Editable entries, orphaned-timer recovery, pause shown separately from focus. A bank you don't trust is a bank you abandon.
- **The plan is real pedagogy.** Roadmaps are generated against Young's nine principles — metalearning, focus, directness, drill, retrieval, feedback, retention, intuition, experimentation. Every tip carries a "why?" linking to the principle behind it. If the coach can't cite the user's data or the method, it's just a chatbot.
- **Rest is part of the plan.** Planned days off are drawn differently than missed days. The tracker doesn't demand 365-day years.
- **Small every day beats heroic rarely.** The 10-minute floor, the sick-day flow, the cadence anchors — all in service of lowering the cost of showing up.

## The loop

1. **Onboard.** Pick any skill — piano, chess, drawing, anything. Honest start: rough prior experience becomes an opening balance, because pretending everyone starts at zero breaks believability. Choose a cadence anchored to real life ("45 min/day = one episode"). The AI generates a roadmap to the first milestone, split into parallel tracks (e.g., songs and theory), and shows the user their 10,000-hour date for the first time.
2. **Show up.** Two-tap timer start from widget or lock screen. Optional one-tap intent tag before, optional flow/grind/distracted after. Pause ≠ stop: "focused 47 of 62 min." Or log later with the dial — snaps to 15 min, long-press to correct.
3. **See it banked.** The heatmap, the week footer, and the headline moment: *the completion date moved.*
4. **Collect and re-plan.** Each milestone card collected is a ritual — write your own line, refine the roadmap to the next milestone with the coach.
5. **Repeat for a decade.**

## The tracker

- GitHub-style heatmap; tap a square → dial or timer.
- **Percentile colors**, calibrated to the user's trailing 60 days. A 3h day is a warmup for one person and a marathon for another; fixed thresholds go meaningless as the user evolves.
- **Planned rest days render as outlines**, not gray. A planned day off is the plan; an unplanned miss is data.
- **Milestone lines** — thin marks on the heatmap at the dates hours were crossed. Click to reopen the card. The tracker doubles as a timeline for free.
- **Long-press a day → one-line note.** The hours ledger doubles as a searchable practice diary.
- **Week footer:** total, best day, pace vs. cadence. Three facts, no dashboard.
- **Streaks, carefully.** The 10-minute floor is the universal definition of a counted day. Never-miss-twice: only after a miss does the next square get a "rescue" outline; complete it and the streak survives. Nudges only when actionable. No visible streak counter by default — the heatmap tolerates gaps; we don't take hostages.

## Milestone cards

Cards at **10h, 50h, 100h, 250h, 500h, 750h, 1k, 2k, 5k, 7.5k, 10k.** (10h and 50h exist because at 30 min/day, 100h is six months away — beginners need week-scale wins or the collection mechanic never activates.)

- Black-and-white by design: **the future is colorless until you live it.** Collected cards are colored.
- Each shows a single-line promise of an ability at that hour mark ("play Mozart blindfolded").
- The next card shows its line blurred — tap to spoil. Everything after is pure silhouette. The roadmap stays visible without spending the reveal.
- **ETA on the next card:** "~6 weeks at current pace." The wall is a countdown.
- **On collection, the user writes their own line.** The preset is the promise; theirs is the receipt. Date-stamped. This is the highest-emotion moment in the product — no confetti-only moments.
- Share as PNG, opt-in. The card is the trophy. No feeds, no leaderboards.

## The coach

Chat-based, grounded in the user's calendar. The last 14 days of squares and tags are its context — "you did 6h, all on Saturdays; spread it?" beats generic advice.

- **Roadmap locked between milestones.** Refinement happens at card collection: a ritual, not a mid-week whim. Matches Young's commit-after-metalearning stance.
- Each re-plan asks one question: **"what did you avoid last block?"** Silent avoidance is the real killer. Schedule it or consciously drop it.
- The coach speaks one currency. "You banked 4.5h of skill this week." Never a second score.
- Parallel tracks get a **balance bar with hysteresis** — nudge on drift (e.g., songs vs. theory at 80/20) only after 3+ weeks. Weekly nagging trains blindness.
- Per-skill micro-tools live on the timer screen: metronome for piano, whatever fits the domain. Post-session **weakest-link prompt**: "which bar felt worst?" — past-you chooses next session's drill. Directness and drill, mechanized.

## Pace & the date

- **The headline number is the completion date:** "10,000 hours: April 2031." Every session summary shows the delta — "moved 2 days closer." Logging pulls the date toward you. This is the strongest reinforcement loop available and it's pure arithmetic. If we build one thing perfectly, it's this.
- **Cadence picker with real-life anchors** — reframes cost at the moment of commitment.
- **Multi-skill tradeoff made visible:** "Adding drawing at 3h/week pushes piano's date from 2031 → 2034." People juggle four skills and wonder why dates recede; show the tradeoff at the moment of adding.
- **Resource library with hour estimates:** "This course ≈ 40h · 12h in." Progress in hours consumed, never % complete. The philosophy stays consistent everywhere, even inside the library.

## Sick days

The flow we know is right: on a skip day, offer a 10-minute session. If it feels good, upsell to an hour. Track the conversion rate and show the user their own number — "71% of your 10-min starts became real sessions" — which persuades better than any copy. Rest-day tap copy: "Rest is part of the plan."

## Trust

- **One-tap JSON/CSV export.** This is a decade-long ledger of someone's life. Ownership is a retention feature, not compliance.
- **Comeback flow after 2+ weeks off:** no guilt, one question — "still in? adjust cadence?"

## What we never build

Leaderboards. Social feeds. XP, levels, points. Badges that aren't cards. Mood-tracking charts. Streak freezes (a forgivable streak needs no freezing). Notifications after the day is already logged.

## The one-sentence version

An app that keeps score in the only honest unit — hours — makes the finish line a real date on the calendar, and moves that date closer every single time you show up.
