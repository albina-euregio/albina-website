import { enableProdMode } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

import { AppModule } from "./app/app.module";
import { environment } from "./environments/environment";

import pkg from "../package.json";
import * as Sentry from "@sentry/angular";
import { Integrations } from "@sentry/tracing";

if (environment.production) {
  enableProdMode();

  Sentry.init({
    release: [pkg.name, pkg.version].join("@"),
    dsn: "https://f01d3588732c4ed195093468989a45f2@sentry.io/1828063",
    integrations: [
      new Integrations.BrowserTracing({
        routingInstrumentation: Sentry.routingInstrumentation,
      }),
    ],
    tracesSampleRate: 1.0,
  });
}

platformBrowserDynamic().bootstrapModule(AppModule);
