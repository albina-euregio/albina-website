/* enable JavaScript error tracking */
// https://unpkg.com/browse/@sentry/types@5.7.1/dist/options.d.ts
import * as Sentry from "@sentry/browser";
if (!APP_DEV_MODE) {
  Sentry.init({
    release: "albina-website@" + APP_VERSION,
    environment: APP_ENVIRONMENT,
    // ignore axios errors via axios/lib/core/createError
    ignoreErrors: [/Network Error/, /Request aborted/],
    dsn: "https://513851e41d6e455998f0cc1a91828942@sentry.io/1819947"
  });
}
