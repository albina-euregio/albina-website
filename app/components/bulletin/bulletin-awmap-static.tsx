import React, { type ReactEventHandler } from "react";
import { Bulletin, ValidTimePeriod } from "../../stores/bulletin";

interface Props {
  validTimePeriod?: ValidTimePeriod;
  bulletin?: Bulletin;
  date: string;
  region: string;
  onError?: ReactEventHandler<HTMLImageElement>;
  imgFormat?: string;
}

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
  const filePrefix = publicationTime ? "EUREGIO_" : "";
  const fileSuffix = validTimePeriod === "later" ? "_PM" : "";
  const file = filePrefix + region + fileSuffix;
  let url = config.template(config.apis.bulletin.map, {
    date: date,
    publication: publicationDirectory,
    file: file
  });
  if (imgFormat || date <= "2022-05-06") {
    url = url.replace(/.webp$/, imgFormat || ".jpg");
  }
  const regions = bulletin?.regions?.map(elem => elem.name)?.join(", ");
  return <img src={url} alt={regions} title={regions} onError={onError} />;
}

export default BulletinAWMapStatic;
