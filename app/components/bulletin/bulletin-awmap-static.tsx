import React, { type ReactEventHandler } from "react";
import type { Bulletin, ValidTimePeriod } from "../../stores/bulletin";
import { useStore } from "@nanostores/react";
import { $province } from "../../appStore";

interface Props {
  validTimePeriod?: ValidTimePeriod;
  bulletin?: Bulletin;
  date: Temporal.PlainDate;
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
  const province = useStore($province);
  const publicationTime = bulletin?.publicationTime;
  const publicationDirectory = publicationTime
    ? publicationTime
        .replace(/T/, "_")
        .replace(/:/g, "-")
        .slice(0, "2021-12-04_16-00-00".length)
    : "";
  let filePrefix = publicationTime ? `${province || "EUREGIO"}_` : "";
  const fileSuffix = validTimePeriod === "later" ? "_PM" : "";
  const file = filePrefix + region + fileSuffix;
  let url = config.template(config.apis.bulletin.map, {
    date,
    publication: publicationDirectory,
    file
  });
  const providerCustomData = bulletin?.source?.provider?.customData as
    | { url?: string; regionID?: string }
    | undefined;
  if (
    providerCustomData?.url &&
    !bulletin?.regions?.some(r => r.regionID.match(config.extraRegions))
  ) {
    filePrefix = providerCustomData.regionID ?? "";
    url = new URL(
      `${filePrefix}_${region}${fileSuffix}.jpg`,
      providerCustomData.url
    ).toString();
  } else if (imgFormat || date.toString() <= "2022-05-06") {
    url = url.replace(/.webp$/, imgFormat || ".jpg");
  }
  const regions = bulletin?.regions?.map(elem => elem.name)?.join(", ");
  return <img src={url} alt={regions} title={regions} onError={onError} />;
}

export default BulletinAWMapStatic;
