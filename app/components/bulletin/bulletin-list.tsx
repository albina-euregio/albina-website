import React from "react";
import { observer } from "mobx-react";
import BulletinReport from "./bulletin-report";
import { BULLETIN_STORE } from "../../stores/bulletinStore";
import type { Bulletin } from "../../stores/bulletin";

type Props = { bulletins: Bulletin[] };

function BulletinList({ bulletins }: Props) {
  return (
    <section
      id="section-bulletin-reports"
      className="section-centered section-bulletin-reports"
    >
      <ul className="list-plain bulletin-list">
        {bulletins.map(bulletin => (
          <li
            id={bulletin.bulletinID}
            key={bulletin.bulletinID}
            className={
              "bulletin-list-item" +
              (bulletin.bulletinID === BULLETIN_STORE.settings.region
                ? " selected"
                : "")
            }
          >
            {
              <BulletinReport
                bulletin={bulletin}
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
