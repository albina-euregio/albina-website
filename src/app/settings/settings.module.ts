import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

import { SettingsComponent } from "./settings.component";

import { SettingsRoutingModule } from "./settings-routing.module";
import { TranslateModule } from "@ngx-translate/core";

// Pipes
import { PipeModule } from "../pipes/pipes.module";

import { AlertModule } from "ngx-bootstrap/alert";
import { Password2MismatchValidatorDirective } from "./password2-mismatch.directive";


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
    SettingsComponent,
    Password2MismatchValidatorDirective
  ]
})
export class SettingsModule { }
