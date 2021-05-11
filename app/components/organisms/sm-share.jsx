import React from "react";
import { injectIntl, FormattedHTMLMessage } from "react-intl";

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
          <FormattedHTMLMessage id="main:share-this" />
        </p>
        <ul className="list-inline sm-buttons">
          <li>
            <a
              href={this.getShareUrl("facebook")}
              className="sm-button icon-sm-facebook tooltip"
              title={this.props.intl.formatMessage(
                { id: "main:share-this:hover" },
                { on: "Facebook" }
              )}
              aria-label={this.props.intl.formatMessage(
                { id: "main:share-this:hover" },
                { on: "Facebook" }
              )}
              rel="noopener noreferrer"
              target="_blank"
            >
              <span>Facebook</span>
            </a>
          </li>
          <li>
            <a
              href={this.getShareUrl("twitter")}
              className="sm-button icon-sm-twitter tooltip"
              title={this.props.intl.formatMessage(
                { id: "main:share-this:hover" },
                { on: "Twitter" }
              )}
              rel="noopener noreferrer"
              target="_blank"
            >
              <span>Twitter</span>
            </a>
          </li>
          {false && (
            <li>
              <a
                className="sm-button icon-sm-instagram tooltip"
                title={this.props.intl.formatMessage(
                  { id: "main:share-this:hover" },
                  { on: "Instagram" }
                )}
                rel="noopener noreferrer"
                target="_blank"
              >
                <span>Instagram</span>
              </a>
            </li>
          )}
          {false && (
            <li>
              <a
                className="sm-button icon-sm-youtube tooltip"
                title={this.props.intl.formatMessage(
                  { id: "main:share-this:hover" },
                  { on: "YouTube" }
                )}
                rel="noopener noreferrer"
                target="_blank"
              >
                <span>YouTube</span>
              </a>
            </li>
          )}
          <li>
            <a
              href={this.getShareUrl("whatsapp")}
              className="sm-button icon-sm-whatsapp tooltip"
              title={this.props.intl.formatMessage(
                { id: "main:share-this:hover" },
                { on: "WhatsApp" }
              )}
              rel="noopener noreferrer"
              target="_blank"
            >
              <span>WhatsApp</span>
            </a>
          </li>
          <li>
            <a
              href={this.getShareUrl("telegram")}
              className="sm-button icon-sm-telegram tooltip"
              title={this.props.intl.formatMessage(
                { id: "main:share-this:hover" },
                { on: "Telegram" }
              )}
              rel="noopener noreferrer"
              target="_blank"
            >
              <span>Telegram</span>
            </a>
          </li>
        </ul>
      </section>
    );
  }
}
export default injectIntl(SmShare);
