import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { HttpModule, Http } from '@angular/http';
import { CommonModule } from '@angular/common';

import { P404Component } from './404.component';
import { P500Component } from './500.component';
import { LoginComponent } from './login.component';

import { PagesRoutingModule } from './pages-routing.module';
import { ConfirmDialogModule, SharedModule } from 'primeng/primeng';

@NgModule({
  imports: [
  	PagesRoutingModule,
    FormsModule,
    TranslateModule,
    CommonModule,
    ConfirmDialogModule,
    SharedModule
  ],
  declarations: [
    P404Component,
    P500Component,
    LoginComponent
  ]
})
export class PagesModule { }
