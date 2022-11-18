import { TypeVisitor } from "@angular/compiler";

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
    name: string;
}

export interface markers {
    [key: string]: {
        coordinates: coordinates;
        names: string[];
    }
}

export interface MarkerData {
    data: markers;
    coordinates: coordinates[];
    load: (marker: marker) => void;
    add: (marker: marker) => void;
    getFilenames: (coordinates: coordinates) => string[];
    save: () => void;
}
