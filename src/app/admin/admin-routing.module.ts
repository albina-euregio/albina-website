import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { AdminComponent } from "./admin.component";

import { AuthGuard } from "../guards/auth.guard";

const routes: Routes = [
  {
    path: "",
    component: AdminComponent,
    canActivate: [AuthGuard],
    data: {
      title: "Admin"
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
