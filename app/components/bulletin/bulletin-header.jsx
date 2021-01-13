import React from "react";
import { computed } from "mobx";
import { observer } from "mobx-react";
import { injectIntl } from "react-intl";

import BulletinDateFlipper from "./bulletin-date-flipper.jsx";
import BulletinStatusLine from "./bulletin-status-line.jsx";
import { parseDate, dateToLongDateString } from "../../util/date.js";

/**
 * @typedef {object} Props
 * @prop {import("../../stores/bulletinStore").BulletinStore} store
 *
 * @extends {React.Component<Props>}
 */
@observer
class BulletinHeader extends React.Component {
  constructor(props) {
    super(props);
  }

  @computed get date() {
    return dateToLongDateString(parseDate(this.props.store.settings.date));
  }

  @computed get statusClass() {
    const status = this.props.store.settings.status;
    if (status === "pending") {
      return "loading";
    } else if (status === "n/a") {
      return "not-available";
    } else if (status === "empty") {
      return "no-data";
    } else {
      return "";
    }
  }

  render() {
    return (
      <section
        id="section-bulletin-header"
        className={`section-padding section-header section-bulletin-header bulletin-updated ${this.statusClass}`}
      >
        <header className="section-centered">
          <BulletinStatusLine
            store={this.props.store}
            status={this.props.store.settings.status}
          />
          {/* <h2 className="subheader">{this.props.title}</h2> */}
          <h1 className="bulletin-datetime-validity">{this.date}</h1>
          <BulletinDateFlipper
            date={this.props.store.settings.date}
            latest={this.props.store.latest}
          />
        </header>
      </section>
    );
  }
}
export default injectIntl(BulletinHeader);
