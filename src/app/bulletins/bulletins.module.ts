import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { BulletinsComponent } from './bulletins.component';
import { CreateBulletinComponent } from './create-bulletin.component';
import { ShowBulletinComponent } from './show-bulletin.component';
import { BulletinDetailComponent } from './bulletin-detail.component';
import { CaamlComponent } from './caaml.component';

// Bulletins Routingd
import { BulletinsRoutingModule } from './bulletins-routing.module';
import { TranslateModule } from 'ng2-translate';
import { ConfirmDialogModule, SharedModule } from 'primeng/primeng';

@NgModule({
  imports: [
    BulletinsRoutingModule,
    FormsModule,
    CommonModule,
    TranslateModule,
    ConfirmDialogModule,
    SharedModule
  ],
  declarations: [
    BulletinsComponent,
    CreateBulletinComponent,
    ShowBulletinComponent,
    BulletinDetailComponent,
    CaamlComponent
  ]
})
export class BulletinsModule { }
