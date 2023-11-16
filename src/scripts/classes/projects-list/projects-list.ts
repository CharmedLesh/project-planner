import { Project } from './project';
import { Render } from './render';
import { CreateProjectElement } from './create-project-element';
import { IProject } from '../../interfaces/interfaces';
import { LocalStorage } from '../common/local-storage';

type ID = string;

export class ProjectsList {
	status: 'active' | 'finished';
	projectsInstancesArray: Project[];
	localStorage: LocalStorage<IProject[]>;
	createProjectElement: CreateProjectElement;
	render: Render;

	constructor({ status, key }: { status: 'active' | 'finished'; key: string }) {
		this.status = status;
		this.localStorage = new LocalStorage<IProject[]>({ key });
		this.projectsInstancesArray = this.initProjectsInstancesArray();
		this.createProjectElement = new CreateProjectElement({ status: status });
		this.render = new Render({ status: status });
		this.invokeRerender();
	}

	private initProjectsInstancesArray = (): Project[] => {
		const projectsFromLocalStorage: IProject[] | null = this.localStorage.get();
		if (!projectsFromLocalStorage || !projectsFromLocalStorage.length) {
			return [];
		}
		let projectsInstancesArray: Project[] = [];
		for (const project of projectsFromLocalStorage) {
			const projectInstance: Project = new Project({
				id: project.id,
				title: project.title,
				description: project.description,
				info: project.info
			});
			projectsInstancesArray.push(projectInstance);
		}
		return projectsInstancesArray;
	};

	private invokeRerender = (): void => {
		const projectsListElementsArray = this.createProjectElement.createProjectsElementsArray(
			this.projectsInstancesArray
		);
		if (projectsListElementsArray) {
			this.render.renderProjectList(projectsListElementsArray);
		}
	};

	addNewProject = (projectData: IProject | Project): void => {
		const newProject: Project = new Project({
			id: projectData.id,
			title: projectData.title,
			description: projectData.description,
			info: projectData.info
		});
		this.projectsInstancesArray.push(newProject);
		this.localStorage.add(projectData);
		const $project = this.createProjectElement.createProjectElement(newProject);
		this.render.renderProject($project);
	};

	removeProjectById = (id: ID): void => {
		// remove project from instances array
		const indexToRemove: number = this.projectsInstancesArray.findIndex(project => project.id === id);
		this.projectsInstancesArray.splice(indexToRemove, 1);
		// remove project from localStorage (reset localstorage)
		this.localStorage.set(this.projectsInstancesArray);
		// unrender project
		this.render.unrenderProjectById(id);
	};

	getProjectById = (id: ID): Project | null => {
		const project = this.projectsInstancesArray.find(project => project.id === id);
		return project ? project : null;
	};
}
