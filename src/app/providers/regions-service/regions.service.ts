import { Injectable } from '@angular/core';

import { RegionsEuregio } from '../../regions/regions.euregio';

@Injectable()
export class RegionsService {

  constructor()
  {
  }

  getRegionsEuregio() {
    return RegionsEuregio;
  }
}

