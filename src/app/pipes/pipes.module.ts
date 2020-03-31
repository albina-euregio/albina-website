import { NgModule, ModuleWithProviders } from "@angular/core";
import { LocalizedDatePipe } from "./localized-date.pipe";
import { HtmlPipe } from "./html.pipe";

@NgModule({
  imports: [
  ],
  declarations: [
    LocalizedDatePipe,
    HtmlPipe
  ],
  exports: [
    LocalizedDatePipe,
    HtmlPipe
  ]
})

export class PipeModule {

  static forRoot(): ModuleWithProviders<PipeModule> {
    return {
        ngModule: PipeModule,
        providers: [],
    };
}
}
