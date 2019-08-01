import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { SettingsComponent } from "./settings.component";

import { AuthGuard } from "../guards/auth.guard";

const routes: Routes = [
  {
    path: "",
    component: SettingsComponent,
    canActivate: [AuthGuard],
    data: {
      title: "Settings"
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SettingsRoutingModule {}
