import * as Enums from '../enums/enums';

export class BulletinUpdateModel {
	public region: string;
	public date: Date;
	public status: Enums.BulletinStatus;

	constructor() {
		this.region = undefined;
		this.date = undefined;
		this.status = undefined;
	}

	getRegion() {
		return this.region;
	}

	setRegion(region: string) {
		this.region = region;
	}

	getDate() {
		return this.date;
	}

	setDate(date: Date) {
		this.date = date;
	}

	getStatus() {
		return this.status;
	}

	setStatus(status: Enums.BulletinStatus) {
		this.status = status;
	}

	toJson() {
		var json = Object();

		if (this.region && this.region != undefined)
			json['region'] = this.region;
		if (this.date && this.date != undefined)
			json['date'] = this.getISOStringWithTimezoneOffset(this.date);
		if (this.status != null && this.status != undefined)
			json['status'] = this.status;

		return json;
	}

	static createFromJson(json) {
		let bulletinUpdate = new BulletinUpdateModel();

		bulletinUpdate.setRegion(json.region);
		bulletinUpdate.setDate(new Date(json.date));
		bulletinUpdate.setStatus(Enums.BulletinStatus[<string>json.status]);

		return bulletinUpdate;
	}

	private getISOStringWithTimezoneOffset(date: Date) {
		let offset = -date.getTimezoneOffset();
		let dif = offset >= 0 ? '+' : '-';

		return date.getFullYear() + 
			'-' + this.extend(date.getMonth() + 1) +
			'-' + this.extend(date.getDate()) +
			'T' + this.extend(date.getHours()) +
			':' + this.extend(date.getMinutes()) +
			':' + this.extend(date.getSeconds()) +
			dif + this.extend(offset / 60) +
			':' + this.extend(offset % 60);
	}

	private extend(num: number) {
		let norm = Math.abs(Math.floor(num));
		return (norm < 10 ? '0' : '') + norm;
	}
}