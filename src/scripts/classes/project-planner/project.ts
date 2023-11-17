type ID = string;

export class Project {
	id: ID;
	title: string;
	description: string;
	info: string;

	constructor({ id, title, description, info }: { id: string; title: string; description: string; info: string }) {
		this.id = id;
		this.title = title;
		this.description = description;
		this.info = info;
	}
}
