import "unfetch";

/**
 * @param {RequestInfo} request
 * @param {RequestInit} init
 * @returns {Promise<any>}
 */
export async function fetchJSON(request, init) {
  const res = await fetch(request, init);
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}

/**
 * @param {RequestInfo} request
 * @param {RequestInit} init
 * @returns {Promise<string>}
 */
export async function fetchText(request, init) {
  const res = await fetch(request, init);
  if (!res.ok) throw new Error(res.statusText);
  return res.text();
}
