import assert from 'node:assert/strict';
import test from 'node:test';
import { PRIVACY_POLICY } from './privacy.ts';

test('privacy policy is versioned and includes required sections', () => {
  assert.match(PRIVACY_POLICY.version, /^\d{4}-\d{2}-\d{2}$/);
  assert.ok(PRIVACY_POLICY.dataCollection.length > 0);
  assert.ok(PRIVACY_POLICY.localStorageUsage.length > 0);
  assert.ok(PRIVACY_POLICY.externalServices.length > 0);
  assert.ok(PRIVACY_POLICY.updatesAndContact.length > 0);
});
