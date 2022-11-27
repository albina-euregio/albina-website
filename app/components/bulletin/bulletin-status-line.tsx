import React from "react";
import { observer } from "mobx-react";
import { useIntl } from "react-intl";
import { BULLETIN_STORE } from "../../stores/bulletinStore.js";

const BulletinStatusLine = () => {
  const intl = useIntl();
  const status = BULLETIN_STORE.settings.status;
  const collection = BULLETIN_STORE.activeBulletinCollection;
  let statusText = "";
  let isRepublished = false;

  if (status == "pending") {
    statusText =
      intl.formatMessage({ id: "bulletin:header:loading" }) + "\u2026";
  }

  if (status == "ok") {
    const publicationTime = collection?.bulletins?.[0]?.publicationTime;
    isRepublished = !/T16:00:00Z/.test(publicationTime);

    // There must be a status entry for each downloaded bulletin. Query its
    // original status message.
    const params = {
      date: intl.formatDate(publicationTime),
      time: intl.formatTime(publicationTime)
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
