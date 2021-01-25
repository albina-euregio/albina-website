export interface Natlefs {
  snowConditions?: string[];
  driftingSnow: string;
  author: Author;
  penetrationDepth?: string;
  rode?: string[];
  alarmSigns?: string;
  tracks: string;
  avoided?: string[];
  datetime: Datetime;
  avalancheProblems?: string[];
  avalanches: string;
  newSnow: string;
  location: Location;
  surfaceSnowWetness?: string;
  ridingQuality?: string;
  comment?: string;
}

export interface Author {
  name: string;
}

export interface Datetime {
  date: Date;
  quality: string;
}

export interface Location {
  geo?: Geo;
  elevation?: number;
  aspect?: string;
  name: string;
  accuracy?: number;
  region?: string;
}

export interface Geo {
  latitude: number;
  longitude: number;
}
