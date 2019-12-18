import React from "react";
import { observer } from "mobx-react";
import BulletinReport from "./bulletin-report";

@observer
export default class BulletinList extends React.Component {
  constructor(props) {
    super(props);
  }

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
