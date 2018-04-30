import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { BulletinsComponent } from './bulletins.component';
import { CreateBulletinComponent } from './create-bulletin.component';
import { BulletinDetailComponent } from './bulletin-detail.component';
import { AspectsComponent } from './aspects.component';
import { DangerRatingComponent } from './danger-rating.component';
import { DangerRatingIconComponent } from './danger-rating-icon.component';
import { AvalancheSituationComponent } from './avalanche-situation.component';
import { CopComponent } from './cop.component';
import { MatrixComponent } from './matrix.component';
import { CaamlComponent } from './caaml.component';
import { JsonComponent } from './json.component';
import { Tabs } from './tabs.component';
import { Tab } from './tab.component';

// Bulletins Routing
import { BulletinsRoutingModule } from './bulletins-routing.module';
import { TranslateModule } from 'ng2-translate';
import { ConfirmDialogModule, SharedModule } from 'primeng/primeng';

// Pipes
import { PipeModule }    from '../pipes/pipes.module';

import { AccordionModule } from 'ngx-bootstrap';


@NgModule({
  imports: [
    BulletinsRoutingModule,
    FormsModule,
    CommonModule,
    TranslateModule,
    ConfirmDialogModule,
    SharedModule,
    PipeModule.forRoot(),
    AccordionModule.forRoot()
  ],
  declarations: [
    BulletinsComponent,
    CreateBulletinComponent,
    BulletinDetailComponent,
    AspectsComponent,
    DangerRatingComponent,
    DangerRatingIconComponent,
    AvalancheSituationComponent,
    CopComponent,
    MatrixComponent,
    CaamlComponent,
    JsonComponent,
    Tabs,
    Tab
  ]
})
export class BulletinsModule { }
