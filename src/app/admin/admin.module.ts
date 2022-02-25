import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

import { AdminComponent } from "./admin.component";
import { ServerConfigurationComponent } from "./server-configuration.component";
import { UsersComponent } from "./users.component";
import { StatisticsComponent } from "./statistics.component";
import { ObservationsComponent } from "./observations.component";
import { ObservationsService } from "../observations/observations.service";
import { BlogComponent } from "./blog.component";

import { AdminRoutingModule } from "./admin-routing.module";
import { TranslateModule } from "@ngx-translate/core";

// Pipes
import { PipeModule } from "../pipes/pipes.module";
import { TabViewModule } from "primeng/tabview";
import { DropdownModule } from "primeng/dropdown";
import { TableModule } from "primeng/table";

import { AlertModule } from "ngx-bootstrap/alert";
import { BsDatepickerModule } from "ngx-bootstrap/datepicker";

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
    AlertModule.forRoot(),
    BsDatepickerModule.forRoot()
  ],
  declarations: [
    AdminComponent,
    ServerConfigurationComponent,
    UsersComponent,
    StatisticsComponent,
    ObservationsComponent,
    BlogComponent
  ],
  providers: [
    ObservationsService
  ]
})
export class AdminModule { }
