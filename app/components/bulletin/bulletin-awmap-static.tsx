import React, { type ReactEventHandler } from "react";
import { Bulletin, ValidTimePeriod } from "../../stores/bulletin";

type Props = {
  validTimePeriod?: ValidTimePeriod;
  bulletin?: Bulletin;
  date: string;
  region: string;
  onError?: ReactEventHandler<HTMLImageElement>;
  imgFormat?: string;
};

function BulletinAWMapStatic({
  validTimePeriod,
  bulletin,
  date,
  region,
  onError,
  imgFormat
}: Props) {
  const publicationTime = bulletin?.publicationTime;
  const publicationDirectory =
    publicationTime && date > "2019-05-06"
      ? publicationTime
          .replace(/T/, "_")
          .replace(/:/g, "-")
          .slice(0, "2021-12-04_16-00-00".length)
      : "";
  imgFormat ||= window.config.webp && date > "2020-12-01" ? ".webp" : ".jpg";
  const filePrefix = publicationTime && date > "2022-05-06" ? "EUREGIO_" : "";
  const fileSuffix = validTimePeriod === "later" ? "_PM" : "";
  const file = filePrefix + region + fileSuffix;
  const url = config.template(config.apis.bulletin.map, {
    date: date,
    publication: publicationDirectory,
    file: file,
    format: imgFormat
  });
  const regions = bulletin?.regions?.map(elem => elem.name)?.join(", ");
  return <img src={url} alt={regions} title={regions} onError={onError} />;
}

export default BulletinAWMapStatic;
