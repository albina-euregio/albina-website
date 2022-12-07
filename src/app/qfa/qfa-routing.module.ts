import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { QfaComponent } from "./qfa.component";

import { AuthGuard } from "../guards/auth.guard";

const routes: Routes = [
  {
    path: "",
    component: QfaComponent,
    canActivate: [AuthGuard],
    data: {
      title: "QFA"
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QfaRoutingModule { }
