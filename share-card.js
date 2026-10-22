/* ============================================================
   10,000 HOURS — share card (design.md §22)
   Hold the page title for 650ms (or focus it and press Shift+Enter)
   to compose a 1080 × 1920 poster and download it.
   Canvas 2D only. No libraries, no network assets except Inter.
   ============================================================ */
(function(){
'use strict';

const W = 1080, H = 1920;
const HOLD_MS = 650;
const MOVE_CANCEL = 10;
const FONT = '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif';
const DEFAULT_LAYOUT = 'editorial';

let hold = null;
let busy = false;
let lastFire = 0;
let lastCanvas = null;

/* ============================================================
   THEME
   Same tokens as the console, read from the root; light fallbacks.
   ============================================================ */
const colorCache = new Map();

function cssVar(name){
  return getComputedStyle(document.documentElement).getPropertyValue(name).trim();
}
function colorRGBA(color){
  if(colorCache.has(color)) return colorCache.get(color);
  const cv = document.createElement('canvas');
  cv.width = cv.height = 1;
  const g = cv.getContext('2d', {willReadFrequently:true});
  g.fillStyle = '#000';
  g.fillStyle = color;
  g.fillRect(0,0,1,1);
  const d = g.getImageData(0,0,1,1).data;
  const out = {r:d[0], g:d[1], b:d[2], a:d[3] / 255};
  colorCache.set(color, out);
  return out;
}
function alpha(color, a){
  const c = colorRGBA(color);
  return `rgba(${c.r},${c.g},${c.b},${a})`;
}
function luminance(color){
  const c = colorRGBA(color);
  return (0.2126 * c.r + 0.7152 * c.g + 0.0722 * c.b) / 255;
}

function posterPalette(hue){
  const bg = cssVar('--bg') || '#ffffff';
  const dark = luminance(bg) < 0.45;
  const ink = cssVar('--ink') || (dark ? '#f2f2f2' : '#101010');
  const soft = cssVar('--ink-soft') || (dark ? '#a3a3a3' : '#6b6b6b');
  const line = cssVar('--line') || (dark ? '#262626' : '#f1f1f1');
  const surface = cssVar('--surface') || bg;
  const empty = cssVar('--cell-empty') || (dark ? '#1b1b1b' : '#f4f4f4');
  const faint = cssVar('--ink-faint') || (dark ? '#8d8d8d' : '#bdbdbd');
  const muted = cssVar('--muted') || cssVar('--ink-muted') || (dark ? '#a8a8a8' : '#767676');

  const accentL = dark ? 64 : 52;
  const accentS = dark ? 62 : 55;
  const accent = `hsl(${hue},${accentS}%,${accentL}%)`;
  const accentSoft = dark ? `hsl(${hue},48%,44%)` : `hsl(${hue},45%,80%)`;
  const ramp = dark
    ? [[46,32],[50,42],[55,54],[60,66]]
    : [[42,88],[48,74],[52,58],[58,44]];
  const levels = ramp.map(([s,l]) => `hsl(${hue},${s}%,${l}%)`);

  return {
    dark, bg, ink, soft, line, surface, empty, faint, muted,
    accent, accentSoft, levels,
    inkA: a => alpha(ink, a),
    lineA: a => alpha(line, a),
    gold: '#b98f37',
    goldRing: '#a67c2a',
  };
}

/* ============================================================
   DATA
   ============================================================ */
function currentSpec(){
  const h = HABITS[state.hi] || HABITS[0];
  const s = stats(h);
  const list = milestonesFor(h);
  const nextIndex = list.findIndex(m => s.total < m);
  return {
    name: h.name,
    hue: h.hue,
    target: h.target,
    total: s.total,
    goal: s.skillGoal,
    sessions: s.sessions,
    first: s.first,
    pace: s.pace,
    ratio: s.ratio,
    nextMs: s.nextMs,
    eta: s.eta,
    etaDays: s.etaDays,
    days: s.days,
    milestones: list,
    achieved: list.filter(m => s.total >= m).length,
    nextIndex: nextIndex,
    dateLabel: today.toLocaleDateString('en-US', {month:'short', day:'numeric', year:'numeric'}).toUpperCase(),
    since: s.first ? fmtMonYr(s.first) : null,
  };
}

function slugify(value){
  return String(value)
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .toLowerCase().replace(/[^a-z0-9]+/g,'-')
    .replace(/^-+|-+$/g,'').slice(0,48) || 'skill';
}

/* ============================================================
   CANVAS PRIMITIVES
   ============================================================ */
function font(ctx, size, weight, tracking){
  ctx.font = `${weight} ${size}px ${FONT}`;
  ctx.letterSpacing = `${tracking || 0}px`;
}
function tracked(ctx, text, x, y, spacing, align){
  const chars = Array.from(String(text));
  let total = 0;
  for(const ch of chars) total += ctx.measureText(ch).width;
  total += spacing * Math.max(0, chars.length - 1);

  let cx = x;
  if(align === 'right') cx = x - total;
  else if(align === 'center') cx = x - total / 2;

  const previous = ctx.textAlign;
  ctx.textAlign = 'left';
  for(const ch of chars){
    ctx.fillText(ch, cx, y);
    cx += ctx.measureText(ch).width + spacing;
  }
  ctx.textAlign = previous;
  return total;
}
function text(ctx, str, x, y, size, weight, color, align, tracking){
  font(ctx, size, weight, tracking || 0);
  ctx.fillStyle = color;
  ctx.textAlign = align || 'left';
  ctx.fillText(str, x, y);
  ctx.textAlign = 'left';
}
function measure(ctx, str, size, weight, tracking){
  font(ctx, size, weight, tracking || 0);
  return ctx.measureText(str).width;
}
function micro(ctx, str, x, y, size, spacing, color, align, weight){
  font(ctx, size, weight || 400, 0);
  ctx.fillStyle = color;
  return tracked(ctx, str, x, y, spacing, align || 'left');
}
function rule(ctx, x, y, w, color, width){
  ctx.strokeStyle = color;
  ctx.lineWidth = width || 2;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + w, y);
  ctx.stroke();
}
function rr(ctx, x, y, w, h, r){
  const q = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + q, y);
  ctx.arcTo(x + w, y, x + w, y + h, q);
  ctx.arcTo(x + w, y + h, x, y + h, q);
  ctx.arcTo(x, y + h, x, y, q);
  ctx.arcTo(x, y, x + w, y, q);
  ctx.closePath();
}
function disc(ctx, x, y, r){
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.closePath();
}

