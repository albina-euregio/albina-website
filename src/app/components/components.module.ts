import { NgModule } from '@angular/core';

import { BulletinsComponent } from './bulletins.component';

// Components Routing
import { ComponentsRoutingModule } from './components-routing.module';

@NgModule({
  imports: [
    ComponentsRoutingModule
  ],
  declarations: [
    BulletinsComponent
  ]
})
export class ComponentsModule { }
