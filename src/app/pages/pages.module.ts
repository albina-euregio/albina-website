import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateLoader } from 'ng2-translate';

import { P404Component } from './404.component';
import { P500Component } from './500.component';
import { LoginComponent } from './login.component';

import { PagesRoutingModule } from './pages-routing.module';

@NgModule({
  imports: [
  	PagesRoutingModule,
    FormsModule,
    TranslateModule.forChild({
      loader: {provide: TranslateLoader, useClass: CustomLoader},
      parser: {provide: TranslateParser, useClass: CustomParser},
      missingTranslationHandler: {provide: MissingTranslationHandler, useClass: CustomHandler},
      isolate: true
    })
  ],
  declarations: [
    P404Component,
    P500Component,
    LoginComponent
  ]
})
export class PagesModule { }
