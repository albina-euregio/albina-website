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
    loadChildren: () => import("./bulletins/bulletins.module").then(m => m.BulletinsModule)
  },
  {
    path: "observations",
    component: FullLayoutComponent,
    canActivate: [AuthGuard],
    loadChildren: () => import("./observations/observations.module").then(m => m.ObservationsModule)
  },
  {
    path: "admin",
    component: FullLayoutComponent,
    canActivate: [AuthGuard],
    loadChildren: () => import("./admin/admin.module").then(m => m.AdminModule)
  },
  {
    path: "education",
    component: FullLayoutComponent,
    canActivate: [AuthGuard],
    loadChildren: () => import("./education/education.module").then(m => m.EducationModule)
  },
  {
    path: "modelling",
    component: FullLayoutComponent,
    canActivate: [AuthGuard],
    loadChildren: () => import("./modelling/modelling.module").then(m => m.ModellingModule)
  },
  {
    path: "settings",
    component: FullLayoutComponent,
    canActivate: [AuthGuard],
    loadChildren: () => import("./settings/settings.module").then(m => m.SettingsModule)
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
        loadChildren: () => import("./pages/pages.module").then(m => m.PagesModule),
      }
    ]
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
