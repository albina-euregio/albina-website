import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BulletinsComponent } from './bulletins.component';
import { CreateBulletinComponent } from './create-bulletin.component';

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
      },
      {
        path: 'new',
        component: CreateBulletinComponent,
        data: {
          title: 'New Bulletin'
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
