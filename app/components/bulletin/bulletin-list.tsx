import React from "react";
import { observer } from "mobx-react";
import BulletinReport from "./bulletin-report";
import { BULLETIN_STORE } from "../../stores/bulletinStore";

export class BulletinList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <section
        id="section-bulletin-reports"
        className="section-centered section-bulletin-reports"
      >
        <ul className="list-plain bulletin-list">
          {this.props.daytimeBulletins.map(daytimeBulletin => (
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
}

export default observer(BulletinList);
