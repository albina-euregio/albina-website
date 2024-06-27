import React, { useMemo } from "react";
import { useIntl } from "../../i18n";
import type { Bulletin, Status } from "../../stores/bulletin";
import { Tooltip } from "../tooltips/tooltip";

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
    // <p
    //   className={
    //     "marginal " +
    //     (unscheduled
    //       ? "bulletin-datetime-publishing"
    //       : "bulletin-datetime-validity")
    //   }
    // >
    //   <Tooltip
    //     label={intl.formatMessage({ id: "bulletin:header:updated-at:tooltip" })}
    //   >
    //     <span>{statusText}</span>
    //   </Tooltip>
    // </p>
    <p className="marginal">
      <Tooltip
        label={intl.formatMessage({ id: "bulletin:header:updated-at:tooltip" })}
      >
        <span
          className={
            "text-icon " +
            (unscheduled
              ? "bulletin-datetime-publishing"
              : "bulletin-datetime-validity")
          }
        >
          <span className="icon icon-release"></span>
          <span className="text">{statusText}</span>
        </span>
      </Tooltip>
    </p>
  );
};

export default BulletinStatusLine;
