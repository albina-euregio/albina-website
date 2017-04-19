import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { BulletinsComponent } from './bulletins.component';

// Bulletins Routing
import { BulletinsRoutingModule } from './bulletins-routing.module';
import { TranslateModule } from 'ng2-translate';

@NgModule({
  imports: [
    BulletinsRoutingModule,
    FormsModule,
    TranslateModule
  ],
  declarations: [
    BulletinsComponent
  ]
})
export class BulletinsModule { }
