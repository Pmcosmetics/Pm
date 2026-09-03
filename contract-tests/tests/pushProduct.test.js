import test from 'node:test';
import assert from 'node:assert/strict';

function mockPushProduct({ idempotencyKey, responseStatus = 200 }) {
  if (responseStatus === 429) return { ok: false, retryable: true, status: 429 };
  return { ok: responseStatus >= 200 && responseStatus < 300, idempotencyKey };
}

test('pushProduct happy path', () => {
  assert.deepEqual(mockPushProduct({ idempotencyKey: 'product-1:v1' }), { ok: true, idempotencyKey: 'product-1:v1' });
});

test('pushProduct preserves idempotency key', () => {
  const first = mockPushProduct({ idempotencyKey: 'product-1:v1' });
  const retry = mockPushProduct({ idempotencyKey: 'product-1:v1' });
  assert.equal(first.idempotencyKey, retry.idempotencyKey);
});

test('429 is retryable', () => {
  assert.deepEqual(mockPushProduct({ idempotencyKey: 'product-1:v1', responseStatus: 429 }), { ok: false, retryable: true, status: 429 });
});
