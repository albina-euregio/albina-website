// https://stackoverflow.com/q/31790344
// https://github.com/substack/point-in-polygon/blob/master/index.js
export function isMarkerInsidePolygon(ll: L.LatLng, polygon: L.Polygon): boolean {
  let inside = false;
  const { lat: x, lng: y } = ll;
  const points = polygon.getLatLngs() as L.LatLng[][];
  for (const ring of points) {
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const { lat: xi, lng: yi } = ring[i];
      const { lat: xj, lng: yj } = ring[j];
      const intersect = yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
      if (intersect) {
        inside = !inside;
      }
    }
  }
  return inside;
}