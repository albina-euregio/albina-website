import { Component } from '@angular/core';
import { TranslateService } from 'ng2-translate/src/translate.service';
import { BulletinModel } from '../models/bulletin.model';
import { BulletinsService } from '../providers/mock-service/bulletins.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import * as Enums from '../enums/enums';

@Component({
  templateUrl: 'caaml.component.html'
})
export class CaamlComponent {

  public bulletins: string;

  constructor(
    private translate: TranslateService,
    private bulletinsService: BulletinsService,
    private route: ActivatedRoute,
    private router: Router)
  {
    this.bulletins = undefined;
  }

  ngOnInit() {
    this.bulletinsService.loadCaamlBulletins(this.bulletinsService.getActiveDate()).subscribe(
      data => {
        let text = data.text();
        this.bulletins = text;
      },
      error => {
        console.error("Bulletins could not be loaded!");
        // TODO
      }
    );
  }

  goBack() {
    this.router.navigate(['/bulletins/bulletins']);
  }    
}
