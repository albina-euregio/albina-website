import React from "react";
import { observer } from "mobx-react";
import { useIntl } from "react-intl";
import { getLocalDate } from "../../util/date.js";
import { BULLETIN_STORE } from "../../stores/bulletinStore";

const BulletinStatusLine = ({ status }) => {
  const intl = useIntl();
  const collection = BULLETIN_STORE.activeBulletinCollection;
  let statusText = "";
  let isRepublished = false;

  if (status == "pending") {
    statusText =
      intl.formatMessage({ id: "bulletin:header:loading" }) + "\u2026";
  }

  if (status == "ok") {
    const pubDate = getLocalDate(collection.publicationDate);
    isRepublished = pubDate.getHours() !== 17 || pubDate.getMinutes() !== 0;

    // There must be a status entry for each downloaded bulletin. Query its
    // original status message.
    const params = {
      date: intl.formatDate(pubDate),
      time: intl.formatTime(pubDate)
    };

    if (isRepublished) {
      statusText = intl.formatMessage(
        { id: "bulletin:header:updated-at" },
        params
      );
    } else {
      statusText = intl.formatMessage(
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
};

export default observer(BulletinStatusLine);
