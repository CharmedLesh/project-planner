export interface IProject {
	id: string;
	status: 'active' | 'finished';
	title: string;
	description: string;
	info: string;
}