/* ============================================================
   THE POSTER
   ============================================================ */
function renderCard(spec, layout){
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  const P = posterPalette(spec.hue);

  ctx.fillStyle = P.bg;
  ctx.fillRect(0, 0, W, H);

  if(layout === 'plate') drawPlate(ctx, spec, P);
  else drawEditorial(ctx, spec, P);

  lastCanvas = canvas;
  return canvas;
}

/* ---------- editorial: the chosen composition ---------- */
function drawEditorial(ctx, d, P){
  const M = 88, CW = 904;

  /* masthead */
  micro(ctx, '10,000 HOURS', M, 124, 32, 6.5, P.ink);
  micro(ctx, d.dateLabel, M + CW, 124, 24, 3.2, P.faint, 'right');
  rule(ctx, M, 176, CW, P.line, 2);

  /* title */
  micro(ctx, 'CURRENT SKILL', M, 252, 24, 4.2, P.faint);
  const titleSize = fitTitle(ctx, d.name, CW, 140);
  text(ctx, d.name, M, 382, titleSize, 200, P.ink, 'left', -titleSize * 0.04);

  const sub = d.since
    ? `since ${d.since} · target ${fmtTarget(d.target)} h/day`
    : `no sessions yet · target ${fmtTarget(d.target)} h/day`;
  text(ctx, sub, M, 438, 34, 300, P.soft, 'left', -0.4);

  /* cumulative */
  micro(ctx, 'CUMULATIVE HOURS', M, 566, 24, 4.2, P.faint);
  const total = fmtInt(d.total);
  let numberSize = 250;
  font(ctx, numberSize, 200, -numberSize * 0.035);
  while(numberSize > 176 && ctx.measureText(total).width > CW - 80){
    numberSize -= 4;
    font(ctx, numberSize, 200, -numberSize * 0.035);
  }
  const numberWidth = ctx.measureText(total).width;
  ctx.fillStyle = P.ink;
  ctx.textAlign = 'left';
  ctx.fillText(total, M, 782);
  text(ctx, 'h', M + numberWidth + 18, 782, 48, 300, P.soft);

  /* distance bar — 1% per 100 hours, per §6.9 */
  const barY = 836;
  rr(ctx, M, barY, CW, 6, 3);
  ctx.fillStyle = P.line;
  ctx.fill();
  const pct = Math.min(1, Math.max(0, d.total / d.goal));
  const fillW = pct > 0 ? Math.max(6, CW * pct) : 0;
  if(fillW){
    rr(ctx, M, barY, fillW, 6, 3);
    ctx.fillStyle = P.accent;
    ctx.fill();
  }
  micro(ctx, `OF ${fmtInt(d.goal)} H`, M, 884, 24, 4.0, P.faint);

  /* graph */
  micro(ctx, 'PRACTICE', M, 990, 24, 4.2, P.faint);
  micro(ctx, '53 WEEKS', M + CW, 990, 24, 4.2, P.faint, 'right');
  drawMonths(ctx, M, 1034, CW, P, 'left', 22);
  drawGraph(ctx, d, P, M, 1056, CW);

  rule(ctx, M, 1224, CW, P.line, 2);

  /* three answers, in poster scale */
  drawEditorialStats(ctx, d, P, M, CW);

  rule(ctx, M, 1506, CW, P.line, 2);

  /* milestones, one material exception */
  drawMilestones(ctx, d, P, M, CW, 1570, 1634, 1678);

  /* footer */
  rule(ctx, M, 1780, CW, P.line, 2);
  text(ctx, '10k · one skill, one page', M, 1842, 28, 300, P.soft, 'left', 0.2);
}

