import { Injectable } from '@angular/core';
import { RegionModel } from '../../models/region.model';
import { RegionsTN } from '../../mock/regions.tn';

@Injectable()
export class RegionsService {

  private regionsTrentino: RegionModel[];

  constructor()
  {
  	this.regionsTrentino = new Array<RegionModel>();

  	let regions = RegionsTN.features;

  	for (let i = regions.length - 1; i >= 0; i--) {
  		this.regionsTrentino.push(RegionModel.createFromJson(regions[i]));
  	}
  }

  getRegionsTrentino() {
    return RegionsTN.features;
  }
}

