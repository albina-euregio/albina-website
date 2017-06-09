import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { NewsComponent } from './news.component';
import { CreateNewsComponent } from './create-news.component';

const routes: Routes = [
  {
    path: '',
    component: NewsComponent,
    pathMatch: 'full'
  },
  {
    path: 'new',
    component: CreateNewsComponent,
    data: {
      title: 'New News'
    }
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NewsRoutingModule {}
