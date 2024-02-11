import React, { useMemo } from "react";
import { useIntl } from "../../i18n";
import type { Bulletin, Status } from "../../stores/bulletin";

type Props = {
  bulletin: Bulletin;
  status: Status;
};

const BulletinStatusLine = (props: Props) => {
  const intl = useIntl();
  const status = props.status;
  let statusText = "";
  const publicationTime = props.bulletin?.publicationTime;
  const unscheduled = useMemo(
    () =>
      props.bulletin?.unscheduled ??
      (publicationTime &&
        !new Date(publicationTime)
          .toLocaleTimeString("de", { timeZone: "Europe/Vienna" })
          .includes("17:00")),
    [props.bulletin?.unscheduled, publicationTime]
  );

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

    if (unscheduled) {
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
        (unscheduled
          ? "bulletin-datetime-publishing"
          : "bulletin-datetime-validity")
      }
    >
      {statusText}
    </span>
  );
};

export default BulletinStatusLine;
