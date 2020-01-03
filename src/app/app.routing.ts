import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

// Layouts
import { FullLayoutComponent } from "./layouts/full-layout.component";
import { SimpleLayoutComponent } from "./layouts/simple-layout.component";

import { AuthGuard } from "./guards/auth.guard";

export const routes: Routes = [
  {
    path: "",
    redirectTo: "bulletins",
    pathMatch: "full"
  },
  {
    path: "bulletins",
    component: FullLayoutComponent,
    canActivate: [AuthGuard],
    loadChildren: "./bulletins/bulletins.module#BulletinsModule"
  },
  {
    path: "observations",
    component: FullLayoutComponent,
    canActivate: [AuthGuard],
    loadChildren: "./observations/observations.module#ObservationsModule"
  },
  {
    path: "admin",
    component: FullLayoutComponent,
    canActivate: [AuthGuard],
    loadChildren: "./admin/admin.module#AdminModule"
  },
  {
    path: "modelling",
    component: FullLayoutComponent,
    canActivate: [AuthGuard],
    loadChildren: "./modelling/modelling.module#ModellingModule"
  },
  {
    path: "settings",
    component: FullLayoutComponent,
    canActivate: [AuthGuard],
    loadChildren: "./settings/settings.module#SettingsModule"
  },
  {
    path: "pages",
    component: SimpleLayoutComponent,
    data: {
      title: "Pages"
    },
    children: [
      {
        path: "",
        loadChildren: "./pages/pages.module#PagesModule",
      }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }