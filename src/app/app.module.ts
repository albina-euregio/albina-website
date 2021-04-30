import { BrowserModule } from "@angular/platform-browser";
import { ErrorHandler, Injectable, NgModule } from "@angular/core";
import { LocationStrategy, HashLocationStrategy, registerLocaleData } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatDialogModule } from "@angular/material/dialog";
import { Observable } from "rxjs";

import { AppComponent } from "./app.component";

import { NAV_DROPDOWN_DIRECTIVES } from "./shared/nav-dropdown.directive";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { SIDEBAR_TOGGLE_DIRECTIVES } from "./shared/sidebar.directive";
import { AsideToggleDirective } from "./shared/aside.directive";
import { PasswordMismatchValidatorDirective } from "./shared/password-mismatch.directive";
import { BreadcrumbsComponent } from "./shared/breadcrumb.component";

import { CatalogOfPhrasesComponent } from "./catalog-of-phrases/catalog-of-phrases.component";

// Routing Module
import { AppRoutingModule } from "./app.routing";

// Layouts
import { FullLayoutComponent } from "./layouts/full-layout.component";
import { SimpleLayoutComponent } from "./layouts/simple-layout.component";

// Services
import { AuthenticationService } from "./providers/authentication-service/authentication.service";
import { UserService } from "./providers/user-service/user.service";
import { BulletinsService } from "./providers/bulletins-service/bulletins.service";
import { RegionsService } from "./providers/regions-service/regions.service";
import { ConstantsService } from "./providers/constants-service/constants.service";
import { SettingsService } from "./providers/settings-service/settings.service";
import { MapService } from "./providers/map-service/map.service";
import { WsBulletinService } from "./providers/ws-bulletin-service/ws-bulletin.service";
import { WsUpdateService } from "./providers/ws-update-service/ws-update.service";
import { WsRegionService } from "./providers/ws-region-service/ws-region.service";
import { WsChatService } from "./providers/ws-chat-service/ws-chat.service";
import { ChatService } from "./providers/chat-service/chat.service";
import { LocalStorageService } from "./providers/local-storage-service/local-storage.service";
import { ConfigurationService } from "./providers/configuration-service/configuration.service";
import { SocialmediaService } from "./providers/socialmedia-service/socialmedia.service";
import { CopyService } from "./providers/copy-service/copy.service";
import { ConfirmationService } from "primeng/api";

// Pipes
import { PipeModule } from "./pipes/pipes.module";

import { AuthGuard } from "./guards/auth.guard";

import { TranslateModule, TranslateLoader } from "@ngx-translate/core";

import { HttpClientModule } from "@angular/common/http";

import { BsDropdownModule, TabsModule, ModalModule, AlertModule } from "ngx-bootstrap";

import { ModalSubmitComponent } from "./bulletins/modal-submit.component";
import { ModalPublishComponent } from "./bulletins/modal-publish.component";
import { ModalCheckComponent } from "./bulletins/modal-check.component";
import { ModalPublicationStatusComponent } from "./bulletins/modal-publication-status.component";
import { ModalPublishAllComponent } from "./bulletins/modal-publish-all.component";

import * as Sentry from "@sentry/browser";

import localeDe from "@angular/common/locales/de";
import localeIt from "@angular/common/locales/it";
import localeEn from "@angular/common/locales/en";
import localeFr from "@angular/common/locales/fr";
import localeEs from "@angular/common/locales/es";
import localeCa from "@angular/common/locales/ca";
// locale OC missing in @angular/common/locales/
import localeOc from "@angular/common/locales/en";
import i18nDe from "../assets/i18n/de.json";
import i18nIt from "../assets/i18n/it.json";
import i18nEn from "../assets/i18n/en.json";
import i18nFr from "../assets/i18n/fr.json";
import i18nEs from "../assets/i18n/es.json";
import i18nCa from "../assets/i18n/ca.json";
import i18nOc from "../assets/i18n/oc.json";
import { CreateUserComponent } from "./admin/create-user.component";

const pkg = require("../../package.json");
Sentry.init({
  release: [pkg.name, pkg.version].join("@"),
  dsn: "https://f01d3588732c4ed195093468989a45f2@sentry.io/1828063"
});

@Injectable()
export class SentryErrorHandler implements ErrorHandler {
  handleError(error) {
    console.error(error);
  }
}

export class DirectTranslateLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<Object> {
    switch (lang) {
      case "de":
        return Observable.of(i18nDe);
      case "it":
        return Observable.of(i18nIt);
      case "en":
        return Observable.of(i18nEn);
      case "fr":
        return Observable.of(i18nFr);
      case "es":
        return Observable.of(i18nEs);
      case "ca":
        return Observable.of(i18nCa);
      case "oc":
        return Observable.of(i18nOc);
    }
  }
}

// AoT requires an exported function for factories
export function DirectLoaderFactory() {
    return new DirectTranslateLoader();
}

registerLocaleData(localeDe, "de");
registerLocaleData(localeIt, "it");
registerLocaleData(localeEn, "en");
registerLocaleData(localeFr, "fr");
registerLocaleData(localeEs, "es");
registerLocaleData(localeCa, "ca");
registerLocaleData(localeOc, "oc");

@NgModule({
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatDialogModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    AlertModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    PipeModule.forRoot(),
    ModalModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: DirectLoaderFactory
      },
      defaultLanguage: "de"
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
    PasswordMismatchValidatorDirective,
    ModalSubmitComponent,
    ModalPublishComponent,
    ModalCheckComponent,
    ModalPublicationStatusComponent,
    ModalPublishAllComponent,
    CatalogOfPhrasesComponent,
    CreateUserComponent
  ],
  providers: [
    {
       provide: ErrorHandler,
       useClass: SentryErrorHandler
    },
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy
    },
    AuthenticationService,
    UserService,
    AuthGuard,
    ConstantsService,
    SettingsService,
    BulletinsService,
    RegionsService,
    MapService,
    WsChatService,
    WsRegionService,
    WsUpdateService,
    WsBulletinService,
    ChatService,
    LocalStorageService,
    ConfigurationService,
    ConfirmationService,
    SocialmediaService,
    CopyService
  ],
  bootstrap: [AppComponent],
  exports: [
    TranslateModule
  ]
})
export class AppModule {}
