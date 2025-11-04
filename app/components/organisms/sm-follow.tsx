import React from "react";
import { FormattedMessage, useIntl } from "../../i18n";
import { Tooltip } from "../tooltips/tooltip";
import { eawsRegion } from "../../stores/eawsRegions";

interface Props {
  region: string;
}

export default function SmFollow({ region }: Props) {
  const intl = useIntl();
  const names = {
    facebook: "Facebook",
    instagram: "Instagram",
    youtube: "YouTube"
  };
  const urls = eawsRegion(region)?.aws[0].url;
  const accounts = Object.entries(names)
    .map(([id, name]) => ({ id, name, url: urls?.[id] }))
    .filter(({ url }) => !!url);
  return (
    <section className="footer-logo-share-follow">
      <p>
        <FormattedMessage
          id="footer:follow-us"
          html={true}
          values={{
            region: intl.formatMessage({ id: `region:${region}` }),
            strong: (...msg) => <strong key="strong">{msg}</strong>
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
                href={a.url}
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
