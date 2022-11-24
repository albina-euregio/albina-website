import { Util } from "leaflet";
import React from "react";
import { BULLETIN_STORE } from "../../stores/bulletinStore";
import { getPublicationTimeString, parseDateSeconds } from "../../util/date.js";

function BulletinAWMapStatic({
  date,
  region,
  onError,
  publicationTime,
  imgFormat
}) {
  const publicationDirectory =
    publicationTime && date > "2019-05-06"
      ? getPublicationTimeString(parseDateSeconds(publicationTime))
      : "";
  imgFormat ||= window.config.webp && date > "2020-12-01" ? ".webp" : ".jpg";
  const file =
    publicationTime && date > "2022-05-06" ? "EUREGIO_" + region : region;
  const url = Util.template(config.apis.bulletin.map, {
    date: date,
    publication: publicationDirectory,
    file: file,
    format: imgFormat
  });
  const regions = BULLETIN_STORE.bulletins[date]?.daytimeBulletins
    ?.find(element => element.id == region.split("_")[0])
    ?.forenoon?.regions?.map(elem => elem.name)
    ?.join(", ");
  return <img src={url} alt={regions} title={regions} onError={onError} />;
}

export default BulletinAWMapStatic;
