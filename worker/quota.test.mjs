import assert from 'node:assert/strict';
import test from 'node:test';
import { DatabaseSync } from 'node:sqlite';
import { initializeQuota, takePermit } from './quota/policy.mjs';

function database(t) {
  const db = new DatabaseSync(':memory:');
  t.after(() => db.close());
  const sql = { exec(query, ...values) {
    const rows = db.prepare(query).all(...values);
    return { toArray: () => rows };
  } };
  initializeQuota(sql);
  return sql;
}

test('quota grants four permits per rolling second and rejects additional requests', (t) => {
  const sql = database(t);
  for (let i = 0; i < 4; i++) assert.equal(takePermit(sql, 900), true);
  assert.equal(takePermit(sql, 900), false);
  assert.equal(takePermit(sql, 1000), false, 'a calendar-second boundary must not reset the budget');
  assert.equal(takePermit(sql, 1899), false);
  assert.equal(takePermit(sql, 1900), true);
});

test('quota initialization after a restart preserves unexpired permits', (t) => {
  const sql = database(t);
  for (let i = 0; i < 4; i++) takePermit(sql, 2500);
  initializeQuota(sql);
  assert.equal(takePermit(sql, 2501), false);
  assert.equal(takePermit(sql, 3500), true);
});

test('quota expiry is per permit and storage remains bounded', (t) => {
  const sql = database(t);
  for (const time of [0, 100, 200, 300]) assert.equal(takePermit(sql, time), true);
  assert.equal(takePermit(sql, 1000), true);
  assert.equal(takePermit(sql, 1000), false);
  assert.equal(takePermit(sql, 1100), true);
  assert.equal(sql.exec('SELECT requested_at FROM permits').toArray().length, 4);
  assert.equal(takePermit(sql, 10000), true);
  assert.equal(sql.exec('SELECT requested_at FROM permits').toArray().length, 1);
});

test('a clock rollback does not free stored permits', (t) => {
  const sql = database(t);
  for (let i = 0; i < 4; i++) takePermit(sql, 2000);
  assert.equal(takePermit(sql, 1900), false);
});
