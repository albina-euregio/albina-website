import { TextModel } from './text.model';
import * as Enums from '../enums/enums';

export class NewsModel {
	public date: Date;
	public title: TextModel[];
	public content: TextModel[];
	public published: boolean;

	constructor() {
		this.date = undefined;
		this.title = undefined;
		this.content = undefined;
		this.published = undefined;
	}

	getDate() {
		return this.date;
	}

	setDate(date) {
		this.date = date;
	}

	getTitle() {
		return this.title;
	}

	getTitleIn(language: Enums.LanguageCode) {
		for (var i = this.title.length - 1; i >= 0; i--) {
			if (this.title[i].getLanguageCode() == language)
				return this.title[i].getText();
		}
	}

	setTitle(title) {
		this.title = title;
	}

	getContent() {
		return this.content;
	}

	getContentIn(language: Enums.LanguageCode) {
		for (var i = this.content.length - 1; i >= 0; i--) {
			if (this.content[i].getLanguageCode() == language)
				return this.content[i].getText();
		}
	}

	setContent(content) {
		this.content = content;
	}

	isPublished() {
		return this.published;
	}

	setPublished(published) {
		this.published = published;
	}

	toJson() {
		var json = Object();

		if (this.date && this.date != undefined)
			json['date'] = this.date;
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
		if (this.published && this.published != undefined)
			json['published'] = this.published;

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

		news.setPublished(json.published);

		return news;
	}
}