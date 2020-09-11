import React from "react";
import { dateToDateTimeString } from "../../util/date.js";
import { observer, inject } from "mobx-react";
import { injectIntl } from "react-intl";

class WeatherMapTitle extends React.Component {
  render() {
    const { language } = window["appStore"];
    let timeSpan = this.props.store.timeSpan;
    let domainId = this.props.store.domainId;
    let dateTime = new Date(this.props.store.currentTimeIndex);

    // const dateTimeFormat = new Intl.DateTimeFormat(window.appStore.language, {
    //   weekday: "long",
    //   day: "numeric",
    //   month: "numeric",
    //   year: "numeric",
    //   hour: "numeric",
    //   minute: "numeric"
    // });

    dateTime.getDay;
    return (
      <div>
        <h2 className="subheader">
          {this.props.store.currentTimeIndex && dateToDateTimeString(dateTime)}
        </h2>
        <h2>
          {this.props.intl.formatMessage({
            id: "weathermap:map-title:" + domainId + ":" + timeSpan
          })}
        </h2>
      </div>
    );
  }
}
export default inject("locale")(injectIntl(observer(WeatherMapTitle)));
