import React from "react";
import { inject } from "mobx-react";
import { injectIntl } from "react-intl";

/**
 * @typedef {object} Props
 * @prop {Bulletin.Bulletin} bulletin
 * @prop {*} ampm
 * @prop {*} date
 * @prop {*} region
 *
 * @extends {React.Component<Props>}
 */
class BulletinAWMapStatic extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const url =
      window.config.apis.geo +
      this.props.date +
      "/" +
      this.props.region +
      (this.props.bulletin.hasDaytimeDependency && this.props.ampm == "pm"
        ? "_PM"
        : "") +
      ".jpg";

    return (
      <img
        src={url}
        alt={this.props.intl.formatMessage({
          id: "bulletin:report:selected-region:alt"
        })}
      />
    );
  }
}

export default inject("locale")(injectIntl(BulletinAWMapStatic));
