import { NgModule } from '@angular/core';

import { BulletinsComponent } from './bulletins.component';

// Bulletins Routing
import { BulletinsRoutingModule } from './bulletins-routing.module';

@NgModule({
  imports: [
    BulletinsRoutingModule
  ],
  declarations: [
    BulletinsComponent
  ]
})
export class BulletinsModule { }
