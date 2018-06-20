import * as Enums from '../enums/enums';

export class ChatMessageModel {
	public username: string;
	public time: Date;
	public text: string;
	public chatId: number;

	constructor() {
		this.username = undefined;
		this.time = undefined
		this.text = undefined;
		this.chatId = undefined;
	}

	getTime() : Date{
		return this.time
	}

	setTime(time) {
		this.time = time;
	}

	getUsername() : string {
		return this.username;
	}

	setUsername(username) {
		this.username = username;
	}

	getText() : string {
		return this.text;
	}

	setText(text) {
		this.text = text;
	}

	getChatId() : number {
		return this.chatId;
	}

	setChatId(chatId) {
		this.chatId = chatId;
	}

	toJson() {
		var json = Object();

		if (this.username && this.username != undefined)
			json['username'] = this.username;
		if (this.time && this.time != undefined)
			json['time'] = this.getISOStringWithTimezoneOffset(this.time);
		if (this.text && this.text != undefined && this.text != "")
			json['text'] = this.text;
		if (this.chatId > -1)
			json['chatId'] = this.chatId;

		return json;
	}

	static createFromJson(json) {
		let chatMessage = new ChatMessageModel();

		chatMessage.setUsername(json.username);
		chatMessage.setTime(new Date(json.time));
		chatMessage.setText(json.text);
		chatMessage.setChatId(json.chatId);

		return chatMessage;
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