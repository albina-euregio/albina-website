import * as Enums from '../enums/enums';

export class ChatMessageModel {
	public username: string;
	public time: Date;
	public text: string;

	constructor() {
		this.username = undefined;
		this.time = undefined
		this.text = undefined;
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

	toJson() {
		var json = Object();

		if (this.username && this.username != undefined)
			json['username'] = this.username;
		if (this.time && this.time != undefined)
			json['time'] = this.time;
		if (this.text && this.text != undefined && this.text != "")
			json['text'] = this.text;

		return json;
	}

	static createFromJson(json) {
		let chatMessage = new ChatMessageModel();

		chatMessage.setUsername(json.username);
		chatMessage.setTime(new Date(json.time));
		chatMessage.setText(json.text);

		return chatMessage;
	}
}