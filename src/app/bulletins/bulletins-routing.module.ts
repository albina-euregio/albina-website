import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BulletinsComponent } from './bulletins.component';
import { CreateBulletinComponent } from './create-bulletin.component';
import { ShowBulletinComponent } from './show-bulletin.component';
import { CaamlComponent } from './caaml.component';

const routes: Routes = [
  {
    path: '',
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
  },
  {
    path: 'show',
    component: ShowBulletinComponent,
    data: {
      title: 'Show Bulletin'
    }
  },
  {
    path: 'caaml',
    component: CaamlComponent,
    data: {
      title: 'CAAML'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BulletinsRoutingModule {}
