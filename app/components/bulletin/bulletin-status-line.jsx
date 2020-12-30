import React from "react";
import { observer } from "mobx-react";
import { computed } from "mobx";
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

  @computed get message() {
    return window["archiveStore"].getStatusMessage(
      this.props.store.settings.date
    );
  }

  @computed get statusText() {
    const collection = this.props.store.activeBulletinCollection;

    if (this.props.status == "pending") {
      return (
        this.props.intl.formatMessage({ id: "bulletin:header:loading" }) +
        "\u2026"
      );
    }

    if (this.props.status == "ok") {
      const pubDate = getLocalDate(collection.publicationDate);

      // There must be a status entry for each downloaded bulletin. Query its
      // original status message.
      const params = {
        date: dateToDateString(pubDate),
        time: dateToTimeString(pubDate)
      };

      if (this.message === "republished") {
        return this.props.intl.formatMessage(
          { id: "bulletin:header:updated-at" },
          params
        );
      } else {
        return this.props.intl.formatMessage(
          { id: "bulletin:header:published-at" },
          params
        );
      }
    }

    return "";
  }

  render() {
    return (
      <p
        className={
          "marginal " +
          (this.message === "republished"
            ? "bulletin-datetime-publishing"
            : "bulletin-datetime-validity")
        }
      >
        {this.statusText}
      </p>
    );
  }
}

export default injectIntl(observer(BulletinStatusLine));
