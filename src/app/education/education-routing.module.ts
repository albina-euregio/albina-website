import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { EducationComponent } from "./education.component";

import { AuthGuard } from "../guards/auth.guard";

const routes: Routes = [
  {
    path: "",
    component: EducationComponent,
    canActivate: [AuthGuard],
    data: {
      title: "Education"
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EducationRoutingModule { }
