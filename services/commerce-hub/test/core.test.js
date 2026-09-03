import test from 'node:test';
import assert from 'node:assert/strict';
import { calculatePrice } from '../src/pricing/engine.js';
import { createAuditEvent } from '../src/audit/logger.js';

test('pricing applies bounds', () => {
  assert.equal(calculatePrice({ basePrice: 100, adjustment: 25, maxPrice: 110 }), 110);
});

test('audit event captures actor and changes', () => {
  const event = createAuditEvent({ actorId: 'actor-1', action: 'update', entityType: 'sku', entityId: 'sku-1', changes: { active: false } });
  assert.equal(event.actorId, 'actor-1');
  assert.deepEqual(event.changes, { active: false });
});
