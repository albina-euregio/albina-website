import React from "react";
import { injectIntl, FormattedMessage } from "react-intl";
import { Tooltip } from "../tooltips/tooltip";

class SmShare extends React.Component {
  getShareUrl(type) {
    const currentUrl = String(window.location);
    let url = "";
    const params = new URLSearchParams();

    if (type == "facebook") {
      url = "https://www.facebook.com/sharer.php";
      params.set("u", currentUrl);
      if (this.props.image) {
        params.set("picture", this.props.image);
      }
      if (this.props.title) {
        params.set("title", this.props.title);
      }
      if (this.props.description) {
        params.set("description", this.props.description);
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
      if (this.props.title) {
        params.set("title", this.props.title);
      }
    }

    return url ? `${url}?${params}` : "#";
  }

  render() {
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
                label={this.props.intl.formatMessage(
                  { id: "main:share-this:hover" },
                  { on: type }
                )}
              >
                <a
                  href={this.getShareUrl(type.toLowerCase())}
                  className={`sm-button icon-sm-${type.toLowerCase()}`}
                  aria-label={this.props.intl.formatMessage(
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
}
export default injectIntl(SmShare);
