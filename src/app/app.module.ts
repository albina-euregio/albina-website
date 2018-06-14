import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { NAV_DROPDOWN_DIRECTIVES } from './shared/nav-dropdown.directive';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

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
import { RegionsService } from './providers/regions-service/regions.service';
import { ConstantsService } from './providers/constants-service/constants.service';
import { SettingsService } from './providers/settings-service/settings.service';
import { MapService } from './providers/map-service/map.service';
import { ObservationsService } from './providers/observations-service/observations.service';
import { SocketService } from './providers/socket-service/socket.service';
import { ConfirmationService } from 'primeng/primeng';

// Pipes
import { PipeModule }    from './pipes/pipes.module';

import { AuthGuard } from './guards/auth.guard';

import { TranslateModule, TranslateLoader, TranslateStaticLoader } from 'ng2-translate';
import { HttpModule, Http } from '@angular/http';

import { BsDropdownModule, TabsModule, ModalModule } from 'ngx-bootstrap';

import { ModalSubmitComponent } from './bulletins/modal-submit.component';
import { ModalPublishComponent } from './bulletins/modal-publish.component';

export function createTranslateLoader(http: Http) {
    return new TranslateStaticLoader(http, './assets/i18n', '.json');
}

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    BrowserAnimationsModule,
    PipeModule.forRoot(),
    ModalModule.forRoot(),
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
    ModalSubmitComponent,
    ModalPublishComponent
  ],
  providers: [
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    AuthenticationService,
    AuthGuard,
    ConstantsService,
    SettingsService,
    BulletinsService,
    RegionsService,
    ChatService,
    MapService,
    ObservationsService,
    SocketService,
    ConfirmationService
  ],
  bootstrap: [ AppComponent ],
  exports: [
    TranslateModule
  ],
  entryComponents: [
    ModalSubmitComponent,
    ModalPublishComponent
  ]
})
export class AppModule { }
