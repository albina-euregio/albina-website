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

/**
 * Runs an HTTP HEAD request on the given URL and returns the response object if and only if the request was successful.
 */
export async function fetchExists(
  request: RequestInfo | URL,
  init: RequestInit = {}
): Promise<Response | false> {
  try {
    const res = await fetch(request, { ...init, method: "HEAD" });
    if (res.ok) {
      return res;
    }
    return false;
  } catch (e) {
    return false;
  }
}
