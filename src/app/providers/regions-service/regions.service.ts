import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { ConstantsService } from '../constants-service/constants.service';
import { Observable } from 'rxjs/Observable';
import { RegionModel } from '../../models/region.model';


@Injectable()
export class RegionsService {

  constantsService: ConstantsService;

  private regionsTyrol: RegionModel[];
  private regionsSouthTyrol: RegionModel[];
  private regionsTrentino: RegionModel[];

  constructor(
    public http: Http,
    public constants: ConstantsService)
  {
    this.constantsService = constants;
    this.regionsTyrol = new Array<RegionModel>();
    this.regionsSouthTyrol = new Array<RegionModel>();
    this.regionsTrentino = new Array<RegionModel>();

    this.getRegions("AT-07").subscribe(
      data => {
        for (let region of data.json()) {
          this.regionsTyrol.push(RegionModel.createFromJson(region));
        }
      },
      error => {
        // TODO implement
      }
    );

    this.getRegions("IT-32-TN").subscribe(
      data => {
        for (let region of data.json()) {
          this.regionsTrentino.push(RegionModel.createFromJson(region));
        }
      },
      error => {
        // TODO implement
      }
    );

    this.getRegions("IT-32-BZ").subscribe(
      data => {
        for (let region of data.json()) {
          this.regionsSouthTyrol.push(RegionModel.createFromJson(region));
        }
      },
      error => {
        // TODO implement
      }
    );
  }

  private getRegions(regionId) : Observable<Response> {
    let url = this.constantsService.getServerUrl() + 'regions?regionsId=' + regionId;
    console.log(url);
    let headers = new Headers({
      'Content-Type': 'application/json'});
    let options = new RequestOptions({ headers: headers });

    return this.http.get(url, options);
  }

  getRegionsTyrol() {
    return this.regionsTyrol;
  }

  getRegionsSouthTyrol() {
    return this.regionsSouthTyrol;
  }

  getRegionsTrentino() {
    return this.regionsTrentino;
  }
}

