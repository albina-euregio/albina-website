import { NgModule } from '@angular/core';

import { NewsComponent } from './news.component';

// Bulletins Routing
import { NewsRoutingModule } from './news-routing.module';

@NgModule({
  imports: [
    NewsRoutingModule
  ],
  declarations: [
    NewsComponent
  ]
})
export class NewsModule { }
