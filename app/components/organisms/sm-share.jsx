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
          <li>
            <Tooltip
              label={this.props.intl.formatMessage(
                { id: "main:share-this:hover" },
                { on: "Facebook" }
              )}
            >
              <a
                href={this.getShareUrl("facebook")}
                className="sm-button icon-sm-facebook "
                aria-label={this.props.intl.formatMessage(
                  { id: "main:share-this:hover" },
                  { on: "Facebook" }
                )}
                rel="noopener noreferrer"
                target="_blank"
              >
                <span>Facebook</span>
              </a>
            </Tooltip>
          </li>
          <li>
            <Tooltip
              label={this.props.intl.formatMessage(
                { id: "main:share-this:hover" },
                { on: "Twitter" }
              )}
            >
              <a
                href={this.getShareUrl("twitter")}
                className="sm-button icon-sm-twitter"
                aria-label={this.props.intl.formatMessage(
                  { id: "main:share-this:hover" },
                  { on: "Twitter" }
                )}
                rel="noopener noreferrer"
                target="_blank"
              >
                <span>Twitter</span>
              </a>
            </Tooltip>
          </li>
          {false && (
            <li>
              <Tooltip
                label={this.props.intl.formatMessage(
                  { id: "main:share-this:hover" },
                  { on: "Instagram" }
                )}
              >
                <a
                  className="sm-button icon-sm-instagram"
                  aria-label={this.props.intl.formatMessage(
                    { id: "main:share-this:hover" },
                    { on: "Instagram" }
                  )}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <span>Instagram</span>
                </a>
              </Tooltip>
            </li>
          )}
          {false && (
            <li>
              <Tooltip
                label={this.props.intl.formatMessage(
                  { id: "main:share-this:hover" },
                  { on: "YouTube" }
                )}
              >
                <a
                  className="sm-button icon-sm-youtube "
                  aria-label={this.props.intl.formatMessage(
                    { id: "main:share-this:hover" },
                    { on: "YouTube" }
                  )}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  <span>YouTube</span>
                </a>
              </Tooltip>
            </li>
          )}
          <li>
            <Tooltip
              label={this.props.intl.formatMessage(
                { id: "main:share-this:hover" },
                { on: "WhatsApp" }
              )}
            >
              <a
                href={this.getShareUrl("whatsapp")}
                className="sm-button icon-sm-whatsapp "
                aria-label={this.props.intl.formatMessage(
                  { id: "main:share-this:hover" },
                  { on: "WhatsApp" }
                )}
                rel="noopener noreferrer"
                target="_blank"
              >
                <span>WhatsApp</span>
              </a>
            </Tooltip>
          </li>
          <li>
            <Tooltip
              label={this.props.intl.formatMessage(
                { id: "main:share-this:hover" },
                { on: "Telegram" }
              )}
            >
              <a
                href={this.getShareUrl("telegram")}
                className="sm-button icon-sm-telegram"
                aria-label={this.props.intl.formatMessage(
                  { id: "main:share-this:hover" },
                  { on: "Telegram" }
                )}
                rel="noopener noreferrer"
                target="_blank"
              >
                <span>Telegram</span>
              </a>
            </Tooltip>
          </li>
        </ul>
      </section>
    );
  }
}
export default injectIntl(SmShare);
