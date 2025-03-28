import React from "react";
import type { Temporal } from "temporal-polyfill";
import { useIntl } from "../../i18n";

import BulletinDateFlipper from "./bulletin-date-flipper.jsx";
import BulletinStatusLine from "./bulletin-status-line.jsx";
import { LONG_DATE_FORMAT } from "../../util/date";
import type { BulletinCollection, Status } from "../../stores/bulletin";

interface Props {
  date?: Temporal.PlainDate;
  latestDate?: Temporal.PlainDate;
  status: Status;
  activeBulletinCollection: BulletinCollection;
}

function BulletinHeader(props: Props) {
  const intl = useIntl();

  const date = intl.formatDate(props.date, LONG_DATE_FORMAT);

  let statusClass = "";
  const status = props.status;
  if (status === "pending") {
    statusClass = "loading";
  } else if (status === "n/a") {
    statusClass = "not-available";
  } else if (status === "empty") {
    statusClass = "no-data";
  } else {
    statusClass = "";
  }

  return (
    <section
      id="section-bulletin-header"
      className={`section-padding section-header section-bulletin-header bulletin-updated ${statusClass}`}
    >
      <header className="section-centered">
        <BulletinStatusLine
          status={props.status}
          bulletins={props.activeBulletinCollection?.bulletinsWith170000}
        />
        <h2 className="subheader">
          {intl.formatMessage({ id: "bulletin:title" })}
        </h2>
        <h1 className="bulletin-datetime-validity">{date}</h1>
        <BulletinDateFlipper date={props.date} latest={props.latestDate} />
      </header>
    </section>
  );
}
export default BulletinHeader;
