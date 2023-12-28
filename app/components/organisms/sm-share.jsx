import React from "react";
import { FormattedMessage, useIntl } from "../../i18n";
import { Tooltip } from "../tooltips/tooltip";

export default function SmShare(props) {
  const intl = useIntl();
  function getShareUrl(type) {
    const currentUrl = String(window.location);
    let url = "";
    const params = new URLSearchParams();

    if (type == "facebook") {
      url = "https://www.facebook.com/sharer.php";
      params.set("u", currentUrl);
      if (props.image) {
        params.set("picture", props.image);
      }
      if (props.title) {
        params.set("title", props.title);
      }
      if (props.description) {
        params.set("description", props.description);
      }
    }
    if (type == "twitter") {
      url = "https://www.twitter.com/share";
      params.set("url", currentUrl);
    }
    if (type == "whatsapp") {
      url = "https://wa.me/";
      params.set("text", currentUrl);
    }
    if (type == "telegram") {
      url = "https://telegram.me/share/";
      params.set("url", currentUrl);
      if (props.title) {
        params.set("title", props.title);
      }
    }

    return url ? `${url}?${params}` : "#";
  }
  const types = [
    "Facebook",
    "Twitter",
    // "Instagram",
    // "YouTube",
    "WhatsApp",
    "Telegram"
  ];

  return (
    <section className="section section-padding sm-share-follow">
      <p>
        <FormattedMessage
          id="main:share-this"
          values={{
            strong: (...msg) => <strong>{msg}</strong>
          }}
        />
      </p>
      <ul className="list-inline sm-buttons">
        {types.map(type => (
          <li key={type}>
            <Tooltip
              label={intl.formatMessage(
                { id: "main:share-this:hover" },
                { on: type }
              )}
            >
              <a
                href={getShareUrl(type.toLowerCase())}
                className={`sm-button icon-sm-${type.toLowerCase()}`}
                aria-label={intl.formatMessage(
                  { id: "main:share-this:hover" },
                  { on: type }
                )}
                rel="noopener noreferrer"
                target="_blank"
              >
                <span>{type}</span>
              </a>
            </Tooltip>
          </li>
        ))}
      </ul>
    </section>
  );
}
