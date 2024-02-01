/* enable JavaScript error tracking */
// https://unpkg.com/browse/@sentry/types@5.7.1/dist/options.d.ts
import * as Sentry from "@sentry/react";
if (import.meta.env.PROD) {
  Sentry.init({
    beforeSend(event) {
      const exception = event.exception?.values?.[0];
      if (
        exception?.value?.includes("reading '_leaflet_pos'") ||
        exception?.stacktrace?.frames?.some(
          f => f.function?.includes("_onZoomTransitionEnd")
        )
      ) {
        return null;
      }
    },
    release: "albina-website@" + import.meta.env.APP_VERSION,
    environment: import.meta.env.MODE,
    dsn: "https://513851e41d6e455998f0cc1a91828942@sentry.io/1819947"
  });
}
