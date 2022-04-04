import React from "react";
import { injectIntl, FormattedMessage } from "react-intl";
import { Tooltip } from "../tooltips/tooltip";

class SubscribeAppDialog extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const imgRoot = window.config.projectRoot + "images/pro/apps/";
    const imgFormat = window.config.webp ? ".webp" : ".png";

    const apps = config.subscribe.apps;
    const downloads = {};
    apps.forEach(a => {
      downloads[a.id] = Object.keys(a.url).map(t => (
        <li key={t}>
          <Tooltip
            label={this.props.intl.formatMessage({
              id: "dialog:subscribe-app:" + t + ":hover"
            })}
          >
            <a
              className="pure-button"
              href={a.url[t]}
              rel="noopener noreferrer"
              target="_blank"
            >
              {this.props.intl.formatMessage({
                id: "dialog:subscribe-app:" + t + ":button"
              })}
            </a>
          </Tooltip>
        </li>
      ));
    });

    return (
      <div className="modal-subscribe-apps">
        <div className="modal-header">
          <h2>
            <FormattedMessage id="dialog:subscribe-app:subheader" />
          </h2>
        </div>

        {apps.map(a => (
          <div className="app-dl" key={a.id}>
            <img
              className="app-logo"
              src={imgRoot + a.logo.replace(/\.png$/, imgFormat)}
              title={this.props.intl.formatMessage({
                id: "dialog:subscribe-app:" + a.id + ":title"
              })}
              alt={this.props.intl.formatMessage({
                id: "dialog:subscribe-app:" + a.id + ":title"
              })}
            />
            <h2 className="subheader">
              <FormattedMessage
                id={"dialog:subscribe-app:" + a.id + ":title"}
              />
            </h2>

            <ul className="list-inline list-buttongroup">
              {downloads[a.id].reduce((prev, curr) => [
                prev,
                <li key="or">
                  <span className="buttongroup-boolean">
                    {this.props.intl.formatMessage({
                      id: "dialog:subscribe-app:or"
                    })}
                  </span>
                </li>,
                curr
              ])}
            </ul>
          </div>
        ))}
      </div>
    );
  }
}
export default injectIntl(SubscribeAppDialog);
