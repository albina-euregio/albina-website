import React from "react";
import { observer } from "mobx-react";
import { dateToDateTimeString } from "../../util/date.js";

@observer
export default class WeatherMapTitle extends React.Component {
  render() {
    const { language } = window["appStore"];
    let { description, descriptionDate } = this.props.store.item || {};
    if (descriptionDate[language]) {
      descriptionDate[language] = WeatherMapTitle.formatDate(
        descriptionDate[language]
      );
    }
    return (
      <div>
        <h2 className="subheader">{descriptionDate[language] || ""}</h2>
        <h2>{description[language] || ""}</h2>
      </div>
    );
  }

  static formatDate(date) {
    return date
      .split(/ - /g)
      .map(dateString => {
        try {
          const match = dateString.match(
            /^\w+ (\d\d\d\d-\d\d-\d\d \d\d:\d\d)$/
          );
          if (match) {
            const date = new Date(match[1]);
            return dateToDateTimeString(date);
          }
        } catch (e) {
          // fall-through
        }
        return dateString;
      })
      .join(" – ");
  }
}