/* ---------- plate: the internal alternative ---------- */
function drawPlate(ctx, d, P){
  const M = 120, CW = 840, C = W / 2;

  micro(ctx, '10,000 HOURS', C, 146, 19, 5.2, P.ink, 'center');
  micro(ctx, d.dateLabel, C, 184, 16, 2.4, P.faint, 'center');
  rule(ctx, M, 224, CW, P.line, 2);

  micro(ctx, 'CURRENT SKILL', C, 320, 17, 3.2, P.faint, 'center');
  const titleSize = fitTitle(ctx, d.name, CW - 40, 108);
  text(ctx, d.name, C, 428, titleSize, 200, P.ink, 'center', -titleSize * 0.04);

  const sub = d.since
    ? `since ${d.since} · target ${fmtTarget(d.target)} h/day`
    : `no sessions yet · target ${fmtTarget(d.target)} h/day`;
  text(ctx, sub, C, 476, 26, 300, P.soft, 'center', -0.3);

  micro(ctx, 'CUMULATIVE HOURS', C, 622, 17, 3.2, P.faint, 'center');
  const total = fmtInt(d.total);
  const numberSize = 226;
  const tw = measure(ctx, total, numberSize, 200, -numberSize * 0.035);
  const uw = measure(ctx, 'h', 40, 300, 0);
  const gap = 16;
  const left = C - (tw + gap + uw) / 2;
  text(ctx, total, left, 822, numberSize, 200, P.ink, 'left', -numberSize * 0.035);
  text(ctx, 'h', left + tw + gap, 822, 40, 300, P.soft);

  const barW = 680, barX = C - barW / 2, barY = 878;
  rr(ctx, barX, barY, barW, 5, 2.5);
  ctx.fillStyle = P.line;
  ctx.fill();
  const pct = Math.min(1, Math.max(0, d.total / d.goal));
  if(pct > 0){
    rr(ctx, barX, barY, Math.max(5, barW * pct), 5, 2.5);
    ctx.fillStyle = P.accent;
    ctx.fill();
  }
  micro(ctx, `OF ${fmtInt(d.goal)} H`, C, 918, 16, 2.6, P.faint, 'center');

  micro(ctx, 'PRACTICE', C, 1012, 17, 3.2, P.faint, 'center');
  drawMonths(ctx, M, 1056, CW, P, 'center');
  drawGraph(ctx, d, P, M, 1078, CW);

  rule(ctx, M, 1252, CW, P.line, 2);

  /* two columns, centred on the plate */
  drawPlateStats(ctx, d, P, M, CW, 1314, 1392, 1428);

  rule(ctx, M, 1516, CW, P.line, 2);
  drawMilestones(ctx, d, P, M, CW, 1580, 1644, 1690);

  rule(ctx, M, 1774, CW, P.line, 2);
  text(ctx, '10k · one skill, one page', C, 1836, 20, 300, P.soft, 'center', 0.2);
}

