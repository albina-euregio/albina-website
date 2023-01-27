import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { SnowpackComponent } from "./snowpack.component";
import { SnowpackMeteoComponent } from "./snowpack.meteo.component";
import { ForecastComponent } from "./forecast/forecast.component";

import { AuthGuard } from "../guards/auth.guard";

const routes: Routes = [
  {
    path: "",
    component: ForecastComponent,
    canActivate: [AuthGuard]
  },
  {
    path: "forecast",
    component: ForecastComponent,
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
