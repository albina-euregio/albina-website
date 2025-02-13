import React from "react";
import type { Temporal } from "temporal-polyfill";
import BulletinReport from "./bulletin-report";
import type { Bulletin } from "../../stores/bulletin";

interface Props {
  bulletins: [Bulletin, Bulletin][];
  date: Temporal.PlainDate;
  region: string;
}

function BulletinList({ bulletins, date, region }: Props) {
  return (
    <section
      id="section-bulletin-reports"
      className="section-centered section-bulletin-reports"
    >
      <ul className="list-plain bulletin-list">
        {bulletins.map(([bulletin, bulletin170000]) => (
          <li
            id={bulletin.bulletinID}
            key={bulletin.bulletinID}
            className={
              "bulletin-list-item" +
              (bulletin.bulletinID === region ? " selected" : "")
            }
          >
            {
              <BulletinReport
                bulletin={bulletin}
                bulletin170000={bulletin170000}
                date={date}
              />
            }
          </li>
        ))}
      </ul>
    </section>
  );
}

export default BulletinList;
