/* ============================================================
   10,000 Hours — local-first persistence (design.md §23)
   One small, dependency-free module. It owns the storage key,
   the versioned envelope, and every defensive read. It never
   touches the DOM, so the same serialize/parse pair can be
   exercised in Node (store.test.js).
   ============================================================ */
(function(root, factory){
  'use strict';
  const api = factory(root);
  if(typeof module === 'object' && module.exports){ module.exports = api; }
  else { root.TenkStore = api; }
})(typeof globalThis !== 'undefined' ? globalThis : this, function(root){
  'use strict';

  const KEY = 'tenk.v1';
  const BACKUP_KEY = 'tenk.v1.backup';
  const VERSION = 1;
  const FULL_GOAL = 10000;
  const MICRO_GOAL = 1000;
  const DAY_RE = /^\d{4}-\d{2}-\d{2}$/;
  const MIN_TARGET = 0.25;
  const MAX_TARGET = 12;

  const pad2 = n => String(n).padStart(2, '0');
  function todayKey(){
    const d = new Date();
    return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
  }

  /* localStorage can be absent, disabled, or throw on a file:// origin.
     The read and write below each carry their own guard, so a quota or
     security failure never reaches the UI. */
  function getStorage(){
    try {
      const s = root.localStorage;
      return s || null;
    } catch(_) {
      return null;
    }
  }

  function cleanLog(log){
    const out = {};
    if(!log || typeof log !== 'object') return out;
    for(const k of Object.keys(log)){
      if(!DAY_RE.test(k)) continue;
      const v = Number(log[k]);
      if(!isFinite(v) || v <= 0) continue;           /* a day is absent, never 0 */
      out[k] = Math.min(24, Math.round(v * 60) / 60);
    }
    return out;
  }

  /* One habit in, one valid habit out. Old objects without a goal
     migrate to 10,000; a micro flag without a goal becomes 1,000. */
  function cleanHabit(h){
    if(!h || typeof h !== 'object') return null;
    const name = typeof h.name === 'string'
      ? h.name.trim().replace(/\s+/g, ' ').slice(0, 40)
      : '';
    if(!name) return null;

    const micro = h.micro === true;
    const goal = isFinite(Number(h.goal)) && Number(h.goal) > 0
      ? Number(h.goal)
      : (micro ? MICRO_GOAL : FULL_GOAL);
    const hue = isFinite(Number(h.hue))
      ? Math.min(360, Math.max(0, Number(h.hue)))
      : 45;
    const target = isFinite(Number(h.target))
      ? Math.min(MAX_TARGET, Math.max(MIN_TARGET, Number(h.target)))
      : 3;
    const icon = typeof h.icon === 'string' && h.icon ? h.icon : 'book';
    const unit = h.unit === 'day' ? 'day' : 'week';
    const createdAt = typeof h.createdAt === 'string' && DAY_RE.test(h.createdAt)
      ? h.createdAt
      : todayKey();

    return {name, hue, target, unit, icon, goal, micro, createdAt, log: cleanLog(h.log)};
  }

  function serialize(habits, hi){
    const list = Array.isArray(habits)
      ? habits.map(cleanHabit).filter(Boolean)
      : [];
    const n = list.length;
    const safeHi = n ? Math.min(n - 1, Math.max(0, Number.isInteger(hi) ? hi : 0)) : 0;
    return {version: VERSION, hi: safeHi, habits: list};
  }

  function parse(raw){
    if(typeof raw !== 'string' || !raw) return {ok: false, reason: 'empty'};
    let data;
    try { data = JSON.parse(raw); }
    catch(_) { return {ok: false, reason: 'json'}; }
    if(!data || data.version !== VERSION) return {ok: false, reason: 'version'};
    if(!Array.isArray(data.habits) || !data.habits.length) return {ok: false, reason: 'habits'};

    const habits = data.habits.map(cleanHabit).filter(Boolean);
    if(!habits.length) return {ok: false, reason: 'habits'};

    let hi = Number.isInteger(data.hi) ? data.hi : 0;
    hi = Math.min(habits.length - 1, Math.max(0, hi));
    return {ok: true, data: {version: VERSION, hi, habits}};
  }

  function save(habits, hi){
    const s = getStorage();
    if(!s) return false;
    try {
      s.setItem(KEY, JSON.stringify(serialize(habits, hi)));
      return true;
    } catch(_) {
      return false;
    }
  }

  function load(){
    const s = getStorage();
    if(!s) return {status: 'unavailable'};
    let raw;
    try { raw = s.getItem(KEY); }
    catch(_) { return {status: 'unavailable'}; }
    if(raw === null || raw === '') return {status: 'empty'};

    const res = parse(raw);
    if(res.ok) return {status: 'ok', data: res.data};

    /* keep the unreadable payload rather than destroy it */
    try { s.setItem(BACKUP_KEY, raw); } catch(_) { }
    return {status: 'invalid', reason: res.reason};
  }

  return {
    KEY, BACKUP_KEY, VERSION, FULL_GOAL, MICRO_GOAL,
    todayKey, cleanLog, cleanHabit, serialize, parse, save, load
  };
});
