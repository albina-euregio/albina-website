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

let loadedRegions: Promise<FeatureCollection> = undefined;

async function loadRegions(): Promise<FeatureCollection> {
  const polyline = import("./neighbor_micro_regions.polyline.json");
  const polylineExtra = import("./neighbor_regions.polyline.json");
  const regions = decodeFeatureCollection((await polyline).default);
  const extraRegions = decodeFeatureCollection((await polylineExtra).default);
  const extraFeatures = extraRegions.features.filter(
    feature => feature.id === "CH" || feature.id === "LI"
  );
  extraFeatures.forEach(
    feature => (feature.properties.id = feature.id as string)
  );
  regions.features.push(...extraFeatures);
  regions.features = regions.features.map(f => Object.freeze(f));
  return Object.freeze(regions);
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

async function loadBulletins(date: string): Promise<Bulletin[]> {
  const regions = [
    "AT-02",
    "AT-03",
    "AT-04",
    "AT-05",
    "AT-06",
    "AT-08",
    "BY",
    "CH",
    "IT-AINEVA",
    "SI"
  ];
  const allBulletins = await Promise.all(
    regions.map(region => loadBulletin(date, region))
  );
  allBulletins.flat().forEach(b => {
    // https://gitlab.com/albina-euregio/pyAvaCore/-/issues/20
    b.avalancheProblems ??= (b as any).avalancheProblem;
    b.dangerRatings ??= (b as any).dangerRating;
  });
  return allBulletins.flat();
}

export async function loadNeighborBulletins(
  date: string
): Promise<FeatureCollection> {
  if (typeof date !== "string") return;
  const bulletins = await loadBulletins(date);
  if (!loadedRegions) loadedRegions = loadRegions();
  const regions = await loadedRegions;

  return Object.freeze({
    ...regions,
    name: `neighbor_bulletins_${date}`,
    features: regions.features
      .filter(
        // exclude ALBINA regions
        feature => !feature.properties.id.match(window.config.regionsRegex)
      )
      .map(feature => augmentNeighborFeature(feature, bulletins))
      .filter(feature => feature?.properties?.style)
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
        !danger.elevation ||
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
