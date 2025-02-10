import type { LatLngExpression } from "leaflet";
import { fetchJSON } from "../util/fetch";

export interface SnowProfile {
  $date: Date;
  $color: string;
  $img: string;
  $url: never;
  $latlng: LatLngExpression;
  $tooltip: string;
  id: number;
  href: string;
  caaml: string;
  date: string;
  reported: {
    date: string;
  };
  location: Location;
}

export interface Location {
  name: string;
  longitude: number;
  latitude: number;
  aspect?: Aspect;
  country: Country;
  region: Country;
  subregion: Country;
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

export default class SnowProfileStore {
  profiles: SnowProfile[] = [];
  activeProfile: SnowProfile | undefined;

  async load() {
    const url =
      "https://admin.avalanche.report/lawis/public/profile?startDate=" +
      new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const profiles: SnowProfile[] = await fetchJSON(url, {});
    profiles.forEach(profile => {
      const $date = new Date(profile.date);
      const days = (Date.now() - $date.getTime()) / (24 * 60 * 60 * 1000);
      const opacity = Math.max(0.3, 1.0 - 0.1 * days);
      const $color = `rgba(25, 171, 255, ${opacity})`;
      this.profiles.push({
        ...profile,
        $date,
        $color,
        $img: `https://lawis.at/lawis_api/normalizer/files/profiles/snowprofile_${profile.id}.png`,
        $latlng: [profile.location.latitude, profile.location.longitude],
        $tooltip: `${$date}: ${profile.location.name}`
      });
    });
  }
}
