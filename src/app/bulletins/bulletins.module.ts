import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { BulletinsComponent } from './bulletins.component';
import { CreateBulletinComponent } from './create-bulletin.component';

// Bulletins Routing
import { BulletinsRoutingModule } from './bulletins-routing.module';
import { TranslateModule } from 'ng2-translate';

@NgModule({
  imports: [
    BulletinsRoutingModule,
    FormsModule,
    CommonModule,
    TranslateModule
  ],
  declarations: [
    BulletinsComponent,
    CreateBulletinComponent
  ]
})
export class BulletinsModule { }
