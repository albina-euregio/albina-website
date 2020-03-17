import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

import { AdminComponent } from "./admin.component";

import { AdminRoutingModule } from "./admin-routing.module";
import { TranslateModule } from "@ngx-translate/core";

// Pipes
import { PipeModule } from "../pipes/pipes.module";
import { TabViewModule } from "primeng/tabview";
import { DropdownModule } from "primeng/dropdown";
import { TableModule } from "primeng/table";

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
    TableModule,
    AlertModule.forRoot()
  ],
  declarations: [
    AdminComponent
  ]
})
export class AdminModule { }
