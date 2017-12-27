import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { ObservationsComponent } from './observations.component';

// Bulletins Routing
import { ObservationsRoutingModule } from './observations-routing.module';
import { TranslateModule } from 'ng2-translate';
import { ConfirmDialogModule, SharedModule } from 'primeng/primeng';

// Pipes
import { PipeModule } from '../pipes/pipes.module';


@NgModule({
  imports: [
    ObservationsRoutingModule,
    FormsModule,
    CommonModule,
    TranslateModule,
    ConfirmDialogModule,
    SharedModule,
    PipeModule.forRoot()
  ],
  declarations: [
    ObservationsComponent
  ]
})
export class ObservationsModule { }
