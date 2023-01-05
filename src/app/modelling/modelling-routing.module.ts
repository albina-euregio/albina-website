import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { IndexComponent } from "./index.component";
import { ZamgModelsComponent } from "./zamg-models.component";
import { SnowpackComponent } from "./snowpack.component";
import { SnowpackMeteoComponent } from "./snowpack.meteo.component";
import { ModellingComponent } from "./modelling/modelling.component";

import { AuthGuard } from "../guards/auth.guard";

const routes: Routes = [
  {
    path: "",
    component: IndexComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "test",
    component: ModellingComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "zamg",
    component: ZamgModelsComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "zamg_eps_ecmwf",
    component: ZamgModelsComponent,
    data: {
      zamgType: "eps_ecmwf"
    },
    canActivate: [AuthGuard]
  },
  {
    path: "zamg_eps_claef",
    component: ZamgModelsComponent,
    data: {
      zamgType: "eps_claef"
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
