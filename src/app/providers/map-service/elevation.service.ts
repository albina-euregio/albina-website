import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";

interface Request {
  Koordinate: string;
  CRS: number;
  name: "hoehenservice";
}

interface Response {
  abfragestatus:
    | "erfolgreich"
    | "Die Abfrage-Koordinaten befinden sich nicht in Österreich.";
  abfragekoordinaten: {
    rechtswert: number;
    hochwert: number;
    CRS: number;
  };
  hoeheDTM: number;
  hoeheDSM: number;
  einheit: string;
  datengrundlage: string;
  flugjahr: string;
  voibos: string;
}

@Injectable()
export class ElevationService {
  private CRS = 4326;
  private url = "https://voibos.rechenraum.com/voibos/voibos";

  constructor(public http: HttpClient) {}

  getHeight(lat: number, lng: number): Observable<number> {
    const params = {
      Koordinate: `${lng},${lat}`,
      CRS: this.CRS,
      name: "hoehenservice",
    };

    return this.http.get<Response>(this.url, { params }).pipe(
      map((res: Response) => {
        if (res.abfragestatus !== "erfolgreich") return;

        const elevation = Math.round(res.hoeheDTM);
        return elevation;
      })
    );
  }
}
