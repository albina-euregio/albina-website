import { Injectable } from '@angular/core';

import { RegionsTI } from '../../regions/regions.ti';
import { RegionsTN } from '../../regions/regions.tn';
import { RegionsBZ } from '../../regions/regions.bz';
import { RegionsEuregio } from '../../regions/regions.euregio';

@Injectable()
export class RegionsService {

  constructor()
  {
  }

  getRegionsTyrol() {
    return RegionsTI;
  }

  getRegionsSouthTyrol() {
    return RegionsBZ;
  }

  getRegionsTrentino() {
    return RegionsTN;
  }

  getRegionsEuregio() {
    return RegionsEuregio;
  }
}

