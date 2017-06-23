import { TextModel } from './text.model';
import * as Enums from '../enums/enums';

export class NewsModel {
	public id: string;
	public date: Date;
	public title: TextModel[];
	public content: TextModel[];
	public status: Enums.NewsStatus;

	constructor() {
		this.date = undefined;
		this.title = undefined;
		this.content = undefined;
		this.status = undefined;
	}

	getId() : string {
		return this.id;
	}

	setId(id: string) {
		this.id = id;
	}

	getDate() : Date {
		return this.date;
	}

	setDate(date: Date) {
		this.date = date;
	}

	getTitle() : TextModel[] {
		return this.title;
	}

	getTitleIn(language: Enums.LanguageCode) : string {
		for (var i = this.title.length - 1; i >= 0; i--) {
			if (this.title[i].getLanguageCode() == language)
				return this.title[i].getText();
		}
	}

	getTitleInString(language: string) : string {
		return this.getTitleIn(Enums.LanguageCode[language]);
	}

	setTitle(title: TextModel[]) {
		this.title = title;
	}

	getContent() : TextModel[] {
		return this.content;
	}

	getContentIn(language: Enums.LanguageCode) : string {
		for (var i = this.content.length - 1; i >= 0; i--) {
			if (this.content[i].getLanguageCode() == language)
				return this.content[i].getText();
		}
	}

	setContent(content: TextModel[]) {
		this.content = content;
	}

	getStatus() : Enums.NewsStatus {
		return this.status;
	}

	setStatus(status: Enums.NewsStatus) {
		this.status = status;
	}

	toJson() {
		var json = Object();

		if (this.date && this.date != undefined)
			json['date'] = this.getISOStringWithTimezoneOffset(this.date);
		if (this.title && this.title.length > 0) {
			let title = [];
			for (let i = 0; i <= this.title.length - 1; i++) {
				title.push(this.title[i].toJson());
			}
			json['title'] = title;
		}
		if (this.content && this.content.length > 0) {
			let content = [];
			for (let i = 0; i <= this.content.length - 1; i++) {
				content.push(this.content[i].toJson());
			}
			json['content'] = content;
		}
		if (this.status && this.status != undefined)
			json['status'] = this.status;

		return json;
	}

	static createFromJson(json) {
		let news = new NewsModel();
		
		news.setDate(new Date(json.date));

		let jsonTitle = json.title;
		let title = new Array<TextModel>();
		for (let i in jsonTitle) {
			title.push(TextModel.createFromJson(jsonTitle[i]));
		}
		news.setTitle(title);

		let jsonContent = json.content;
		let content = new Array<TextModel>();
		for (let i in jsonContent) {
			content.push(TextModel.createFromJson(jsonContent[i]));
		}
		news.setContent(content);

		news.setStatus(Enums.NewsStatus[<string>json.status]);

		return news;
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