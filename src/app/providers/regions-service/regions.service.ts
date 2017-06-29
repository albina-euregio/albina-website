import { Injectable } from '@angular/core';

import { RegionsTN } from '../../regions/regions.tn';
import { RegionsEuregio } from '../../regions/regions.euregio';

@Injectable()
export class RegionsService {

  constructor()
  {
  }

  getRegionsTrentino() {
    return RegionsTN;
  }

  getRegionsEuregio() {
    return RegionsEuregio;
  }
}

