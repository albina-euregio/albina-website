import React from "react";
import { injectIntl, FormattedMessage } from "react-intl";
import { regionCodes } from "../../util/regions";

class FollowDialog extends React.Component {
  constructor(props) {
    super(props);
  }

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

    return (
      <div className="modal-container">
        <div className="modal-follow">
          <div className="modal-header">
            <h2 className="subheader">
              <FormattedMessage id="dialog:follow:header" />
            </h2>
          </div>

          {Object.keys(subscriptions).map(r => (
            <div key={r} className="followRegion">
              <h2 className="subheader">
                {this.props.intl.formatMessage({ id: "region:" + r })}
              </h2>
              <ul className="list-inline sm-buttons">
                {subscriptions[r]
                  .filter(e => e.url && e.url !== "#")
                  .map(e => (
                    <li key={e.id}>
                      <a
                        className={"sm-button icon-sm-" + e.id + " tooltip"}
                        href={e.url}
                        rel="noopener noreferrer"
                        target="_blank"
                        title={this.props.intl.formatMessage(
                          { id: "footer:follow-us:hover" },
                          { on: socialMediaNames[e.id] }
                        )}
                      >
                        <span>{socialMediaNames[e.id]}</span>
                      </a>
                    </li>
                  ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
export default injectIntl(FollowDialog);