function fitTitle(ctx, name, max, start){
  let size = start;
  while(size > 60){
    font(ctx, size, 200, -size * 0.04);
    if(ctx.measureText(name).width <= max) break;
    size -= 2;
  }
  return size;
}

function drawGraph(ctx, d, P, x, y, width){
  const gap = 4;
  const cell = (width - gap * 52) / 53;
  for(let i = 0; i < d.days.length; i++){
    const col = Math.floor(i / 7);
    const row = i % 7;
    const level = levelFor(d.days[i].v, d.target);
    ctx.fillStyle = level ? P.levels[level - 1] : P.empty;
    rr(ctx, x + col * (cell + gap), y + row * (cell + gap), cell, cell, Math.min(2.8, cell * 0.21));
    ctx.fill();
  }
  return {cell, gap, height: cell * 7 + gap * 6};
}

function drawMonths(ctx, x, y, width, P, align, size){
  const gap = 4;
  const cell = (width - gap * 52) / 53;
  const step = cell + gap;
  const labelSize = size || 16;
  let lastMonth = -1;
  let lastRight = -Infinity;
  let drewCurrent = false;
  for(let w = 0; w < 53; w++){
    const day = addDays(GRID_START, w * 7);
    if(day.getMonth() === lastMonth) continue;
    lastMonth = day.getMonth();
    const label = MONTHS[lastMonth].toUpperCase();
    const labelWidth = measure(ctx, label, labelSize, 400, 0) + 2.2 * Math.max(0, label.length - 1);
    const lx = x + w * step;
    if(lx + labelWidth > x + width + 1) continue;
    if(lx < lastRight + 14) continue;
    micro(ctx, label, lx, y, labelSize, 2.2, P.faint);
    lastRight = lx + labelWidth;
    if(lastMonth === today.getMonth() && lx > x + width * 0.5) drewCurrent = true;
  }
  /* keep the current month at the right edge when the collision pass skipped it */
  if(!drewCurrent){
    const label = MONTHS[today.getMonth()].toUpperCase();
    const labelWidth = measure(ctx, label, labelSize, 400, 0) + 2.2 * Math.max(0, label.length - 1);
    if(x + width - labelWidth > lastRight + 10){
      micro(ctx, label, x + width, y, labelSize, 2.2, P.faint, 'right');
    }
  }
}

