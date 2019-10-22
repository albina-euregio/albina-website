import React from "react";
import { inject } from "mobx-react";
import { injectIntl, FormattedHTMLMessage } from "react-intl";

class SubscribeAppDialog extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const imgRoot = window["config"].get("projectRoot") + "images/pro/apps/";

    const apps = config.get("subscribe.apps");
    const downloads = {};
    apps.forEach(a => {
      downloads[a.id] = Object.keys(a.url).map(t => (
        <li key={t}>
          <a
            className="pure-button tooltip"
            href={a.url[t]}
            target="_blank"
            title={this.props.intl.formatMessage({
              id: "dialog:subscribe-app:" + t + ":hover"
            })}
          >
            {this.props.intl.formatMessage({
              id: "dialog:subscribe-app:" + t + ":button"
            })}
          </a>
        </li>
      ));
    });

    return (
      <div className="modal-subscribe">
        <div className="modal-header">
          <h2 className="subheader">
            <FormattedHTMLMessage id="dialog:subscribe-app:header" />
          </h2>
          <h2>
            <FormattedHTMLMessage id="dialog:subscribe-app:subheader" />
          </h2>
          <p className="tiny">
            <a
              href="#subscribeDialog"
              className="icon-link icon-arrow-left modal-trigger tooltip"
              title={this.props.intl.formatMessage({
                id: "dialog:subscribe-app:back-button:hover"
              })}
            >
              <FormattedHTMLMessage id="dialog:subscribe-app:back-button" />
            </a>
          </p>
        </div>

        {apps.map(a => (
          <div className="app-dl" key={a.id}>
            <img className="app-logo" src={imgRoot + a.logo} title="" />
            <h2 className="subheader">
              <FormattedHTMLMessage
                id={"dialog:subscribe-app:" + a.id + ":title"}
              />
            </h2>
            <p className="small">
              <FormattedHTMLMessage
                id={"dialog:subscribe-app:" + a.id + ":text"}
              />
            </p>
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
export default inject("locale")(injectIntl(SubscribeAppDialog));
