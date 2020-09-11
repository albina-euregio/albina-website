import React from "react";
import { withRouter, matchPath } from "react-router";
import { injectIntl } from "react-intl";

class WeatherMapCockpit extends React.Component {
  constructor(props) {
    super(props);
  }

  getDomainButtons() {
    const domainButtons = this.props.domainConfig
      ? Object.keys(this.props.domainConfig.domains).map(domainId => {
          return {
            id: domainId,
            title: this.props.intl.formatMessage({
              id: "weathermap:domain:description:" + domainId
            }),
            url: "/weather/map/" + domainId,
            isExternal: false
          };
        })
      : [];

    let classes = [];
    let buttons = [];
    domainButtons.forEach(aButton => {
      buttons.push(
        <a
          key={aButton.title}
          href={aButton.url}
          rel="noopener"
          target="_blank"
          className={classes.join(" ")}
        >
          {aButton.title}
        </a>
      );
    });
    return buttons;
  }
  getTickButtons() {}

  render() {
    return <div className="cockpit">{this.getDomainButtons()}</div>;
  }
}
export default injectIntl(withRouter(WeatherMapCockpit));