function drawEditorialStats(ctx, d, P, M, CW){
  const x1 = M, x2 = M + CW / 2 + 28;
  const colW = CW / 2 - 28;
  const labelY = 1286, valueY = 1370;

  ctx.strokeStyle = P.line;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(M + CW / 2, 1268);
  ctx.lineTo(M + CW / 2, 1450);
  ctx.stroke();

  micro(ctx, d.nextMs !== null ? 'NEXT MILESTONE' : 'SUMMIT', x1, labelY, 24, 4.2, P.faint);
  micro(ctx, `${fmtInt(d.nextMs !== null ? d.nextMs : d.goal)} H`, x1 + colW, labelY, 20, 2.8, P.soft, 'right');

  const etaText = d.total >= d.goal ? '—' : (d.eta ? fmtMonYr(d.eta) : '—');
  text(ctx, etaText, x1, valueY, 66, 200, P.ink, 'left', -2.4);
  drawEtaRuler(ctx, d, P, x1, 1412, colW);

  micro(ctx, 'PACE', x2, labelY, 24, 4.2, P.faint);
  micro(ctx, '28-DAY MEAN', x2 + colW, labelY, 20, 2.8, P.soft, 'right');
  const pace = d.pace.toFixed(1);
  const paceW = measure(ctx, pace, 66, 200, -2.4);
  text(ctx, pace, x2, valueY, 66, 200, P.ink, 'left', -2.4);
  text(ctx, 'h/day', x2 + paceW + 14, valueY, 26, 300, P.soft);
  drawSpark(ctx, d, P, x2, 1446, colW, 44);
}

function drawPlateStats(ctx, d, P, M, CW, labelY, valueY, evidenceY){
  const colW = CW / 2 - 28;
  const x1 = M, x2 = M + CW / 2 + 28;

  ctx.strokeStyle = P.line;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(M + CW / 2, labelY - 16);
  ctx.lineTo(M + CW / 2, evidenceY + 60);
  ctx.stroke();

  micro(ctx, d.nextMs !== null ? 'NEXT MILESTONE' : 'SUMMIT', x1, labelY, 17, 3.0, P.faint);
  micro(ctx, `${fmtInt(d.nextMs !== null ? d.nextMs : d.goal)} H`, x1 + colW, labelY, 16, 2.2, P.soft, 'right');
  text(ctx, d.total >= d.goal ? '—' : (d.eta ? fmtMonYr(d.eta) : '—'), x1, valueY, 54, 200, P.ink, 'left', -2);
  drawEtaRuler(ctx, d, P, x1, evidenceY + 4, colW);

  micro(ctx, 'PACE', x2, labelY, 17, 3.0, P.faint);
  micro(ctx, '28-DAY MEAN', x2 + colW, labelY, 16, 2.2, P.soft, 'right');
  const pace = d.pace.toFixed(1);
  const paceW = measure(ctx, pace, 54, 200, -2);
  text(ctx, pace, x2, valueY, 54, 200, P.ink, 'left', -2);
  text(ctx, 'h/day', x2 + paceW + 12, valueY, 20, 300, P.soft);
  drawSpark(ctx, d, P, x2, evidenceY + 42, colW, 42);
}

function drawEtaRuler(ctx, d, P, x, y, width){
  for(let i = 0; i < 10; i++){
    ctx.strokeStyle = P.line;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + (width * i) / 9, y - 11);
    ctx.lineTo(x + (width * i) / 9, y + 11);
    ctx.stroke();
  }
  if(!d.eta) return;

  const years = d.etaDays / 365.25;
  const off = years > 10;
  const px = x + width * Math.min(1, years / 10);
  disc(ctx, px, y, 13);
  ctx.fillStyle = P.bg;
  ctx.fill();
  disc(ctx, px, y, 9);
  ctx.fillStyle = off ? P.bg : P.accent;
  ctx.fill();
  if(off){
    ctx.strokeStyle = P.inkA(0.28);
    ctx.lineWidth = 2;
    ctx.stroke();
  }
}

