import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from 'ng2-translate';
import { HttpModule, Http } from '@angular/http';

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
