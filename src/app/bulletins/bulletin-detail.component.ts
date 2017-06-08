import { Component, Input, ViewChild } from '@angular/core';
import { TranslateService } from 'ng2-translate/src/translate.service';
import { BulletinElevationDescriptionModel } from '../models/bulletin-elevation-description.model';
import * as Enums from '../enums/enums';

@Component({
	selector: 'bulletin-detail',
  templateUrl: 'bulletin-detail.component.html'
})
export class BulletinDetailComponent {

	private N: boolean;
	private NW: boolean;
	private W: boolean;
	private SW: boolean;
	private S: boolean;
	private SE: boolean;
	private E: boolean;
	private NE: boolean;

	@Input() bulletinElevationDescription: BulletinElevationDescriptionModel;
  @Input() title: string;
  @Input() disabled: boolean;

  constructor(
  	private translate: TranslateService)
  {
  	this.N = false;
  	this.NW = false;
  	this.W = false;
  	this.SW = false;
  	this.S = false;
  	this.SE = false;
  	this.E = false;
  	this.NE = false;
  }

  ngOnInit() {
  }

  ngAfterContentInit() {
  	for (var i = this.bulletinElevationDescription.aspects.length - 1; i >= 0; i--) {
  		switch (+Enums.Aspect[this.bulletinElevationDescription.aspects[i]]) {
  			case 1:
  				this.N = true;
  				break;
  			case 2:
  				this.NW = true;
  				break;
  			case 3:
  				this.W = true;
  				break;
  			case 4:
  				this.SW = true;
  				break;
  			case 5:
  				this.S = true;
  				break;
  			case 6:
  				this.SE = true;
  				break;
  			case 7:
  				this.E = true;
  				break;
  			case 8:
  				this.NE = true;
  				break;
  			
  			default:
  				break;
  		}
  	}
  }

  selectAspect(e) {
  	if (e.currentTarget.checked) {
  		this.bulletinElevationDescription.addAspect(e.currentTarget.value);
  		switch (e.currentTarget.value) {
  			case "N":
  				this.N = true;
  				break;
  			case "NW":
  				this.NW = true;
  				break;
  			case "W":
  				this.W = true;
  				break;
  			case "SW":
  				this.SW = true;
  				break;
  			case "S":
  				this.S = true;
  				break;
  			case "SE":
  				this.SE = true;
  				break;
  			case "E":
  				this.E = true;
  				break;
  			case "NE":
  				this.NE = true;
  				break;
  			
  			default:
  				break;
  		}
  	} else {
  		this.bulletinElevationDescription.removeAspect(e.currentTarget.value);
  		switch (e.currentTarget.value) {
  			case "N":
  				this.N = false;
  				break;
  			case "NW":
  				this.NW = false;
  				break;
  			case "W":
  				this.W = false;
  				break;
  			case "SW":
  				this.SW = false;
  				break;
  			case "S":
  				this.S = false;
  				break;
  			case "SE":
  				this.SE = false;
  				break;
  			case "E":
  				this.E = false;
  				break;
  			case "NE":
  				this.NE = false;
  				break;
  			
  			default:
  				break;
  		}
  	}
  }
}
