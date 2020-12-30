import React from "react";
import { Link } from "react-router-dom";
import Iframe from "react-iframe";
import { injectIntl, FormattedHTMLMessage } from "react-intl";

import ProvinceFilter from "../filters/province-filter";
import { regionCodes } from "../../util/regions";

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
    const socialMedia = config.subscribe.socialMedia;
    const socialMediaNames = {};
    socialMedia.forEach(s => {
      socialMediaNames[s.id] = s.name;
    });

    const subscriptions = {};
    regionCodes.forEach(r => {
      subscriptions[r] = socialMedia
        .map(s => {
          return { id: s.id, url: s.url[r] ? s.url[r] : null };
        })
        .filter(e => e.url);
    });

    const iframeUrls = config.subscribe.messengerpeople;
    const iframeUrl = this.state.region
      ? iframeUrls[this.state.region][window["appStore"].language]
      : "";

    return (
      <div className="modal-subscribe-socialmedia">
        <div className="modal-header">
          <h2>
            <FormattedHTMLMessage id="dialog:subscribe-social-media:subheader" />
          </h2>
        </div>

        <form className="pure-form pure-form-stacked">
          <label htmlFor="province">
            <FormattedHTMLMessage id="dialog:subscribe-email:region" />
          </label>
          <ul className="list-inline list-buttongroup">
            <li>
              <ProvinceFilter
                name="province"
                className={this.state.region && "selectric-changed"}
                handleChange={r => this.handleChangeRegion(r)}
                value={this.state.region}
                none={this.props.intl.formatMessage({
                  id: "blog:filter:province:nothing-selected"
                })}
              />
            </li>
          </ul>

          <hr />
        </form>

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
            to="/more/contact"
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
export default injectIntl(SubscribeSocialMediaDialog);
