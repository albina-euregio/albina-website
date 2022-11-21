import React from "react";
import { observer } from "mobx-react";
import BulletinReport from "./bulletin-report";
import { BULLETIN_STORE } from "../../stores/bulletinStore";
import type { DaytimeBulletin } from "../../stores/bulletin/DaytimeBulletin";

type Props = { daytimeBulletins: DaytimeBulletin[] };

function BulletinList({ daytimeBulletins }: Props) {
  return (
    <section
      id="section-bulletin-reports"
      className="section-centered section-bulletin-reports"
    >
      <ul className="list-plain bulletin-list">
        {daytimeBulletins.map(daytimeBulletin => (
          <li
            id={daytimeBulletin.id}
            key={daytimeBulletin.id}
            className={
              "bulletin-list-item" +
              (daytimeBulletin.id === BULLETIN_STORE.settings.region
                ? " selected"
                : "")
            }
          >
            {
              <BulletinReport
                daytimeBulletin={daytimeBulletin}
                date={BULLETIN_STORE.settings.date}
              />
            }
          </li>
        ))}
      </ul>
    </section>
  );
}

export default observer(BulletinList);
