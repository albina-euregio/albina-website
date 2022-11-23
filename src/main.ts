import { enableProdMode } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

import { AppModule } from "./app/app.module";
import { environment } from "./environments/environment";

import pkg from "../package.json";
import * as Sentry from "@sentry/angular";
import { Integrations } from "@sentry/tracing";

if (environment.production) {
  enableProdMode();
  enableSentry();
}

platformBrowserDynamic().bootstrapModule(AppModule);

function enableSentry() {
  Sentry.init({
    release: [pkg.name, pkg.version].join("@"),
    dsn: "https://glet_31733ac62aeee70b77494f532cb4f898@observe.gitlab.com/errortracking/api/v1/projects/2700759",
    integrations: [
      new Integrations.BrowserTracing({
        routingInstrumentation: Sentry.routingInstrumentation,
      }),
    ],
    tracesSampleRate: 1.0,
  });
}
