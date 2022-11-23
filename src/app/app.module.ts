import { BrowserModule } from "@angular/platform-browser";
import { ErrorHandler, Injectable, NgModule } from "@angular/core";
import { LocationStrategy, HashLocationStrategy, registerLocaleData } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MatLegacyDialogModule as MatDialogModule } from "@angular/material/legacy-dialog";
import { Observable, of } from "rxjs";

import { AppComponent } from "./app.component";

import { NAV_DROPDOWN_DIRECTIVES } from "./shared/nav-dropdown.directive";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { SIDEBAR_TOGGLE_DIRECTIVES } from "./shared/sidebar.directive";
import { AsideToggleDirective } from "./shared/aside.directive";
import { PasswordMismatchValidatorDirective } from "./shared/password-mismatch.directive";
import { BreadcrumbsComponent } from "./shared/breadcrumb.component";
import { LeafletModule} from "@asymmetrik/ngx-leaflet";

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
import { StatisticsService } from "./providers/statistics-service/statistics.service";
import { RegionsService } from "./providers/regions-service/regions.service";
import { ConstantsService } from "./providers/constants-service/constants.service";
import { SettingsService } from "./providers/settings-service/settings.service";
import { ObservationsService } from "./observations/observations.service";
import { ObservationFilterService } from "./observations/observation-filter.service";
import { MapService } from "./providers/map-service/map.service";
import { WsBulletinService } from "./providers/ws-bulletin-service/ws-bulletin.service";
import { WsUpdateService } from "./providers/ws-update-service/ws-update.service";
import { WsRegionService } from "./providers/ws-region-service/ws-region.service";
import { ChatService } from "./providers/chat-service/chat.service";
import { LocalStorageService } from "./providers/local-storage-service/local-storage.service";
import { ConfigurationService } from "./providers/configuration-service/configuration.service";
import { SocialmediaService } from "./providers/socialmedia-service/socialmedia.service";
import { CopyService } from "./providers/copy-service/copy.service";
import { BlogService } from "./providers/blog-service/blog.service";
import { MediaFileService } from "./providers/media-file-service/media-file.service";
import { ConfirmationService } from "primeng/api";
import { GetFilenamesService } from './providers/qfa-service/filenames.service';
import { GetDustParamService } from "./providers/qfa-service/dust.service";
import { ParamService } from "./providers/qfa-service/param.service"
import { BaseMapService } from './providers/map-service/base-map.service';
import { ObservationMapService } from "./providers/map-service/observation-map.service";
import { QfaService } from './providers/qfa-service/qfa.service';

// Pipes
import { PipeModule } from "./pipes/pipes.module";

import { AuthGuard } from "./guards/auth.guard";

import { TranslateModule, TranslateLoader } from "@ngx-translate/core";

import { HttpClientModule } from "@angular/common/http";

import { AlertModule } from "ngx-bootstrap/alert";
import { BsDropdownModule } from "ngx-bootstrap/dropdown";
import { ModalModule } from "ngx-bootstrap/modal";
import { TabsModule } from "ngx-bootstrap/tabs";
// import { NgxSliderModule } from '@angular-slider/ngx-slider';

import { ModalSubmitComponent } from "./bulletins/modal-submit.component";
import { ModalPublishComponent } from "./bulletins/modal-publish.component";
import { ModalCheckComponent } from "./bulletins/modal-check.component";
import { ModalPublicationStatusComponent } from "./bulletins/modal-publication-status.component";
import { ModalPublishAllComponent } from "./bulletins/modal-publish-all.component";
import { ModalMediaFileComponent } from "./bulletins/modal-media-file.component";

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
import { UpdateUserComponent } from "./admin/update-user.component";

@Injectable()
export class SentryErrorHandler implements ErrorHandler {
  handleError(error) {
    // console.error(error);s
  }
}

export class DirectTranslateLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<Object> {
    switch (lang) {
      case "de":
        return of(i18nDe);
      case "it":
        return of(i18nIt);
      case "en":
        return of(i18nEn);
      case "fr":
        return of(i18nFr);
      case "es":
        return of(i18nEs);
      case "ca":
        return of(i18nCa);
      case "oc":
        return of(i18nOc);
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
    // NgxSliderModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    AlertModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    LeafletModule,
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
    ModalMediaFileComponent,
    CatalogOfPhrasesComponent,
    CreateUserComponent,
    UpdateUserComponent
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
    ObservationsService,
    ObservationFilterService,
    BulletinsService,
    StatisticsService,
    RegionsService,
    MapService,
    WsRegionService,
    WsUpdateService,
    WsBulletinService,
    ChatService,
    LocalStorageService,
    ConfigurationService,
    ConfirmationService,
    SocialmediaService,
    CopyService,
    BlogService,
    MediaFileService,
    GetFilenamesService,
    GetDustParamService,
    ParamService,
    BaseMapService,
    ObservationMapService,
    QfaService,
  ],
  bootstrap: [AppComponent],
  exports: [
    TranslateModule
  ]
})
export class AppModule {}
