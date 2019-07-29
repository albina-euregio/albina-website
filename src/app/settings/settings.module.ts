import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { SettingsComponent } from './settings.component';

import { SettingsRoutingModule } from './settings-routing.module';
import { TranslateModule } from '@ngx-translate/core';

// Pipes
import { PipeModule } from '../pipes/pipes.module';

import { AlertModule } from 'ngx-bootstrap';


@NgModule({
  imports: [
    SettingsRoutingModule,
    FormsModule,
    CommonModule,
    TranslateModule,
    PipeModule.forRoot(),
    AlertModule.forRoot()
  ],
  declarations: [
    SettingsComponent
  ]
})
export class SettingsModule { }
