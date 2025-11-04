import React from "react";
import { useIntl } from "../../i18n";
import { Tooltip } from "../tooltips/tooltip";

export default function SubscribeAppDialog() {
  const intl = useIntl();
  const imgRoot = `${window.config.projectRoot}images/pro/apps/`;

  const apps = config.subscribe.apps;

  return (
    <>
      {apps.map(a => (
        <div className="app-dl" key={a.name}>
          <img
            className="app-logo"
            src={imgRoot + a.logo}
            title={a.name}
            alt={a.name}
          />
          <h2 className="subheader">{a.name}</h2>

          <ul className="list-inline list-buttongroup">
            {(Object.keys(a.url) as ("android" | "ios")[])
              .map(t => (
                <li key={t}>
                  <Tooltip
                    label={intl.formatMessage({
                      id: `dialog:subscribe-app:${t}:hover`
                    })}
                  >
                    <a
                      className="pure-button"
                      href={a.url[t]}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {intl.formatMessage({
                        id: `dialog:subscribe-app:${t}:button`
                      })}
                    </a>
                  </Tooltip>
                </li>
              ))
              .reduce((prev, curr) => [
                prev,
                <li key="or">
                  <span className="buttongroup-boolean">
                    {intl.formatMessage({
                      id: "dialog:subscribe-app:or"
                    })}
                  </span>
                </li>,
                curr
              ])}
          </ul>
        </div>
      ))}
    </>
  );
}
