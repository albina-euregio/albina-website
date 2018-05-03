import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AdminComponent } from './admin.component';

// Bulletins Routing
import { AdminRoutingModule } from './admin-routing.module';
import { TranslateModule } from 'ng2-translate';
import { ConfirmDialogModule, SharedModule } from 'primeng/primeng';

// Pipes
import { PipeModule } from '../pipes/pipes.module';


@NgModule({
  imports: [
    AdminRoutingModule,
    FormsModule,
    CommonModule,
    TranslateModule,
    ConfirmDialogModule,
    SharedModule,
    PipeModule.forRoot()
  ],
  declarations: [
    AdminComponent
  ]
})
export class AdminModule { }
