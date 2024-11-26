import React from "react";
import { useIntl } from "../../i18n";

interface Dependency {
  name: string;
  version: string;
  license: string;
  homepage: string;
}

const dependencies: Dependency[] = JSON.parse(import.meta.env.APP_DEPENDENCIES); // included via vite.config.js

export default function OpenSourceLicenses() {
  const intl = useIntl();
  return (
    <ul className="list-inline">
      <li>
        <strong>
          {intl.formatMessage({ id: "more:open-data:open-source-licenses" })}
          {":"}
        </strong>
      </li>
      {dependencies.map(d => (
        <li key={d.name}>
          <a href={d.homepage}>
            {d.name} {d.version}
          </a>{" "}
          ({d.license})
        </li>
      ))}
    </ul>
  );
}
