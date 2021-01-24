import React from "react";
import { observer } from "mobx-react";
import { injectIntl } from "react-intl";
import {
  dateToDateString,
  dateToTimeString,
  getLocalDate
} from "../../util/date.js";

/**
 * @typedef {object} Props
 * @prop {import("../../stores/bulletinStore").BulletinStore} store
 *
 * @extends {React.Component<Props>}
 */
class BulletinStatusLine extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const collection = this.props.store.activeBulletinCollection;
    let statusText = "";
    let isRepublished = false;

    if (this.props.status == "pending") {
      statusText =
        this.props.intl.formatMessage({ id: "bulletin:header:loading" }) +
        "\u2026";
    }

    if (this.props.status == "ok") {
      const pubDate = getLocalDate(collection.publicationDate);
      isRepublished = pubDate.getHours() !== 17 || pubDate.getMinutes() !== 0;

      // There must be a status entry for each downloaded bulletin. Query its
      // original status message.
      const params = {
        date: dateToDateString(pubDate),
        time: dateToTimeString(pubDate)
      };

      if (isRepublished) {
        statusText = this.props.intl.formatMessage(
          { id: "bulletin:header:updated-at" },
          params
        );
      } else {
        statusText = this.props.intl.formatMessage(
          { id: "bulletin:header:published-at" },
          params
        );
      }
    }

    return (
      <p
        className={
          "marginal " +
          (isRepublished
            ? "bulletin-datetime-publishing"
            : "bulletin-datetime-validity")
        }
      >
        {statusText}
      </p>
    );
  }
}

export default injectIntl(observer(BulletinStatusLine));
