import { AuthorModel } from './author.model';
import { LocationModel } from './location.model';
import { DatetimeModel } from './datetime.model';
import { ConditionsModel } from './conditions.model';


export class InfoModel {
	public author: AuthorModel;
	public location: LocationModel;
	public datetime: DatetimeModel;
	public conditions: ConditionsModel;
	public comment: string;

	constructor(info?) {
		this.author = new AuthorModel();
		this.location = new LocationModel();
		this.datetime = new DatetimeModel();
		this.conditions = new ConditionsModel();

		if (info != null) {
			this.setAuthor(info.getAuthor());
			this.setLocation(info.getLocation());
			this.setDatetime(info.getDatetime());
			this.setConditions(info.getConditions());
			this.setComment(info.getComment());
		}
	}

	getAuthor() {
		return this.author;
	}

	setAuthor(author) {
		this.author = author;
	}

	getLocation() {
		return this.location;
	}

	setLocation(location) {
		this.location = location;
	}

	getDatetime() {
		return this.datetime;
	}

	setDatetime(datetime) {
		this.datetime = datetime;
	}

	getConditions() {
		return this.conditions;
	}

	setConditions(conditions) {
		this.conditions = conditions;
	}

	getComment() {
		return this.comment;
	}

	setComment(comment) {
		this.comment = comment;
	}
}