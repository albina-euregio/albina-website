import React from "react";
import { inject } from "mobx-react";
import { injectIntl, FormattedHTMLMessage } from "react-intl";
import Base from "../../base";

class SmShare extends React.Component {
  getShareUrl(type) {
    const currentUrl = String(window.location);
    let url = "";
    const params = {};

    if (type == "facebook") {
      url = "https://www.facebook.com/sharer.php";
      params.u = currentUrl;
      if (this.props.image) {
        params.picture = this.props.image;
      }
      if (this.props.title) {
        params.title = this.props.title;
      }
      if (this.props.description) {
        params.description = this.props.description;
      }
    }
    if (type == "twitter") {
      url = "https://www.twitter.com/share";
      params.url = currentUrl;
    }
    if (type == "whatsapp") {
      url = "https://wa.me/";
      params.text = currentUrl;
    }

    return url ? Base.makeUrl(url, params) : "#";
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
              target="_blank"
            >
              <span>WhatsApp</span>
            </a>
          </li>
        </ul>
      </section>
    );
  }
}
export default inject("locale")(injectIntl(SmShare));
