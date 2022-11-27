import React, { useMemo } from "react";
import { observer } from "mobx-react";
import { useIntl } from "react-intl";
import { BULLETIN_STORE } from "../../stores/bulletinStore.js";
import { isSummerTime } from "../../util/date.js";

const BulletinStatusLine = () => {
  const intl = useIntl();
  const status = BULLETIN_STORE.settings.status;
  const collection = BULLETIN_STORE.activeBulletinCollection;
  let statusText = "";
  const publicationTime = collection?.bulletins?.[0]?.publicationTime;
  const isRepublished = useMemo(() => {
    const summerTime = isSummerTime(new Date(publicationTime));
    return (
      publicationTime &&
      !(summerTime ? /T15:00:00Z/ : /T16:00:00Z/).test(publicationTime)
    );
  }, []);

  if (status == "pending") {
    statusText =
      intl.formatMessage({ id: "bulletin:header:loading" }) + "\u2026";
  }

  if (status == "ok") {
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
