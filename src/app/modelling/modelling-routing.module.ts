import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { ZamgModelsComponent } from "./zamg-models.component";

import { AuthGuard } from "../guards/auth.guard";

const routes: Routes = [
  {
    path: "zamg",
    component: ZamgModelsComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModellingRoutingModule { }
