import { Injectable } from '@angular/core';

import { RegionsEuregio } from '../../regions/regions.euregio';
import { RegionsTrentino } from '../../regions/regions.tn';
import { RegionsEuregioElevation } from '../../regions/regions-elevation.euregio';

@Injectable()
export class RegionsService {

  constructor()
  {
  }

  getRegionsEuregio() {
    return RegionsEuregio;
  }

  getRegionsEuregioWithElevation() {
  	return RegionsEuregioElevation;
  }

  getRegionsTrentino() {
  	return RegionsTrentino;
  }
}

