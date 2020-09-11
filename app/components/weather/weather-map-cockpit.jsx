import React from "react";
import { withRouter, matchPath } from "react-router";
import { injectIntl } from "react-intl";
import { Link } from "react-router-dom";
import { dateToDateTimeString } from "../../util/date.js";

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
        <div
          key={aButton.title}
          onClick={event => {
            event.stopPropagation();
            if (typeof this.props.onChangeDomain === "function") {
              this.props.onChangeDomain(aButton);
            }
          }}
        >
          <Link to={aButton.url} className={classes.join(" ")}>
            {aButton.title}
          </Link>
        </div>
      );
    });
    return buttons;
  }
  getTickButtons() {
    let buttons = [];

    if (this.props.timeArray)
      this.props.timeArray.forEach(aTime => {
        let buttonClass = "leaflet-bar-part leaflet-bar-part-single";
        if (aTime < this.props.startDate) buttonClass = "future";
        buttons.push(
          <a
            key={aTime}
            href="javascript: void(0)"
            onClick={() => this.props.eventCallback(aTime)}
            role="button"
          >
            {dateToDateTimeString(aTime)}
          </a>
        );
      });
    return buttons;
  }

  render() {
    return (
      <div className="cockpit">
        {this.getDomainButtons()}
        {this.getTickButtons()}
      </div>
    );
  }
}
export default injectIntl(withRouter(WeatherMapCockpit));
