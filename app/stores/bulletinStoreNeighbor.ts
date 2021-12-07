import { decodeFeatureCollection } from "../util/polyline";
import { warnlevelNumbers } from "../util/warn-levels";
import { Bulletin, Bulletins } from "./bulletin/CaamlBulletin2022";
import { MicroRegionElevationProperties } from "./bulletin";

type Properties = MicroRegionElevationProperties & { style: L.PathOptions };
type Feature = GeoJSON.Feature<GeoJSON.Geometry, Properties>;
type FeatureCollection = GeoJSON.FeatureCollection<
  GeoJSON.Geometry,
  Properties
>;

async function loadRegions(region: string): Promise<FeatureCollection> {
  const polyline = import(
    `./micro-regions_elevation/${region}_micro-regions_elevation.polyline.json`
  );
  const regions = decodeFeatureCollection((await polyline).default);
  return regions;
}

async function loadBulletin(date: string, region: string): Promise<Bulletin[]> {
  try {
    const url = `https://avalanche.report/albina_neighbors.2022/${date}-${region}.json`;
    const res = await fetch(url);
    if (res.ok) {
      const json: Bulletins = await res.json();
      return json.bulletins;
    }
  } catch (ignore) {}
  return [];
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
    "IT-AINEVA",
    "SI"
  ];
  const allBulletins = await Promise.all(
    regions.map(async region => {
      const regions$ = loadRegions(region);
      const bulletins$ = loadBulletin(date, region);
      const regions = await regions$;
      const bulletins = await bulletins$;
      return regions.features
        .map(feature => augmentNeighborFeature(feature, bulletins))
        .filter(feature => feature?.properties?.style);
    })
  );
  return allBulletins.flat();
}

export async function loadNeighborBulletins(
  date: string
): Promise<FeatureCollection> {
  if (typeof date !== "string") return;
  const bulletins = await loadBulletins(date);

  return Object.freeze({
    type: "FeatureCollection",
    name: `neighbor_bulletins_${date}`,
    features: bulletins
  });
}

const WARNLEVEL_COLORS = [
  undefined,
  "#ccff66",
  "#ffff00",
  "#ff9900",
  "#ff0000",
  "#ff0000"
];

function augmentNeighborFeature(
  feature: Feature,
  bulletins: Bulletin[]
): Feature | undefined {
  if (feature.properties.id.match(window.config.regionsRegex)) {
    // exclude ALBINA regions
    return;
  }
  const region = feature.properties.id;
  const elevation = feature.properties.elevation;
  bulletins = bulletins.filter(bulletin =>
    bulletin.regions?.map(r => r.regionID)?.includes(region)
  );
  const dangerRatings = bulletins.flatMap(b => b.dangerRatings);
  const warnlevel = dangerRatings
    ?.filter(
      danger =>
        region.match(/^CH-/) ||
        region.match(/^IT-21/) ||
        region.match(/^IT-23/) ||
        region.match(/^IT-25/) ||
        region.match(/^IT-25/) ||
        region.match(/^IT-34/) ||
        region.match(/^IT-36/) ||
        region.match(/^IT-57/) ||
        region.match(/^FR-/) ||
        (!danger.elevation.upperBound && !danger.elevation.lowerBound) ||
        (danger.elevation.upperBound && elevation === "low") ||
        (danger.elevation.lowerBound && elevation === "high")
    )
    .map(danger => warnlevelNumbers[danger.mainValue])
    .reduce((w1, w2) => Math.max(w1, w2), 0);
  if (!warnlevel) return;
  feature.properties.style = {
    stroke: false,
    fillColor: WARNLEVEL_COLORS[warnlevel],
    fillOpacity: 0.5,
    className: "mix-blend-mode-multiply"
  };
  return feature;
}
