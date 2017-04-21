import * as Enums from '../enums/enums';

export class TextModel {
	public languageCode: Enums.LanguageCode;
	public text: string;

	constructor() {
		this.languageCode = undefined;
		this.text = undefined;
	}

	getLanguageCode() {
		return this.languageCode;
	}

	setLanguageCode(languageCode: Enums.LanguageCode) {
		this.languageCode = languageCode;
	}

	getText() {
		return this.text;
	}

	setText(text: string) {
		this.text = text;
	}

	toJson() {
		var json = Object();

		if (this.languageCode && this.languageCode != undefined)
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