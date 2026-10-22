/* Node tests for the persistence contract — run: node store.test.js */
'use strict';
const assert = require('node:assert/strict');
const Store = require('./store.js');

const base = (over) => Object.assign({
  name: 'Guitar',
  hue: 45,
  target: 3,
  icon: 'guitar',
  goal: 10000,
  micro: false,
  createdAt: '2026-01-02',
  log: {'2026-01-03': 1.5, '2026-01-04': 0},
}, over || {});

/* 1. exact round trip: goal and micro survive */
{
  const habits = [base(), base({name: 'Spanish', goal: 1000, micro: true})];
  const json = JSON.stringify(Store.serialize(habits, 1));
  const parsed = Store.parse(json);
  assert.equal(parsed.ok, true);
  assert.equal(parsed.data.hi, 1);
  assert.equal(parsed.data.habits[1].goal, 1000);
  assert.equal(parsed.data.habits[1].micro, true);
  assert.equal(parsed.data.habits[0].goal, 10000);
  assert.equal(parsed.data.habits[0].micro, false);
}

/* 2. old objects without a goal migrate to 10,000 */
{
  const legacy = {name: 'Piano', hue: 268, target: 3, icon: 'piano', log: {}};
  const parsed = Store.parse(JSON.stringify({version: 1, hi: 0, habits: [legacy]}));
  assert.equal(parsed.ok, true);
  assert.equal(parsed.data.habits[0].goal, 10000);
  assert.equal(parsed.data.habits[0].micro, false);
  assert.match(parsed.data.habits[0].createdAt, /^\d{4}-\d{2}-\d{2}$/);
}

/* 3. a micro flag with no goal becomes 1,000 */
{
  const parsed = Store.parse(JSON.stringify({version: 1, hi: 0, habits: [base({goal: undefined, micro: true})]}));
  assert.equal(parsed.data.habits[0].goal, 1000);
  assert.equal(parsed.data.habits[0].micro, true);
}

/* 4. corrupt payloads are rejected, never thrown */
{
  assert.equal(Store.parse('{nope').ok, false);
  assert.equal(Store.parse('{"version":2,"habits":[]}').ok, false);
  assert.equal(Store.parse('{"version":1,"habits":[]}').ok, false);
  assert.equal(Store.parse('{"version":1,"habits":[{"name":""}]}').ok, false);
}

/* 5. logs keep minute precision, drop zero/negative/bad keys, clamp a day to 24 */
{
  const parsed = Store.parse(JSON.stringify({version: 1, hi: 0, habits: [base({
    log: {'2026-01-03': 1.234, '2026-01-04': 0, '2026-01-05': -2, '2026-01-06': 30, bad: 2},
  })]}));
  const log = parsed.data.habits[0].log;
  assert.equal(log['2026-01-03'], 74 / 60);
  assert.equal('2026-01-04' in log, false);
  assert.equal('2026-01-05' in log, false);
  assert.equal(log['2026-01-06'], 24);
  assert.equal('bad' in log, false);
}

/* 6. hi is clamped to a real skill */
{
  const habits = [base(), base({name: 'Drawing'})];
  assert.equal(Store.serialize(habits, 9).hi, 1);
  assert.equal(Store.serialize(habits, -4).hi, 0);
  assert.equal(Store.serialize(habits, 1.5).hi, 0);
}

/* 7. save/load round trip through the real key */
{
  const mem = new Map();
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: {
      getItem: k => (mem.has(k) ? mem.get(k) : null),
      setItem: (k, v) => { mem.set(k, String(v)); },
      removeItem: k => { mem.delete(k); },
    },
  });
  const habits = [base(), base({name: 'Guitar', goal: 1000, micro: true})];
  assert.equal(Store.save(habits, 1), true);
  assert.ok(mem.has('tenk.v1'));
  const loaded = Store.load();
  assert.equal(loaded.status, 'ok');
  assert.equal(loaded.data.hi, 1);
  assert.equal(loaded.data.habits[1].goal, 1000);
  assert.equal(loaded.data.habits[1].micro, true);
}

/* 8. a corrupt payload is backed up, not destroyed */
{
  const mem = new Map([['tenk.v1', '{broken']]);
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    value: {
      getItem: k => (mem.has(k) ? mem.get(k) : null),
      setItem: (k, v) => { mem.set(k, String(v)); },
      removeItem: k => { mem.delete(k); },
    },
  });
  const loaded = Store.load();
  assert.equal(loaded.status, 'invalid');
  assert.equal(mem.get('tenk.v1.backup'), '{broken');
}

/* 9. storage that throws is reported, never propagated */
{
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    get: () => { throw new Error('blocked'); },
  });
  assert.equal(Store.load().status, 'unavailable');
  assert.equal(Store.save([base()], 0), false);
}

console.log('store.test.js — 9 groups passed');
