const MAX_REPORTS = 10;
let reports = 0;

/**
 * Reports uncaught errors to a Sentry-compatible endpoint (e.g. GitLab error tracking).
 */
export function initErrorTracking(dsn: string | undefined) {
  if (!dsn) return;
  const { protocol, host, pathname, username: key } = new URL(dsn);
  const projectId = pathname.split("/").pop();
  const base = pathname.slice(0, pathname.lastIndexOf("/"));
  const url = `${protocol}//${host}${base}/api/${projectId}/store/`;

  const send = (error: unknown) => {
    if (++reports > MAX_REPORTS) return;
    const e = error instanceof Error ? error : new Error(String(error));
    fetch(url, {
      method: "POST",
      keepalive: true,
      headers: {
        "Content-Type": "application/json",
        "X-Sentry-Auth": `Sentry sentry_version=7, sentry_key=${key}, sentry_client=albina-website/1.0`
      },
      body: JSON.stringify({
        event_id: crypto.randomUUID().replace(/-/g, ""),
        timestamp: new Date().toISOString(),
        platform: "javascript",
        level: "error",
        release: import.meta.env.APP_VERSION,
        environment: import.meta.env.APP_REGION || "production",
        request: {
          url: location.href,
          headers: { "User-Agent": navigator.userAgent }
        },
        exception: {
          values: [
            {
              type: e.name,
              value: e.message,
              stacktrace: { frames: parseStack(e.stack) }
            }
          ]
        }
      })
    }).catch(() => {});
  };

  addEventListener("error", ev => {
    // ignore cross-origin "Script error." and browser extensions
    if (ev.filename && !ev.filename.startsWith(location.origin)) return;
    send(ev.error ?? ev.message);
  });
  addEventListener("unhandledrejection", ev => send(ev.reason));
}

// Chrome: "    at fn (url:1:2)", Firefox/Safari: "fn@url:1:2"
function parseStack(stack = "") {
  return stack
    .split("\n")
    .map(l =>
      l.match(/^\s*(?:at )?(?:(.*?) ?\(|(.*?)@)?(\S+?):(\d+):(\d+)\)?$/)
    )
    .filter(m => m !== null)
    .map(([, fnA, fnB, filename, lineno, colno]) => ({
      function: fnA || fnB || "?",
      filename,
      lineno: +lineno,
      colno: +colno,
      in_app: filename.startsWith(location.origin)
    }))
    .reverse(); // Sentry expects the innermost frame last
}
