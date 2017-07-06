import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BulletinsComponent } from './bulletins.component';
import { CreateBulletinComponent } from './create-bulletin.component';
import { ShowBulletinComponent } from './show-bulletin.component';
import { CaamlComponent } from './caaml.component';

import { AuthGuard } from '../guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: BulletinsComponent,
    canActivate: [AuthGuard], 
    data: {
      title: 'Bulletins'
    }
  },
  {
    path: 'new',
    component: CreateBulletinComponent,
    canActivate: [AuthGuard], 
    data: {
      title: 'New Bulletin'
    }
  },
  {
    path: 'show',
    component: ShowBulletinComponent,
    canActivate: [AuthGuard], 
    data: {
      title: 'Show Bulletin'
    }
  },
  {
    path: 'caaml',
    component: CaamlComponent,
    canActivate: [AuthGuard], 
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
