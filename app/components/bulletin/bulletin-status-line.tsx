import React, { useMemo } from "react";
import { useIntl } from "../../i18n";
import type { Bulletin, Status } from "../../stores/bulletin";
import { Tooltip } from "../tooltips/tooltip";
import { DATE_TIME_FORMAT_SHORT } from "../../util/date";

type Props = {
  bulletin: Bulletin;
  allBulletins: Bulletin[];
  status: Status;
};

const BulletinStatusLine = (props: Props) => {
  const intl = useIntl();
  const status = props.status;
  let publishText = "";
  let updateText = "";
  let validityText = "";
  let publicationTime: string | undefined;
  let updateTime: string | undefined;

  const unscheduled = useMemo(
    () =>
      props.bulletin?.unscheduled ??
      (publicationTime &&
        !new Date(publicationTime)
          .toLocaleTimeString("de", { timeZone: "Europe/Vienna" })
          .includes("17:00")),
    [props.bulletin?.unscheduled, publicationTime]
  );
  //console.log("BulletinStatusLine", { unscheduled: props?.bulletin?.unscheduled, currBulletin: props.bulletin, allBulletins: props.allBulletins?.[0]});
  if (status == "pending") {
    publishText =
      intl.formatMessage({ id: "bulletin:header:loading" }) + "\u2026";
  }

  if (status == "ok") {
    // There must be a status entry for each downloaded bulletin. Query its
    // original status message.

    publicationTime = props.bulletin?.publicationTime;
    if (unscheduled) {
      updateTime = props.bulletin?.publicationTime;

      const firstRelease = props.allBulletins?.[0].reduce((b1, b2) =>
        b1.publicationTime < b2.publicationTime ? b1 : b2
      );
      publicationTime = firstRelease?.publicationTime;
    }
  }

  validityText = intl.formatMessage(
    { id: "bulletin:header:validity-time" },
    {
      start: intl.formatDate(
        props?.bulletin?.validTime?.startTime,
        DATE_TIME_FORMAT_SHORT
      ),
      end: intl.formatDate(
        props?.bulletin?.validTime?.endTime,
        DATE_TIME_FORMAT_SHORT
      )
    }
  );

  publishText = intl.formatMessage(
    { id: "bulletin:header:published-at" },
    {
      date: intl.formatDate(publicationTime),
      time: intl.formatDate(publicationTime, { timeStyle: "short" })
    }
  );

  if (updateTime) {
    updateText = intl.formatMessage(
      { id: "bulletin:header:updated-at" },
      {
        date: intl.formatDate(updateTime),
        time: intl.formatDate(updateTime, { timeStyle: "short" })
      }
    );
  }
  // console.log("BulletinStatusLine->render", {
  //   publishText,
  //   updateText,
  //   validityText,
  //   unscheduled,
  //   publicationTime,
  //   updateTime
  // });
  return (
    <>
      <p className="marginal">
        {publicationTime && (
          <span className="text-icon bulletin-datetime-release">
            <span className="icon icon-release"></span>
            <span className="text">{publishText}</span>
          </span>
        )}
        {updateTime && (
          <Tooltip
            label={intl.formatMessage({
              id: "bulletin:header:updated-at:tooltip"
            })}
          >
            <span className="text-icon bulletin-datetime-publishing">
              <span className="icon icon-update"></span>
              <span className="text">{updateText}</span>
            </span>
          </Tooltip>
        )}
        {props?.bulletin?.validTime?.startTime &&
          props?.bulletin?.validTime?.endTime && (
            <span className="text-icon bulletin-datetime-validity">
              <span className="icon icon-validity"></span>
              <span className="text">{validityText}</span>
            </span>
          )}
      </p>
    </>
  );
};

export default BulletinStatusLine;
