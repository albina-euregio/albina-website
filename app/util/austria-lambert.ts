import { LngLatBounds } from "maplibre-gl";

/**
 * MGI / Austria Lambert (EPSG:31287), the projection of the weather overlays
 * published since 2026-10-07. Lambert's parallels are curved, so an image in
 * it cannot be placed on a Web Mercator map by its four corners alone (that
 * is off by up to ~14 km); it is reprojected pixel by pixel instead.
 *
 * The MGI → WGS84 datum shift is ignored: it moves points by ~60 m, far below
 * the 1 km grid.
 */

const A = 6377397.155; // Bessel 1841
const F = 1 / 299.1528128;
const E = Math.sqrt(2 * F - F * F);
const LAT_0 = 47.5;
const LNG_0 = 13 + 1 / 3;
const LAT_1 = 49;
const LAT_2 = 46;
const X_0 = 400000;
const Y_0 = 400000;

const rad = (deg: number) => (deg * Math.PI) / 180;

function m(lat: number): number {
  const sin = Math.sin(lat);
  return Math.cos(lat) / Math.sqrt(1 - E * E * sin * sin);
}

function t(lat: number): number {
  const esin = E * Math.sin(lat);
  return (
    Math.tan(Math.PI / 4 - lat / 2) / Math.pow((1 - esin) / (1 + esin), E / 2)
  );
}

const N =
  (Math.log(m(rad(LAT_1))) - Math.log(m(rad(LAT_2)))) /
  (Math.log(t(rad(LAT_1))) - Math.log(t(rad(LAT_2))));
const AF = (A * m(rad(LAT_1))) / (N * Math.pow(t(rad(LAT_1)), N));
const RHO_0 = AF * Math.pow(t(rad(LAT_0)), N);

/** Projects WGS84 longitude/latitude to EPSG:31287 easting/northing. */
export function toAustriaLambert(lng: number, lat: number): [number, number] {
  const rho = AF * Math.pow(t(rad(lat)), N);
  const theta = N * rad(lng - LNG_0);
  return [X_0 + rho * Math.sin(theta), Y_0 + RHO_0 - rho * Math.cos(theta)];
}

/** The overlay grid: 1 km cells, 699 × 429. */
export const AUSTRIA_LAMBERT_GRID = {
  /** Extent in EPSG:31287. */
  minX: 20500,
  minY: 190500,
  maxX: 719500,
  maxY: 619500,
  /**
   * WGS84 envelope (min lng, min lat, max lng, max lat), i.e. the extent of
   * the reprojected images.
   */
  bbox: new LngLatBounds([8.10559, 45.50767, 17.74135, 49.47441])
} as const;

/**
 * Whether an overlay image covers the Austria Lambert grid — told apart from
 * the older Web Mercator images by its aspect ratio, as images of either kind
 * keep being published side by side (and the GIFs at twice the resolution).
 */
export function isAustriaLambertImage(width: number, height: number): boolean {
  const gridAspect =
    (AUSTRIA_LAMBERT_GRID.maxX - AUSTRIA_LAMBERT_GRID.minX) /
    (AUSTRIA_LAMBERT_GRID.maxY - AUSTRIA_LAMBERT_GRID.minY);
  return Math.abs(width / height - gridAspect) < 0.01;
}

/**
 * Position of a WGS84 coordinate within the overlay grid, normalized to
 * [0, 1] from the top left corner, or null outside of it.
 */
export function austriaLambertGridFraction(
  lng: number,
  lat: number
): [number, number] | null {
  const [x, y] = toAustriaLambert(lng, lat);
  const fx =
    (x - AUSTRIA_LAMBERT_GRID.minX) /
    (AUSTRIA_LAMBERT_GRID.maxX - AUSTRIA_LAMBERT_GRID.minX);
  const fy =
    (AUSTRIA_LAMBERT_GRID.maxY - y) /
    (AUSTRIA_LAMBERT_GRID.maxY - AUSTRIA_LAMBERT_GRID.minY);
  if (fx < 0 || fx >= 1 || fy < 0 || fy >= 1) return null;
  return [fx, fy];
}

const R = 6378137; // Web Mercator sphere
const mercatorY = (lat: number) =>
  R * Math.log(Math.tan(Math.PI / 4 + rad(lat) / 2));

/**
 * Reprojects an image of the overlay grid to Web Mercator, covering
 * `AUSTRIA_LAMBERT_GRID.bbox` — nearest neighbour, so colors stay exact. Pixels
 * outside the grid are transparent.
 */
export function reprojectAustriaLambertImage(
  image: HTMLImageElement
): ImageData {
  const srcW = image.naturalWidth;
  const srcH = image.naturalHeight;
  const srcCanvas = new OffscreenCanvas(srcW, srcH);
  const srcCtx = srcCanvas.getContext("2d");
  if (!srcCtx) throw new Error("Canvas 2d context unavailable");
  srcCtx.drawImage(image, 0, 0);
  const src = srcCtx.getImageData(0, 0, srcW, srcH).data;

  const { bbox } = AUSTRIA_LAMBERT_GRID;
  const [west, south, east, north] = [
    bbox.getWest(),
    bbox.getSouth(),
    bbox.getEast(),
    bbox.getNorth()
  ];
  const top = mercatorY(north);
  const bottom = mercatorY(south);
  // Keep the source resolution: a grid cell spans 1/cos(lat) as much in Web
  // Mercator, taken at the grid's central latitude.
  const cellSize =
    (AUSTRIA_LAMBERT_GRID.maxX - AUSTRIA_LAMBERT_GRID.minX) /
    srcW /
    Math.cos(rad(LAT_0));
  const outW = Math.round((R * rad(east - west)) / cellSize);
  const outH = Math.round((top - bottom) / cellSize);
  const out = new ImageData(outW, outH);

  for (let j = 0; j < outH; j++) {
    const y = top - ((j + 0.5) / outH) * (top - bottom);
    const lat = (Math.atan(Math.sinh(y / R)) * 180) / Math.PI;
    for (let i = 0; i < outW; i++) {
      const lng = west + ((i + 0.5) / outW) * (east - west);
      const fraction = austriaLambertGridFraction(lng, lat);
      if (!fraction) continue;
      const s =
        (Math.floor(fraction[1] * srcH) * srcW +
          Math.floor(fraction[0] * srcW)) *
        4;
      const o = (j * outW + i) * 4;
      out.data[o] = src[s];
      out.data[o + 1] = src[s + 1];
      out.data[o + 2] = src[s + 2];
      out.data[o + 3] = src[s + 3];
    }
  }
  return out;
}
