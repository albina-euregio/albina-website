import { Util } from "leaflet";
import React from "react";
import { injectIntl } from "react-intl";
import { BULLETIN_STORE } from "../../stores/bulletinStore";
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
        ? getPublicationTimeString(parseDateSeconds(publicationTime))
        : "";
    const imgFormat =
      window.config.webp && this.props.date > "2020-12-01" ? ".webp" : ".jpg";
    const url = Util.template(config.apis.bulletin.map, {
      date: this.props.date,
      publication: publicationDirectory,
      file: "EUREGIO" + this.props.region, // possibly contains _PM
      format: imgFormat
    });
    const regions = BULLETIN_STORE.bulletins[this.props.date]?.daytimeBulletins
      ?.find(element => element.id == this.props.region.split("_")[0])
      ?.forenoon?.regions?.map(elem => elem.name)
      ?.join(", ");
    return (
      <img
        src={url}
        alt={regions}
        title={regions}
        onError={this.props.onError}
      />
    );
  }
}

export default injectIntl(BulletinAWMapStatic);
