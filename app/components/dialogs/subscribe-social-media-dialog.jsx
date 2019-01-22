import React from "react";
import { Link } from "react-router-dom";
import Iframe from "react-iframe";
import { inject } from "mobx-react";
import { injectIntl, FormattedHTMLMessage } from "react-intl";

import ProvinceFilter from "../filters/province-filter";

class SubscribeSocialMediaDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      region: false
    };
  }

  handleChangeRegion = newRegion => {
    this.setState({ region: newRegion !== "none" ? newRegion : false });
  };

  render() {
    const socialMedia = config.get("subscribe.socialMedia");
    const socialMediaNames = {};
    socialMedia.forEach(s => {
      socialMediaNames[s.id] = s.name;
    });

    const subscriptions = {};
    Object.keys(window["appStore"].regions).forEach(r => {
      subscriptions[r] = socialMedia
        .map(s => {
          return { id: s.id, url: s.url[r] ? s.url[r] : null };
        })
        .filter(e => e.url);
    });

    const iframeUrls = config.get("subscribe.messengerpeople");
    const iframeUrl = this.state.region
      ? iframeUrls[this.state.region][window["appStore"].language]
      : "";

    return (
      <div className="modal-follow" style={{ textAlign: "center" }}>
        <div className="modal-header">
          <h2 className="subheader">
            <FormattedHTMLMessage id="dialog:subscribe-social-media:header" />
          </h2>
          <h2>
            <FormattedHTMLMessage id="dialog:subscribe-social-media:subheader" />
          </h2>
          <p className="tiny">
            <a
              href="#subscribeDialog"
              className="icon-link icon-arrow-left modal-trigger tooltip"
              title={this.props.intl.formatMessage({
                id: "dialog:subscribe-social-media:back-button:hover"
              })}
            >
              <FormattedHTMLMessage id="dialog:subscribe-social-media:back-button" />
            </a>
          </p>
        </div>

        <div
          style={{
            textAlign: "center",
            width: "fit-content",
            margin: "0 auto",
            paddingBottom: "2em"
          }}
        >
          <label htmlFor="province">
            <FormattedHTMLMessage id="dialog:subscribe-email:region" />
          </label>
          <ProvinceFilter
            name="province"
            className={this.state.region && "selectric-changed"}
            handleChange={r => this.handleChangeRegion(r)}
            value={this.state.region}
            none={this.props.intl.formatMessage({
              id: "blog:filter:province:nothing-selected"
            })}
          />
        </div>

        <div
          className="messengerpeople-wrapper"
          style={{ textAlign: "-webkit-center" }}
        >
          <Iframe
            width="390px"
            height="370px"
            className="messengerpeople"
            url={iframeUrl}
          />
        </div>

        <p>
          <Link
            to="/contact"
            title={this.props.intl.formatMessage({
              id: "dialog:subscribe-social-media:contact-button:hover"
            })}
            className="secondary pure-button"
          >
            {this.props.intl.formatMessage({
              id: "dialog:subscribe-social-media:contact-button"
            })}
          </Link>
        </p>
      </div>
    );
  }
}
export default inject("locale")(injectIntl(SubscribeSocialMediaDialog));
