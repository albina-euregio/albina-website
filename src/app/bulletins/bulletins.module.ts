import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { BulletinsComponent } from './bulletins.component';
import { CreateBulletinComponent } from './create-bulletin.component';
import { BulletinDetailComponent } from './bulletin-detail.component';
import { CaamlComponent } from './caaml.component';
import { Tabs } from './tabs.component';
import { Tab } from './tab.component';

// Bulletins Routing
import { BulletinsRoutingModule } from './bulletins-routing.module';
import { TranslateModule } from 'ng2-translate';
import { ConfirmDialogModule, SharedModule } from 'primeng/primeng';

// Pipes
import { PipeModule }    from '../pipes/pipes.module';


@NgModule({
  imports: [
    BulletinsRoutingModule,
    FormsModule,
    CommonModule,
    TranslateModule,
    ConfirmDialogModule,
    SharedModule,
    PipeModule.forRoot()
  ],
  declarations: [
    BulletinsComponent,
    CreateBulletinComponent,
    BulletinDetailComponent,
    CaamlComponent,
    Tabs,
    Tab
  ]
})
export class BulletinsModule { }
