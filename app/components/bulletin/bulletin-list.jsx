import React from "react";
import { observer } from "mobx-react";
import BulletinReport from "./bulletin-report";

/**
 * @typedef {object} Props
 * @prop {import("../../stores/bulletinStore").BulletinCollection} bulletinCollection
 * @prop {import("../../stores/bulletinStore").BulletinStore} store
 *
 * @extends {React.Component<Props>}
 */
@observer
export default class BulletinList extends React.Component {
  constructor(props) {
    super(props);
  }

  /**
   * @returns {Bulletin.Bulletin[]} bulletin
   */
  get bulletins() {
    return this.props.bulletinCollection.getData();
  }

  render() {
    return (
      <section
        id="section-bulletin-reports"
        className="section-centered section-bulletin-reports"
      >
        <ul className="list-plain bulletin-list">
          {this.bulletins.map(bulletin => (
            <li
              id={bulletin.id}
              key={bulletin.id}
              className={
                "bulletin-list-item" +
                (bulletin.id === this.props.store.settings.region
                  ? " selected"
                  : "")
              }
            >
              {
                <BulletinReport
                  bulletin={bulletin}
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
