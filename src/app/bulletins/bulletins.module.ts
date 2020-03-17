import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

import { BulletinsComponent } from "./bulletins.component";
import { CreateBulletinComponent } from "./create-bulletin.component";
import { BulletinDetailComponent } from "./bulletin-detail.component";
import { AspectsComponent } from "./aspects.component";
import { DangerRatingComponent } from "./danger-rating.component";
import { DangerRatingIconComponent } from "./danger-rating-icon.component";
import { AvalancheSituationComponent } from "./avalanche-situation.component";
import { MatrixComponent } from "./matrix.component";
import { CaamlComponent } from "./caaml.component";
import { JsonComponent } from "./json.component";
import { TabsComponent } from "./tabs.component";
import { TabComponent } from "./tab.component";

// Bulletins Routing
import { BulletinsRoutingModule } from "./bulletins-routing.module";
import { TranslateModule } from "@ngx-translate/core";
import { DialogModule } from "primeng/dialog";
import { ConfirmDialogModule } from "primeng/confirmdialog";

// Pipes
import { PipeModule } from "../pipes/pipes.module";

import { AccordionModule } from "ngx-bootstrap";


@NgModule({
    imports: [
        BulletinsRoutingModule,
        FormsModule,
        CommonModule,
        TranslateModule,
        DialogModule,
        ConfirmDialogModule,
        PipeModule.forRoot(),
        AccordionModule.forRoot()
    ],
    declarations: [
        BulletinsComponent,
        CreateBulletinComponent,
        BulletinDetailComponent,
        AspectsComponent,
        DangerRatingComponent,
        DangerRatingIconComponent,
        AvalancheSituationComponent,
        MatrixComponent,
        CaamlComponent,
        JsonComponent,
        TabsComponent,
        TabComponent
    ]
})
export class BulletinsModule { }
