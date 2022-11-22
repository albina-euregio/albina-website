import React from "react";
import { observer } from "mobx-react";
import { useIntl } from "react-intl";

import BulletinDateFlipper from "./bulletin-date-flipper.jsx";
import BulletinStatusLine from "./bulletin-status-line.jsx";
import { parseDate, LONG_DATE_FORMAT } from "../../util/date.js";
import { BULLETIN_STORE } from "../../stores/bulletinStore";

function BulletinHeader() {
  const intl = useIntl();

  const date = intl.formatDate(
    parseDate(BULLETIN_STORE.settings.date),
    LONG_DATE_FORMAT
  );

  let statusClass: string = "";
  const status = BULLETIN_STORE.settings.status;
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
        <BulletinStatusLine />
        {/* <h2 className="subheader">{this.props.title}</h2> */}
        <h1 className="bulletin-datetime-validity">{date}</h1>
        <BulletinDateFlipper
          date={BULLETIN_STORE.settings.date}
          latest={BULLETIN_STORE.latest}
        />
      </header>
    </section>
  );
}
export default observer(BulletinHeader);
