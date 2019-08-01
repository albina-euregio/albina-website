import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

import { AdminComponent } from "./admin.component";

import { AdminRoutingModule } from "./admin-routing.module";
import { TranslateModule } from "@ngx-translate/core";

// Pipes
import { PipeModule } from "../pipes/pipes.module";
import { TabViewModule, DropdownModule, DataTableModule } from "primeng/primeng";

import { AlertModule } from "ngx-bootstrap";

@NgModule({
  imports: [
    AdminRoutingModule,
    FormsModule,
    CommonModule,
    TranslateModule,
    PipeModule.forRoot(),
    TabViewModule,
    DropdownModule,
    DataTableModule,
    AlertModule.forRoot()
  ],
  declarations: [
    AdminComponent
  ]
})
export class AdminModule { }
