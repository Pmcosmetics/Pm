const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

const base = url.replace(/\/$/, '');
const headers = {
  apikey: key,
  Authorization: `Bearer ${key}`,
  'Content-Type': 'application/json',
};
const testOrderId = `SMOKE-${Date.now()}`;

async function request(path, options = {}) {
  const response = await fetch(`${base}${path}`, {
    ...options,
    headers: { ...headers, ...(options.headers || {}) },
  });
  const text = await response.text();
  let body = text;
  try { body = text ? JSON.parse(text) : null; } catch {}
  return { response, body };
}

let failed = false;
try {
  const insert = await request('/rest/v1/orders', {
    method: 'POST',
    headers: { Prefer: 'return=representation' },
    body: JSON.stringify([{ order_id: testOrderId, status: 'pending', source: 'smoke-test' }]),
  });
  if (!insert.response.ok) throw new Error(`insert failed (${insert.response.status})`);
  console.log('Insert: OK');

  const read = await request(`/rest/v1/orders?select=order_id,status&order_id=eq.${encodeURIComponent(testOrderId)}`);
  if (!read.response.ok) throw new Error(`read failed (${read.response.status})`);
  if (!Array.isArray(read.body) || read.body.length !== 1 || read.body[0].status !== 'pending') {
    throw new Error('read verification failed');
  }
  console.log('Read verification: OK');

  console.log('SMOKE TEST: OK');
} catch (error) {
  failed = true;
  console.error('SMOKE TEST: FAILED', error?.message || error);
} finally {
  try {
    const cleanup = await request(`/rest/v1/orders?order_id=eq.${encodeURIComponent(testOrderId)}`, {
      method: 'DELETE',
      headers: { Prefer: 'return=minimal' },
    });
    if (!cleanup.response.ok) {
      console.error(`Cleanup failed (${cleanup.response.status})`);
      failed = true;
    } else {
      console.log('Cleanup: OK');
    }
  } catch (error) {
    console.error('Cleanup failed:', error?.message || error);
    failed = true;
  }
}

process.exit(failed ? 2 : 0);
