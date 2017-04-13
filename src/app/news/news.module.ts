import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { NewsComponent } from './news.component';
import { CreateNewsComponent } from './create-news.component';

// Bulletins Routing
import { NewsRoutingModule } from './news-routing.module';


@NgModule({
  imports: [
    NewsRoutingModule,
    FormsModule
  ],
  declarations: [
    NewsComponent,
    CreateNewsComponent
  ]
})
export class NewsModule { }
