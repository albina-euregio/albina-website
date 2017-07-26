import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { DropdownModule } from 'ng2-bootstrap/dropdown';
import { TabsModule } from 'ng2-bootstrap/tabs';
import { NAV_DROPDOWN_DIRECTIVES } from './shared/nav-dropdown.directive';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ChartsModule } from 'ng2-charts/ng2-charts';
import { SIDEBAR_TOGGLE_DIRECTIVES } from './shared/sidebar.directive';
import { AsideToggleDirective } from './shared/aside.directive';
import { BreadcrumbsComponent } from './shared/breadcrumb.component';

// Routing Module
import { AppRoutingModule } from './app.routing';

// Layouts
import { FullLayoutComponent } from './layouts/full-layout.component';
import { SimpleLayoutComponent } from './layouts/simple-layout.component';

// Services
import { AuthenticationService } from './providers/authentication-service/authentication.service';
import { BulletinsService } from './providers/bulletins-service/bulletins.service';
import { ChatService } from './providers/chat-service/chat.service';
import { NewsService } from './providers/news-service/news.service';
import { RegionsService } from './providers/regions-service/regions.service';
import { ConstantsService } from './providers/constants-service/constants.service';
import { SettingsService } from './providers/settings-service/settings.service';
import { MapService } from './providers/map-service/map.service';
import { SocketService } from './providers/socket-service/socket.service';
import { ConfirmationService } from 'primeng/primeng';

import { AuthGuard } from './guards/auth.guard';

import { TranslateModule, TranslateLoader, TranslateStaticLoader } from 'ng2-translate';
import { HttpModule, Http } from '@angular/http';

export function createTranslateLoader(http: Http) {
    return new TranslateStaticLoader(http, './assets/i18n', '.json');
}

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    DropdownModule.forRoot(),
    TabsModule.forRoot(),
    ChartsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    BrowserAnimationsModule,
    TranslateModule.forRoot({ 
      provide: TranslateLoader,
      useFactory: (createTranslateLoader),
      deps: [Http]
    })
  ],
  declarations: [
    AppComponent,
    FullLayoutComponent,
    SimpleLayoutComponent,
    BreadcrumbsComponent,
    NAV_DROPDOWN_DIRECTIVES,
    SIDEBAR_TOGGLE_DIRECTIVES,
    AsideToggleDirective,
  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    AuthenticationService,
    AuthGuard,
    ConstantsService,
    NewsService,
    SettingsService,
    BulletinsService,
    RegionsService,
    ChatService,
    NewsService,
    MapService,
    SocketService,
    ConfirmationService
  ],
  bootstrap: [ AppComponent ],
  exports: [
    TranslateModule
  ]
})
export class AppModule { }
