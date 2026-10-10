import type { LngLatBounds } from "maplibre-gl";

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

/** An overlay grid in EPSG:31287, as stated by the live config.json. */
export interface AustriaLambertGrid {
  /** Extent in EPSG:31287, as min x, min y, max x, max y. */
  lambert: [number, number, number, number];
  /** WGS84 envelope, i.e. the extent of the reprojected images. */
  bbox: LngLatBounds;
}

/**
 * Whether an overlay image covers the Austria Lambert grid — told apart from
 * the older Web Mercator images by its aspect ratio, as images of either kind
 * keep being published side by side (and the GIFs at twice the resolution).
 */
export function isAustriaLambertImage(
  width: number,
  height: number,
  grid: AustriaLambertGrid
): boolean {
  const [minX, minY, maxX, maxY] = grid.lambert;
  const gridAspect = (maxX - minX) / (maxY - minY);
  return Math.abs(width / height - gridAspect) < 0.01;
}

/**
 * Position of a WGS84 coordinate within the overlay grid, normalized to
 * [0, 1] from the top left corner, or null outside of it.
 */
export function austriaLambertGridFraction(
  lng: number,
  lat: number,
  grid: AustriaLambertGrid
): [number, number] | null {
  const [x, y] = toAustriaLambert(lng, lat);
  const [minX, minY, maxX, maxY] = grid.lambert;
  const fx = (x - minX) / (maxX - minX);
  const fy = (maxY - y) / (maxY - minY);
  if (fx < 0 || fx >= 1 || fy < 0 || fy >= 1) return null;
  return [fx, fy];
}

const R = 6378137; // Web Mercator sphere
const mercatorY = (lat: number) =>
  R * Math.log(Math.tan(Math.PI / 4 + rad(lat) / 2));

/** Mapping from Web Mercator output pixels to source pixels. */
export interface AustriaLambertReprojection {
  width: number;
  height: number;
  /** Per output pixel the byte offset of its source pixel, or -1 outside. */
  sourceOffsets: Int32Array;
}

let cachedReprojection:
  | { key: string; reprojection: AustriaLambertReprojection }
  | undefined;

/**
 * Maps the overlay grid (as a `srcW`×`srcH` image) to Web Mercator, covering
 * `grid.bbox` — nearest neighbour, so colors stay exact. The mapping is the
 * same for every image of a grid, so the last one is cached.
 */
export function austriaLambertReprojection(
  srcW: number,
  srcH: number,
  grid: AustriaLambertGrid
): AustriaLambertReprojection {
  const { bbox } = grid;
  const [west, south, east, north] = [
    bbox.getWest(),
    bbox.getSouth(),
    bbox.getEast(),
    bbox.getNorth()
  ];
  const key = [srcW, srcH, ...grid.lambert, west, south, east, north].join();
  if (cachedReprojection?.key === key) return cachedReprojection.reprojection;

  const top = mercatorY(north);
  const bottom = mercatorY(south);
  // Keep the source resolution: a grid cell spans 1/cos(lat) as much in Web
  // Mercator, taken at the grid's central latitude.
  const cellSize =
    (grid.lambert[2] - grid.lambert[0]) / srcW / Math.cos(rad(LAT_0));
  const width = Math.round((R * rad(east - west)) / cellSize);
  const height = Math.round((top - bottom) / cellSize);
  const sourceOffsets = new Int32Array(width * height).fill(-1);
  const [minX, minY, maxX, maxY] = grid.lambert;

  // toAustriaLambert, split into its latitude (per row) and longitude (per
  // column) parts.
  const sinTheta = new Float64Array(width);
  const cosTheta = new Float64Array(width);
  for (let i = 0; i < width; i++) {
    const lng = west + ((i + 0.5) / width) * (east - west);
    const theta = N * rad(lng - LNG_0);
    sinTheta[i] = Math.sin(theta);
    cosTheta[i] = Math.cos(theta);
  }

  for (let j = 0; j < height; j++) {
    const y = top - ((j + 0.5) / height) * (top - bottom);
    const lat = (Math.atan(Math.sinh(y / R)) * 180) / Math.PI;
    const rho = AF * Math.pow(t(rad(lat)), N);
    for (let i = 0; i < width; i++) {
      const fx = (X_0 + rho * sinTheta[i] - minX) / (maxX - minX);
      const fy = (maxY - (Y_0 + RHO_0 - rho * cosTheta[i])) / (maxY - minY);
      if (fx < 0 || fx >= 1 || fy < 0 || fy >= 1) continue;
      sourceOffsets[j * width + i] =
        (Math.floor(fy * srcH) * srcW + Math.floor(fx * srcW)) * 4;
    }
  }

  const reprojection = { width, height, sourceOffsets };
  cachedReprojection = { key, reprojection };
  return reprojection;
}

/** Reprojects an image of the overlay grid to Web Mercator, see above. */
export function reprojectAustriaLambertImage(
  image: HTMLImageElement,
  grid: AustriaLambertGrid
): ImageData {
  const srcW = image.naturalWidth;
  const srcH = image.naturalHeight;
  const srcCanvas = new OffscreenCanvas(srcW, srcH);
  const srcCtx = srcCanvas.getContext("2d");
  if (!srcCtx) throw new Error("Canvas 2d context unavailable");
  srcCtx.drawImage(image, 0, 0);
  const src = srcCtx.getImageData(0, 0, srcW, srcH).data;

  const { width, height, sourceOffsets } = austriaLambertReprojection(
    srcW,
    srcH,
    grid
  );
  const out = new ImageData(width, height);
  for (let p = 0; p < sourceOffsets.length; p++) {
    const s = sourceOffsets[p];
    if (s < 0) continue;
    const o = p * 4;
    out.data[o] = src[s];
    out.data[o + 1] = src[s + 1];
    out.data[o + 2] = src[s + 2];
    out.data[o + 3] = src[s + 3];
  }
  return out;
}
