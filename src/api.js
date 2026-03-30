/**
 * Novy API client
 * All frontend-to-backend calls go through here
 */
const BASE = 'http://localhost:3001/api';

const token = () => localStorage.getItem('novy_token');

const headers = (extra = {}) => ({
  'Content-Type': 'application/json',
  ...(token() ? { Authorization: `Bearer ${token()}` } : {}),
  ...extra,
});

async function request(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: headers(),
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.error || `HTTP ${res.status}`);
  return data;
}

// ── Auth ──────────────────────────────────────────────────
export const apiLogin          = (body) => request('POST',  '/auth/login',    body);
export const apiRegister       = (body) => request('POST',  '/auth/register', body);
export const apiMe             = ()     => request('GET',   '/auth/me');
export const apiUpdateProfile  = (body) => request('PATCH', '/auth/profile',  body);

// ── Posts ─────────────────────────────────────────────────
export const apiFeed       = (p = 0) => request('GET', `/posts?limit=20&offset=${p}`);
export const apiCreatePost = (body)   => request('POST', '/posts', body);
export const apiLikePost   = (id)     => request('POST', `/posts/${id}/like`);
export const apiDeletePost = (id)     => request('DELETE', `/posts/${id}`);

// ── Messages ──────────────────────────────────────────────
export const apiConvList = ()           => request('GET', '/messages');
export const apiConv     = (userId)     => request('GET', `/messages/${userId}`);
export const apiSendMsg  = (userId, content) => request('POST', `/messages/${userId}`, { content });

// ── News ──────────────────────────────────────────────────
export const apiNews = () => request('GET', '/news');

// ── AI ────────────────────────────────────────────────────
export const apiChat    = (message, history) => request('POST', '/ai/chat',    { message, history });
export const apiSummary = (profile)          => request('POST', '/ai/summary', profile);
