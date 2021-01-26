import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { CommonModule } from "@angular/common";

import { BulletinsComponent } from "./bulletins.component";
import { CreateBulletinComponent } from "./create-bulletin.component";
import { BulletinDetailComponent } from "./bulletin-detail.component";
import { AspectsComponent } from "./aspects.component";
import { ComplexityComponent } from "./complexity.component";
import { DangerRatingComponent } from "./danger-rating.component";
import { DangerRatingIconComponent } from "./danger-rating-icon.component";
import { AvalancheSituationComponent } from "./avalanche-situation.component";
import { AvalancheSituationDetailComponent } from "./avalanche-situation-detail.component";
import { AvalancheSituationPreviewComponent } from "./avalanche-situation-preview.component";
import { AvalancheSituationMatrixComponent } from "./avalanche-situation-matrix.component";
import { CaamlComponent } from "./caaml.component";
import { JsonComponent } from "./json.component";
import { TabsComponent } from "./tabs.component";
import { TabComponent } from "./tab.component";

// Bulletins Routing
import { BulletinsRoutingModule } from "./bulletins-routing.module";
import { TranslateModule } from "@ngx-translate/core";
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
        ConfirmDialogModule,
        PipeModule.forRoot(),
        AccordionModule.forRoot()
    ],
    exports: [
        AspectsComponent
    ],
    declarations: [
        BulletinsComponent,
        CreateBulletinComponent,
        BulletinDetailComponent,
        AspectsComponent,
        ComplexityComponent,
        DangerRatingComponent,
        DangerRatingIconComponent,
        AvalancheSituationComponent,
        AvalancheSituationDetailComponent,
        AvalancheSituationPreviewComponent,
        AvalancheSituationMatrixComponent,
        CaamlComponent,
        JsonComponent,
        TabsComponent,
        TabComponent
    ]
})
export class BulletinsModule { }
