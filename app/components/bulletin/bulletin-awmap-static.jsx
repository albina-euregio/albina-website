import React from "react";
import { inject } from "mobx-react";
import { injectIntl } from "react-intl";

/**
 * @typedef {object} Props
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
    const imgFormat =
      window.config.webp && this.props.date > "2020-12-01" ? ".webp" : ".jpg";
    const url =
      window.config.apis.geo +
      this.props.date +
      "/" +
      this.props.region + // possibly contains _PM
      imgFormat;

    return (
      <img
        src={url}
        alt={this.props.intl.formatMessage({
          id: "bulletin:report:selected-region:alt"
        })}
        onError={this.props.onError}
      />
    );
  }
}

export default inject("locale")(injectIntl(BulletinAWMapStatic));
