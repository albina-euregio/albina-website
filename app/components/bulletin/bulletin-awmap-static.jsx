import React from "react";
import { injectIntl } from "react-intl";
import { getPublicationTimeString, parseDateSeconds } from "../../util/date.js";

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
    const { publicationTime } = this.props;
    const publicationDirectory =
      publicationTime && this.props.date > "2019-05-06"
        ? getPublicationTimeString(parseDateSeconds(publicationTime)) + "/"
        : "";
    const imgFormat =
      window.config.webp && this.props.date > "2020-12-01" ? ".webp" : ".jpg";
    const url =
      window.config.apis.geo +
      this.props.date +
      "/" +
      publicationDirectory +
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

export default injectIntl(BulletinAWMapStatic);
