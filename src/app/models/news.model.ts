import { TextModel } from './text.model';

export class NewsModel {
	public date: Date;
	public title: TextModel[];
	public content: TextModel[];

	constructor() {
		this.date = undefined;
		this.title = undefined;
		this.content = undefined;
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

	setTitle(title) {
		this.title = title;
	}

	getContent() {
		return this.content;
	}

	setContent(content) {
		this.content = content;
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
		news.setTitle(content);

		return news;
	}
}