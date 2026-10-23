// Four upstream request permits in any rolling second, shared by all versions.
// Synchronous SQLite operations cannot interleave with another DO request.
export function initializeQuota(sql) {
  sql.exec('CREATE TABLE IF NOT EXISTS permits (requested_at INTEGER NOT NULL)');
}

export function takePermit(sql, now = Date.now()) {
  sql.exec('DELETE FROM permits WHERE requested_at <= ?', now - 1000);
  const rows = sql.exec('SELECT requested_at FROM permits').toArray();
  if (rows.length >= 4) return false;
  sql.exec('INSERT INTO permits (requested_at) VALUES (?)', now);
  return true;
}
