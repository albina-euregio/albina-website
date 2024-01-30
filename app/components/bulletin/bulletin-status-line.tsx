import React, { useMemo } from "react";
import { useIntl } from "../../i18n";
import type { Bulletin, Status } from "../../stores/bulletin";
import { isSummerTime } from "../../util/date.js";

type Props = {
  bulletin: Bulletin;
  status: Status;
};

const BulletinStatusLine = (props: Props) => {
  const intl = useIntl();
  const status = props.status;
  let statusText = "";
  const publicationTime = props.bulletin?.publicationTime;
  const isRepublished = useMemo(() => {
    const summerTime = isSummerTime(new Date(publicationTime));
    return (
      publicationTime &&
      !(summerTime ? /T15:00:00Z/ : /T16:00:00Z/).test(publicationTime)
    );
  }, [publicationTime]);

  if (status == "pending") {
    statusText =
      intl.formatMessage({ id: "bulletin:header:loading" }) + "\u2026";
  }

  if (status == "ok") {
    // There must be a status entry for each downloaded bulletin. Query its
    // original status message.
    const params = {
      date: intl.formatDate(publicationTime),
      time: intl.formatDate(publicationTime, { timeStyle: "short" })
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
    <span
      className={
        "marginal " +
        (isRepublished
          ? "bulletin-datetime-publishing"
          : "bulletin-datetime-validity")
      }
    >
      {statusText}
    </span>
  );
};

export default BulletinStatusLine;
