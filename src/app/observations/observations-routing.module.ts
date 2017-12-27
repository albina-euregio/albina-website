import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ObservationsComponent } from './observations.component';

import { AuthGuard } from '../guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: ObservationsComponent,
    canActivate: [AuthGuard], 
    data: {
      title: 'Observations'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ObservationsRoutingModule {}
