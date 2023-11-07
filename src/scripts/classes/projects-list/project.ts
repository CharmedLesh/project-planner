type ID = string;

export class Project {
	id: ID;
	status: 'active' | 'finished';
	title: string;
	description: string;
	info: string;

	constructor({
		id,
		status,
		title,
		description,
		info
	}: {
		id: string;
		status: 'active' | 'finished';
		title: string;
		description: string;
		info: string;
	}) {
		this.id = id;
		this.title = title;
		this.status = status;
		this.description = description;
		this.info = info;
	}
}
