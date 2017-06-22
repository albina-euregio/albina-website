import { Component } from '@angular/core';
import { TranslateService } from 'ng2-translate/src/translate.service';
import { BulletinModel } from '../models/bulletin.model';
import { BulletinsService } from '../providers/bulletins-service/bulletins.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import * as Enums from '../enums/enums';

@Component({
  templateUrl: 'caaml.component.html'
})
export class CaamlComponent {

  public bulletins: string;
  public loading: boolean;

  constructor(
    private translate: TranslateService,
    private bulletinsService: BulletinsService,
    private route: ActivatedRoute,
    private router: Router)
  {
    this.bulletins = undefined;
    this.loading = false;
  }

  ngOnInit() {
    this.loading = true;
    this.bulletinsService.loadCaamlBulletins(this.bulletinsService.getActiveDate()).subscribe(
      data => {
        let text = data.text();
        this.bulletins = text;
        this.loading = false;
      },
      error => {
        console.error("Bulletins could not be loaded!");
        // TODO
        this.loading = false;
      }
    );
  }

  goBack() {
    this.router.navigate(['/bulletins']);
  }    
}
