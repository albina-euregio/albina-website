import type { LatLngExpression } from "leaflet";
import { currentSeasonYear } from "../util/date-season";
import { fetchJSON } from "../util/fetch";

export interface Incident {
  $date: Date;
  $color: string;
  $img: never;
  $url: string;
  $latlng: LatLngExpression;
  $tooltip: string;
  id: number;
  href: string;
  caaml: string;
  date: string;
  danger: Danger;
  location: Location;
}

export interface Danger {
  rating: Rating;
}

export interface Rating {
  level: number | null;
}

export interface Location {
  name: string;
  longitude: number;
  latitude: number;
  aspect?: Aspect;
  country: Country;
  region: Aspect;
  subregion: Aspect;
  elevation?: number;
  slope_angle?: number;
}

export interface Aspect {
  id: number;
  text: "N" | "NE" | "E" | "SE" | "S" | "SW" | "W" | "NW";
}

export interface Country {
  id: number;
  code: string;
  text: string;
}

export default class IncidentStore {
  incidents: Incident[] = [];

  async load() {
    const startDate = new Date(currentSeasonYear(), 9, 1);
    const url =
      "https://admin.avalanche.report/lawis/public/incident?startDate=" +
      startDate;
    const incidents: Incident[] = await fetchJSON(url, {});
    incidents.forEach(incident => {
      const $date = new Date(incident.date);
      const days = (Date.now() - $date.getTime()) / (24 * 60 * 60 * 1000);
      const opacity = days < 3 ? 1.0 : days < 7 ? 0.7 : days < 14 ? 0.5 : 0.3;
      const $color = `rgba(25, 171, 255, ${opacity})`;
      this.incidents.push({
        ...incident,
        $date,
        $color,
        $url: `https://lawis.at/incident/#${incident.id}`,
        $latlng: [incident.location.latitude, incident.location.longitude],
        $tooltip: `${$date}: ${incident.location.name}`
      });
    });
  }
}
