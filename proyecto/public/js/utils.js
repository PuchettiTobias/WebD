export async function fetchJSON(url, opts = {}) {
  const res = await fetch(url, { headers: { 'Content-Type': 'application/json' }, ...opts });
  if (!res.ok) throw new Error((await res.json().catch(() => ({}))).message || 'Error');
  return res.json();
}
export function qs(sel) { return document.querySelector(sel); }
export function qsa(sel) { return Array.from(document.querySelectorAll(sel)); }
