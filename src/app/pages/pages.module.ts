import { NgModule } from '@angular/core';
import { TranslateModule, TranslateLoader, TranslateStaticLoader } from 'ng2-translate';
import { HttpModule, Http } from '@angular/http';

import { P404Component } from './404.component';
import { P500Component } from './500.component';
import { LoginComponent } from './login.component';

import { PagesRoutingModule } from './pages-routing.module';

export function createTranslateLoader(http: Http) {
    return new TranslateStaticLoader(http, '../assets/i18n', '.json');
}

@NgModule({
  imports: [
  	PagesRoutingModule,
    HttpModule,
    TranslateModule.forRoot({ 
      provide: TranslateLoader,
      useFactory: (createTranslateLoader),
      deps: [Http]
    })
  ],
  declarations: [
    P404Component,
    P500Component,
    LoginComponent
  ]
})
export class PagesModule { }
