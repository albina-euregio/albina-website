export interface coordinates {
    lat: number;
    lon: number;
}

export interface metadata {
    location: string;
    coords: coordinates;
    height: number;
    orog: number;
    date: Date;
    timezone: string;
    model: string;
    days: number
}

export interface parameters {
    [key: string]: {
        [key: string]: any;
    }
}

export interface data {
    metadata: metadata;
    parameters: parameters;
}

export interface QFA {
    data: data;
    coordinates: coordinates;
    height: number;
    metadata: metadata;
    parameters: parameters;
    loadFromURL: (url: string) => Promise<void>;
    listParameters(): string[];
}

export interface marker {
    coordinates: coordinates;
    filename: string;
}

export interface markers {
    [key: string]: {
        coordinates: coordinates;
        filenames: string[];
    }
}

export interface MarkerData {
    data: markers;
    coordinates: coordinates[];
    add: (marker: marker) => void;
    getFilenames: (coordinates: coordinates) => string[];
    save: () => void;
}
