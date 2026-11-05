import { template } from "./template";
import pkg from "../../package.json";
import { AlbinaIntl } from "../i18n";

export function getBugReportUrl(intl: AlbinaIntl): string {
  const url = new URL(`${pkg.repository.url}/-/issues/new`);

  url.searchParams.set(
    "issue[title]",
    [intl.formatMessage({ id: "bugreport:issue:title" }), ": "].join("")
  );

  const description = intl.formatMessage({
    id: "bugreport:issue:description"
  });

  const debugInfoTempl = `## System-Information
\`\`\`
URL: {url}
Version: {version}
User-Agent: {user-agent}
\`\`\``;

  const resolvedDebugInfo = template(debugInfoTempl, {
    url: window.location.href,
    version: import.meta.env.APP_VERSION,
    "user-agent": navigator.userAgent
  });

  url.searchParams.set(
    "issue[description]",
    [description, resolvedDebugInfo].filter(Boolean).join("\n\n")
  );

  return url.toString();
}
