import { NgModule } from '@angular/core';
import { LocalizedDatePipe } from './localized-date.pipe';

@NgModule({
  imports: [
  ],
  declarations: [
  	LocalizedDatePipe
  ],
  exports: [
  	LocalizedDatePipe
  ]
})

export class PipeModule {

  static forRoot() {
    return {
       ngModule: PipeModule,
       providers: [],
    };
  }
}