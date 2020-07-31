import React from "react";
import { observer } from "mobx-react";
import BulletinReport from "./bulletin-report";

/**
 * @typedef {object} Props
 * @prop {Albina.DaytimeBulletin[]} daytimeBulletins
 * @prop {import("../../stores/bulletinStore").BulletinStore} store
 *
 * @extends {React.Component<Props>}
 */
@observer
export default class BulletinList extends React.Component {
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
                (daytimeBulletin.id === this.props.store.settings.region
                  ? " selected"
                  : "")
              }
            >
              {
                <BulletinReport
                  daytimeBulletin={daytimeBulletin}
                  date={this.props.store.settings.date}
                />
              }
            </li>
          ))}
        </ul>
      </section>
    );
  }
}