function drawSpark(ctx, d, P, x, bottom, width, height){
  const days = d.days.slice(-14);
  const max = Math.max(d.target, 0.5, ...days.map(x => x.v));
  const gap = 7;
  const barW = (width - gap * 13) / 14;

  for(let i = 0; i < days.length; i++){
    const v = days[i].v;
    const h = v > 0 ? Math.max(3, (v / max) * height) : 2.5;
    rr(ctx, x + i * (barW + gap), bottom - h, barW, h, 3);
    ctx.fillStyle = v > 0 ? P.accentSoft : P.inkA(0.09);
    ctx.fill();
  }

  const targetY = bottom - Math.min(1, d.target / max) * height;
  ctx.save();
  ctx.setLineDash([5, 6]);
  ctx.strokeStyle = P.inkA(0.18);
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x, targetY);
  ctx.lineTo(x + width, targetY);
  ctx.stroke();
  ctx.restore();
}

function drawMilestones(ctx, d, P, x, width, labelY, trackY, footY){
  micro(ctx, 'MILESTONES', x, labelY, 24, 4.2, P.faint);
  micro(ctx, `${d.achieved} / ${d.milestones.length}`, x + width, labelY, 24, 4.2, P.faint, 'right');

  const radius = 13.5;
  const first = x + radius + 3;
  const last = x + width - radius - 3;
  const step = (last - first) / (d.milestones.length - 1);

  rule(ctx, first, trackY, last - first, P.line, 2);

  d.milestones.forEach((threshold, i) => {
    const cx = first + step * i;
    const achieved = d.total >= threshold;
    const next = i === d.nextIndex;

    disc(ctx, cx, trackY, radius + 5);
    ctx.fillStyle = P.bg;
    ctx.fill();

    if(achieved){
      drawMedal(ctx, cx, trackY, radius, P, i === d.milestones.length - 1);
    } else if(next){
      disc(ctx, cx, trackY, radius - 1);
      ctx.fillStyle = P.bg;
      ctx.fill();
      ctx.strokeStyle = P.inkA(0.16);
      ctx.lineWidth = 1.5;
      ctx.stroke();

      const prev = i === 0 ? 0 : d.milestones[i - 1];
      const frac = Math.max(0, Math.min(1, (d.total - prev) / (threshold - prev)));
      if(frac > 0){
        ctx.strokeStyle = P.accent;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.arc(cx, trackY, radius - 1, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * frac);
        ctx.stroke();
        ctx.lineCap = 'butt';
      }
    } else {
      disc(ctx, cx, trackY, radius - 1);
      ctx.fillStyle = P.bg;
      ctx.fill();
      ctx.strokeStyle = P.inkA(0.13);
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  });

  micro(ctx, '1', x, footY, 20, 2.0, P.faint);
  micro(ctx, fmtInt(d.goal), x + width, footY, 20, 2.0, P.faint, 'right');
}

function drawMedal(ctx, x, y, r, P, summit){
  const g = ctx.createLinearGradient(x - r * 0.85, y - r, x + r * 0.8, y + r);
  g.addColorStop(0, '#fff8e2');
  g.addColorStop(0.36, '#f1d68f');
  g.addColorStop(0.7, '#d2a64c');
  g.addColorStop(1, '#b78b34');

  disc(ctx, x, y, r - 1);
  ctx.fillStyle = g;
  ctx.fill();
  ctx.strokeStyle = P.goldRing;
  ctx.lineWidth = 1.4;
  ctx.stroke();

  if(summit){
    disc(ctx, x, y, r + 2.5);
    ctx.strokeStyle = alpha(P.goldRing, 0.55);
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }

  disc(ctx, x, y, r - 4.5);
  ctx.strokeStyle = 'rgba(255,255,255,.42)';
  ctx.lineWidth = 1;
  ctx.stroke();

  ctx.strokeStyle = 'rgba(255,255,255,.72)';
  ctx.lineWidth = 1.6;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(x, y, r - 2.8, -2.55, -2.05);
  ctx.stroke();
  ctx.lineCap = 'butt';
}

/* ============================================================
   HOLD GESTURE
   ============================================================ */
function decorate(h1){
  if(!h1 || h1.dataset.shareReady === '1') return;
  h1.dataset.shareReady = '1';
  const name = (h1.textContent || '').trim();
  h1.tabIndex = 0;
  h1.setAttribute('aria-label', `${name}. Hold to share a card, or press Shift and Enter.`);
  h1.setAttribute('aria-keyshortcuts', 'Shift+Enter');
  h1.title = 'Hold to share a card · Shift + Enter';
}
function decorateAll(){
  document.querySelectorAll('.head h1').forEach(decorate);
}

function beginHold(e, h1){
  if(hold || busy) return;
  if(e.pointerType === 'mouse' && e.button !== 0) return;
  if(e.isPrimary === false) return;

  const p = {
    h1,
    x: e.clientX,
    y: e.clientY,
    pointerId: e.pointerId,
    timer: 0,
    raf: 0,
  };
  hold = p;

  h1.classList.add('share-holding');
  h1.style.setProperty('--share-w', '0%');
  try{ h1.setPointerCapture(e.pointerId); }catch(err){}

  const t0 = performance.now();
  const tick = now => {
    if(hold !== p) return;
    const f = Math.min(1, (now - t0) / HOLD_MS);
    h1.style.setProperty('--share-w', (f * 100).toFixed(2) + '%');
    if(f < 1) p.raf = requestAnimationFrame(tick);
  };
  p.raf = requestAnimationFrame(tick);

  p.timer = setTimeout(() => {
    if(hold !== p) return;
    hold = null;
    lastFire = performance.now();
    h1.style.setProperty('--share-w', '100%');
    h1.classList.remove('share-holding');
    h1.classList.add('share-working');
    try{ h1.releasePointerCapture(p.pointerId); }catch(err){}
    runShare(h1);
  }, HOLD_MS);
}

function cancelHold(){
  if(!hold) return;
  const p = hold;
  hold = null;
  clearTimeout(p.timer);
  cancelAnimationFrame(p.raf);
  try{ p.h1.releasePointerCapture(p.pointerId); }catch(err){}
  p.h1.classList.remove('share-holding');
  p.h1.style.setProperty('--share-w', '0%');
}

document.addEventListener('pointerdown', e => {
  const h1 = e.target && e.target.closest && e.target.closest('.head h1');
  if(!h1) return;
  decorate(h1);
  beginHold(e, h1);
}, {passive:true});

document.addEventListener('pointermove', e => {
  if(!hold || e.pointerId !== hold.pointerId) return;
  if(Math.hypot(e.clientX - hold.x, e.clientY - hold.y) > MOVE_CANCEL) cancelHold();
}, {passive:true});

document.addEventListener('pointerup', e => {
  if(hold && e.pointerId === hold.pointerId) cancelHold();
});
document.addEventListener('pointercancel', e => {
  if(hold && e.pointerId === hold.pointerId) cancelHold();
});
window.addEventListener('scroll', () => cancelHold(), {passive:true});
window.addEventListener('blur', () => cancelHold());
document.addEventListener('visibilitychange', () => { if(document.hidden) cancelHold(); });

document.addEventListener('contextmenu', e => {
  const h1 = e.target && e.target.closest && e.target.closest('.head h1');
  if(!h1) return;
  if(hold || performance.now() - lastFire < 700) e.preventDefault();
});
document.addEventListener('selectstart', e => {
  const h1 = e.target && e.target.closest && e.target.closest('.head h1');
  if(h1) e.preventDefault();
});

/* keyboard: focus the title, Shift+Enter */
document.addEventListener('keydown', e => {
  const h1 = e.target && e.target.closest && e.target.closest('.head h1');
  if(!h1) return;
  if(e.key !== 'Enter' || !e.shiftKey || e.metaKey || e.ctrlKey || e.altKey) return;
  e.preventDefault();
  e.stopPropagation();
  if(busy) return;
  lastFire = performance.now();
  h1.classList.add('share-working');
  h1.style.setProperty('--share-w', '100%');
  runShare(h1);
}, true);

/* header is rebuilt on every skill switch */
const app = document.getElementById('app');
if(app){
  new MutationObserver(() => {
    if(hold && !hold.h1.isConnected) cancelHold();
    decorateAll();
  }).observe(app, {childList:true});
}
decorateAll();

/* ============================================================
   COMPOSE + DOWNLOAD
   ============================================================ */
function waitForFonts(){
  if(!document.fonts || !document.fonts.ready) return Promise.resolve();
  return document.fonts.ready.catch(() => {});
}

function toBlob(canvas){
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if(blob) resolve(blob);
      else reject(new Error('Canvas could not be encoded.'));
    }, 'image/png');
  });
}

