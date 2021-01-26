import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { ZamgModelsComponent } from "./zamg-models.component";
import { SnowpackComponent } from "./snowpack.component";
import { SnowpackMeteoComponent } from "./snowpack.meteo.component";

import { AuthGuard } from "../guards/auth.guard";

const routes: Routes = [
  {
    path: "zamg",
    component: ZamgModelsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "zamg_eps_ecmwf",
    component: ZamgModelsComponent,
    data: {
      ecmwf: true
    },
    canActivate: [AuthGuard]
  },
  {
    path: "snowpack",
    component: SnowpackComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "snowpackMeteo",
    component: SnowpackMeteoComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ModellingRoutingModule { }