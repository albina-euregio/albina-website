import { Util } from "leaflet";
import React from "react";
import { Bulletin } from "../../stores/bulletin";
import { getPublicationTimeString, parseDateSeconds } from "../../util/date.js";

type Props = {
  bulletin: Bulletin;
  date: string;
  region: string;
  onError: any;
  imgFormat: string;
  publicationTime: string;
};

function BulletinAWMapStatic({
  bulletin,
  date,
  region,
  onError,
  imgFormat,
  publicationTime
}: Props) {
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
  const regions = bulletin?.regions?.map(elem => elem.name)?.join(", ");
  return <img src={url} alt={regions} title={regions} onError={onError} />;
}

export default BulletinAWMapStatic;
