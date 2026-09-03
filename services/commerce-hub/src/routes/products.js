const allowed = new Set(['GET', 'POST', 'PATCH', 'DELETE']);

export async function productRoutes(req) {
  const match = new URL(req.url, 'http://localhost').pathname.match(/^\/api\/v1\/products(?:\/([^/]+))?$/);
  if (!match || !allowed.has(req.method)) return null;

  const id = match[1] ?? null;
  if (req.method === 'GET') return { status: 200, body: { data: id ? { id } : [] } };
  if (req.method === 'POST') return { status: 201, body: { data: { accepted: true } } };
  if (req.method === 'PATCH' && id) return { status: 200, body: { data: { id, updated: true } } };
  if (req.method === 'DELETE' && id) return { status: 204, body: null };
  return { status: 405, body: { error: 'method_not_allowed' } };
}
