import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { NewsComponent } from './news.component';
import { CreateNewsComponent } from './create-news.component';

// Bulletins Routing
import { NewsRoutingModule } from './news-routing.module';
import { TranslateModule } from 'ng2-translate';


@NgModule({
  imports: [
    NewsRoutingModule,
    FormsModule,
    CommonModule,
    TranslateModule
  ],
  declarations: [
    NewsComponent,
    CreateNewsComponent
  ]
})
export class NewsModule { }
