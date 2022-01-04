import { Util } from "leaflet";
import { decodeFeatureCollection } from "../util/polyline";
import { WarnLevelNumber, WARNLEVEL_COLORS } from "../util/warn-levels";
import { MicroRegionElevationProperties } from "./bulletin";

type Properties = MicroRegionElevationProperties & { style: L.PathOptions };
type Feature = GeoJSON.Feature<GeoJSON.Geometry, Properties>;
type FeatureCollection = GeoJSON.FeatureCollection<
  GeoJSON.Geometry,
  Properties
>;

type RegionID = string;
type Elevation = "low" | "high";

export interface DangerRatings {
  maxDangerRatings: Record<`${RegionID}:${Elevation}`, WarnLevelNumber>;
}

async function loadRegions(region: string): Promise<FeatureCollection> {
  const polyline = import(
    `./micro-regions_elevation/${region}_micro-regions_elevation.polyline.json`
  );
  const regions = decodeFeatureCollection((await polyline).default);
  return regions;
}

async function loadBulletin(
  date: string,
  region: string
): Promise<DangerRatings> {
  try {
    const url = Util.template(config.apis.bulletin.eaws, { date, region });
    const res = await fetch(url);
    if (res.ok) {
      return await res.json();
    }
  } catch (ignore) {}
  return { maxDangerRatings: {} };
}

async function loadBulletins(date: string): Promise<Feature[]> {
  const regions = [
    "AT-02",
    "AT-03",
    "AT-04",
    "AT-05",
    "AT-06",
    "AT-08",
    "CH",
    "DE-BY",
    "FR",
    "IT-21",
    "IT-23",
    "IT-25",
    "IT-34",
    "IT-36",
    "IT-57",
    "SI"
  ];
  const allBulletins = await Promise.all(
    regions.map(async region => {
      const regions$ = loadRegions(region);
      const bulletins$ = loadBulletin(date, region);
      const regions = await regions$;
      const bulletins = await bulletins$;
      return regions.features
        .map(feature => augmentFeature(feature, bulletins))
        .filter(feature => feature?.properties?.style);
    })
  );
  return allBulletins.flat();
}

export async function loadEawsBulletins(
  date: string
): Promise<FeatureCollection> {
  if (typeof date !== "string") return;
  const bulletins = await loadBulletins(date);

  return Object.freeze({
    type: "FeatureCollection",
    name: `eaws_bulletins_${date}`,
    features: bulletins
  });
}

function augmentFeature(
  feature: Feature,
  bulletins: DangerRatings
): Feature | undefined {
  const region: RegionID = feature.properties.id;
  const elevation: Elevation = feature.properties.elevation;
  const warnlevel = bulletins?.maxDangerRatings?.[`${region}:${elevation}`];
  if (!warnlevel) return;
  feature.properties.style = {
    stroke: false,
    fillColor: WARNLEVEL_COLORS[warnlevel],
    fillOpacity: 0.5,
    className: "mix-blend-mode-multiply"
  };
  return feature;
}
