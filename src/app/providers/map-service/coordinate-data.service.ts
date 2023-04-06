//implement a service which returns the height, aspect name and angle of two coordinates using plane.model.ts

import { Injectable } from "@angular/core";
import { ElevationService } from "../map-service/elevation.service";
import { Observable } from "rxjs";

interface Point {
  lat: number;
  lng: number;
  elevation: number;
}

export interface PlaneData {
  height: number;
  aspect: string;
  slope: number;
}

export interface Plane {
  EARTH_RADIUS: number;
  ASPECTS: string[];
  lat: number;
  lng: number;

  getCoordData(lat: number, lng: number): Observable<PlaneData>;
}

@Injectable()
export class CoordinateDataService implements Plane {
  public EARTH_RADIUS = 6371000;
  public ASPECTS = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  public lat: number;
  public lng: number;

  private p1: Point;
  private p2: Point;
  private p3: Point;

  constructor(private elevationService: ElevationService) {}

  //public function to set coordinates, fetch height for each point, return aspectName and angle of plane
  public getCoordData(lat: number, lng: number): Observable<PlaneData> {
    this.setCoordinates(lat, lng);

    const p1Elevation = this.elevationService.getElevation(
      this.p1.lat,
      this.p1.lng
    );

    const p2Elevation = this.elevationService.getElevation(
      this.p2.lat,
      this.p2.lng
    );

    const p3Elevation = this.elevationService.getElevation(
      this.p3.lat,
      this.p3.lng
    );

    return new Observable((observer) => {
      p1Elevation.subscribe((elevation) => {
        this.p1.elevation = elevation;
        p2Elevation.subscribe((elevation) => {
          this.p2.elevation = elevation;
          p3Elevation.subscribe((elevation) => {
            this.p3.elevation = elevation;

            observer.next({
              height: this.p1.elevation,
              aspect: this.getAspectName(),
              slope: this.getAngle(),
            });
          });
        });
      });
    });
  }

  private addMetersToCoords(lat: number, lng: number, d_lat = 0, d_lng = 0) {
    const new_lat = lat + (d_lat / this.EARTH_RADIUS) * (180 / Math.PI);
    const new_lng =
      lng +
      ((d_lng / this.EARTH_RADIUS) * (180 / Math.PI)) /
        Math.cos((lat * Math.PI) / 180);

    return { lat: new_lat, lng: new_lng };
  }

  private setCoordinates(lat: number, lng: number) {
    this.lat = lat;
    this.lng = lng;

    this.p1 = { lat, lng, elevation: 0 };
    const p2Coords = this.addMetersToCoords(lat, lng, 10, 0);
    this.p2 = { lat: p2Coords.lat, lng: p2Coords.lng, elevation: 0 };
    const p3Coords = this.addMetersToCoords(lat, lng, 0, 10);
    this.p3 = { lat: p3Coords.lat, lng: p3Coords.lng, elevation: 0 };
  }

  private subtractVectors(v1: number[], v2: number[]) {
    // v1 - v2
    const d_lat = (((v1[0] - v2[0]) * Math.PI) / 180) * this.EARTH_RADIUS;
    const d_lng =
      (((v1[1] - v2[1]) * Math.PI) / 180) *
      this.EARTH_RADIUS *
      Math.cos((((v1[0] + v2[0]) / 2) * Math.PI) / 180);

    return [d_lat, d_lng, v1[2] - v2[2]];
  }

  private crossProduct(v1: number[], v2: number[]) {
    // v1 x v2
    return [
      v1[1] * v2[2] - v1[2] * v2[1],
      v1[2] * v2[0] - v1[0] * v2[2],
      v1[0] * v2[1] - v1[1] * v2[0],
    ];
  }

  private getNormalVector() {
    const v1 = this.subtractVectors(
      [this.p1.lat, this.p1.lng, this.p1.elevation],
      [this.p2.lat, this.p2.lng, this.p2.elevation]
    );
    const v2 = this.subtractVectors(
      [this.p1.lat, this.p1.lng, this.p1.elevation],
      [this.p3.lat, this.p3.lng, this.p3.elevation]
    );

    const normalVector = this.crossProduct(v1, v2);
    if (normalVector[2] < 0) {
      normalVector[0] = -normalVector[0];
      normalVector[1] = -normalVector[1];
      normalVector[2] = -normalVector[2];
    }

    return normalVector;
  }

  private getVectorLength(v: number[]) {
    return Math.sqrt(v[0] * v[0] + v[1] * v[1] + v[2] * v[2]);
  }

  private normalizeVector(v: number[]) {
    const length = this.getVectorLength(v);
    return [v[0] / length, v[1] / length, v[2] / length];
  }

  private radToDeg(rad: number) {
    return (rad * 180) / Math.PI;
  }

  private getAngleBetweenVectors(v1: number[], v2: number[]) {
    const dotProduct = v1[0] * v2[0] + v1[1] * v2[1] + v1[2] * v2[2];
    const l1 = this.getVectorLength(v1);
    const l2 = this.getVectorLength(v2);
    const angle = Math.acos(dotProduct / (l1 * l2));

    return this.radToDeg(angle);
  }

  private getAspect(): number {
    const normalVector = this.getNormalVector();
    const normalizedNormalVector = this.normalizeVector(normalVector);

    const aspect = Math.atan2(
      normalizedNormalVector[1],
      normalizedNormalVector[0]
    );
    const aspectDeg = this.radToDeg(aspect);

    return aspectDeg;
  }

  private getAngle(): number {
    const normalVector = this.getNormalVector();
    const verticalVector = [0, 0, 1];
    const angle = this.getAngleBetweenVectors(verticalVector, normalVector);
    return angle;
  }

  private getAspectName(): string {
    const index = Math.floor(Math.abs(this.getAspect() / 45));
    return this.ASPECTS[index];
  }
}
