import React from "react";
import { observer } from "mobx-react";
import { injectIntl } from "react-intl";
import { getLocalDate } from "../../util/date.js";
import { BULLETIN_STORE } from "../../stores/bulletinStore";

class BulletinStatusLine extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const collection = BULLETIN_STORE.activeBulletinCollection;
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
        date: this.props.intl.formatDate(pubDate),
        time: this.props.intl.formatTime(pubDate)
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
