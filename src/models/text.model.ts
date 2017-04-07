export class TextModel {
	public languageCode: string;
	public text: string;

	constructor() {
		this.languageCode = undefined;
		this.text = undefined;
	}

	getLanguageCode() {
		return this.languageCode;
	}

	setLanguageCode(languageCode) {
		this.languageCode = languageCode;
	}

	getText() {
		return this.text;
	}

	setText(text) {
		this.text = text;
	}

	toJson() {
		var json = Object();

		if (this.languageCode && this.languageCode != undefined && this.languageCode != "")
			json['languageCode'] = this.languageCode;
		if (this.text && this.text != undefined && this.text != "")
			json['text'] = this.text;

		return json;
	}

	static createFromJson(json) {
		let text = new TextModel();

		text.setLanguageCode(json.languageCode);
		text.setText(json.text);

		return text;
	}
}