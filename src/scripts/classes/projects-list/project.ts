import { v4 as uuidv4 } from 'uuid';

type ID = string;

export class Project {
	id: ID;
	status: 'active' | 'finished';
	title: string;
	description: string;
	info: string;

	constructor({
		status,
		title,
		description,
		info
	}: {
		status: 'active' | 'finished';
		title: string;
		description: string;
		info: string;
	}) {
		this.id = uuidv4();
		this.title = title;
		this.status = status;
		this.description = description;
		this.info = info;
	}
}