function say(message){
  if(typeof announce === 'function'){
    try{ announce(message); return; }catch(err){}
  }
  let el = document.getElementById('share-live');
  if(!el){
    el = document.createElement('div');
    el.id = 'share-live';
    el.className = 'sr-only';
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', 'polite');
    document.body.appendChild(el);
  }
  el.textContent = '';
  setTimeout(() => { el.textContent = message; }, 40);
}

function toast(message){
  if(typeof showToast === 'function') showToast(message);
}

async function runShare(h1){
  if(busy) return;
  busy = true;

  const spec = currentSpec();
  const name = spec.name;
  const filename = `10k-${slugify(name)}-${keyOf(today)}.png`;

  try{
    await waitForFonts();
    const canvas = renderCard(spec, DEFAULT_LAYOUT);
    const blob = await toBlob(canvas);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.rel = 'noopener';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);

    toast(`Share card saved · ${name}`);
    say(`Share card saved for ${name}. 1080 by 1920 pixels.`);
  }catch(err){
    console.error('[10k] share card failed', err);
    toast('Could not save the card');
    say('The share card could not be created.');
  }finally{
    busy = false;
    setTimeout(() => {
      if(!h1 || !h1.isConnected) return;
      h1.classList.remove('share-working');
      /* a new hold may own the meter by now; never reset it underneath the finger */
      if(!h1.classList.contains('share-holding')) h1.style.setProperty('--share-w', '0%');
    }, 520);
  }
}

/* ============================================================
   DEBUG + PROGRAMMATIC HOOK
   `?shareDebug=1` paints the card at 100% instead of the console;
   `?shareLayout=plate` compares the centred composition.
   ============================================================ */
async function buildAsync(layout){
  await waitForFonts();
  return renderCard(currentSpec(), layout || DEFAULT_LAYOUT);
}

window.__10kShare = {
  build: () => renderCard(currentSpec(), DEFAULT_LAYOUT),
  buildAsync,
  download: () => runShare(document.querySelector('.head h1')),
  layout: DEFAULT_LAYOUT,
  get canvas(){ return lastCanvas; },
};

const params = new URLSearchParams(location.search);
if(params.get('shareDebug')){
  const layout = params.get('shareLayout') === 'plate' ? 'plate' : DEFAULT_LAYOUT;
  buildAsync(layout).then(canvas => {
    document.documentElement.style.background = '#8a8a8a';
    document.body.style.margin = '0';
    document.body.style.background = '#8a8a8a';
    document.body.replaceChildren(canvas);
    canvas.style.cssText = 'display:block;width:1080px;height:1920px';
    window.__shareDebugCanvas = canvas;
  }).catch(err => console.error('[10k] share debug failed', err));
}
})();
