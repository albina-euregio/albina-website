import React from "react";
import { useIntl } from "../../i18n";
import type { Bulletin, Status } from "../../stores/bulletin";
import { DATE_TIME_FORMAT_SHORT } from "../../util/date";

interface Props {
  bulletins: [Bulletin, Bulletin?][];
  status: Status;
}

const BulletinStatusLine = ({ bulletins, status }: Props) => {
  const intl = useIntl();

  if (status == "pending") {
    return (
      <p className="marginal">
        {intl.formatMessage({ id: "bulletin:header:loading" }) + "\u2026"}
      </p>
    );
  }

  const bulletin = bulletins?.[0]?.[0];
  const publicationTimes = bulletins
    ?.flatMap(([b1, b2]) =>
      b2 ? [+b1.publicationTime, +b2.publicationTime] : [+b1.publicationTime]
    )
    .filter((time, index, self) => self.indexOf(time) === index)
    .sort();

  const publicationTimes0 = publicationTimes?.[0];
  const publicationTimes1 =
    publicationTimes?.length > 1
      ? publicationTimes[publicationTimes.length - 1]
      : undefined;

  return (
    <p className="marginal">
      {publicationTimes0 && (
        <span className="text-icon bulletin-datetime-release">
          <span className="icon icon-release"></span>
          <span className="text">
            {intl.formatMessage(
              { id: "bulletin:header:published-at" },
              {
                date: intl.formatDate(publicationTimes0),
                time: intl.formatDate(publicationTimes0, {
                  timeStyle: "short"
                })
              }
            )}
          </span>
        </span>
      )}

      {publicationTimes1 && (
        <span className="text-icon bulletin-datetime-update">
          <span className="icon icon-update"></span>
          <span className="text">
            {intl.formatMessage(
              { id: "bulletin:header:updated-at" },
              {
                date: intl.formatDate(publicationTimes1),
                time: intl.formatDate(publicationTimes1, {
                  timeStyle: "short"
                })
              }
            )}
          </span>
        </span>
      )}

      {bulletin?.validTime?.startTime && bulletin?.validTime?.endTime && (
        <span className="text-icon bulletin-datetime-validity">
          <span className="icon icon-validity"></span>
          <span className="text">
            {intl.formatMessage(
              { id: "bulletin:header:validity-time" },
              {
                start: intl.formatDate(
                  bulletin?.validTime?.startTime,
                  DATE_TIME_FORMAT_SHORT
                ),
                end: intl.formatDate(
                  bulletin?.validTime?.endTime,
                  DATE_TIME_FORMAT_SHORT
                )
              }
            )}
          </span>
        </span>
      )}
    </p>
  );
};

export default BulletinStatusLine;
