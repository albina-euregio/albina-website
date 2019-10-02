import React from "react";
import { observer, inject } from "mobx-react";
import { injectIntl, FormattedMessage } from "react-intl";

class BulletinAmPmSwitch extends React.Component {
  constructor(props) {
    super(props);
  }

  toggle(event) {
    const target = event.target;
    const value = target.checked ? "pm" : "am";
    if (window["bulletinStore"].settings.ampm != value) {
      window["bulletinStore"].setAmPm(value);
    }
  }

  render() {
    const title = this.props.intl.formatMessage({
      id:
        "bulletin:header:switch-to-" +
        (this.props.store.settings.ampm == "am" ? "pm" : "am")
    });
    const enabled = this.props.store.activeBulletinCollection
      ? this.props.store.activeBulletinCollection.hasDaytimeDependency() &&
        this.props.store.vectorRegions.length > 0
      : false;

    return (
      enabled && (
        <span className="bulletin-ampm-switch tooltip" title={title}>
          <div className="switch-text">
            <label htmlFor="switch">
              <input
                id="switch"
                type="checkbox"
                onChange={e => this.toggle(e)}
                checked={this.props.store.settings.ampm == "pm"}
              />
              <div className="slider">
                <FormattedMessage id={"bulletin:header:am"} />
                <FormattedMessage id={"bulletin:header:pm"} />
              </div>
            </label>
          </div>
        </span>
      )
    );
  }
}

export default inject("locale")(injectIntl(observer(BulletinAmPmSwitch)));
