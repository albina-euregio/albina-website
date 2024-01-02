import React from "react";
import { FormattedMessage, useIntl } from "../../i18n";
import { Tooltip } from "../tooltips/tooltip";

export default function SmFollow({ region }) {
  const intl = useIntl();
  const accounts = config.subscribe.socialMedia.filter(
    account => account.url[region]
  );
  return (
    <section className="footer-logo-share-follow">
      <p>
        <FormattedMessage
          id="footer:follow-us"
          html={true}
          values={{
            region: intl.formatMessage({ id: `region:${region}` }),
            strong: (...msg) => <strong>{msg}</strong>
          }}
        />
      </p>
      <ul className="list-inline sm-buttons">
        {accounts.map((a, i) => (
          <li key={a.id + i}>
            <Tooltip
              label={intl.formatMessage(
                { id: "footer:follow-us:hover" },
                { on: a.name }
              )}
            >
              <a
                className={"sm-button icon-sm-" + a.id}
                href={a.url[region]}
                rel="noopener noreferrer"
                target="_blank"
                aria-label={intl.formatMessage(
                  { id: "footer:follow-us:hover" },
                  { on: a.name }
                )}
              >
                <span>{a.name}</span>
              </a>
            </Tooltip>
          </li>
        ))}
      </ul>
    </section>
  );
}
