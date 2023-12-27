import React, { useMemo } from "react";
import { useIntl } from "react-intl";
import type { BulletinCollection, Status } from "../../stores/bulletinStore.js";
import { isSummerTime } from "../../util/date.js";

type Props = {
  activeBulletinCollection: BulletinCollection;
  status: Status;
};

const BulletinStatusLine = (props: Props) => {
  const intl = useIntl();
  const status = props.status;
  const collection = props.activeBulletinCollection;
  let statusText = "";
  const publicationTime = (collection?.bulletins || [])
    .map(b => b.publicationTime)
    .reduce((t1, t2) => (t1 > t2 ? t1 : t2), "");
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

export default BulletinStatusLine;
