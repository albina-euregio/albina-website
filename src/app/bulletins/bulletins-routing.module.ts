import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BulletinsComponent } from './bulletins.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Bulletins'
    },
    children: [
      {
        path: 'bulletins',
        component: BulletinsComponent,
        data: {
          title: 'Bulletins'
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BulletinsRoutingModule {}
