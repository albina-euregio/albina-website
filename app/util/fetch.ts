export async function fetchJSON<T>(
  request: RequestInfo | URL,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(request, init);
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}

export async function fetchText(
  request: RequestInfo | URL,
  init?: RequestInit
): Promise<string> {
  const res = await fetch(request, init);
  if (!res.ok) throw new Error(res.statusText);
  return res.text();
}
