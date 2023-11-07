import { Project } from './project';
import { Render } from './render';
import { CreateProjectElement } from './create-project-element';
import { IProject } from '../../interfaces/interfaces';

type ID = string;

export class ProjectsList {
	status: 'active' | 'finished';
	createProjectElement: CreateProjectElement;
	render: Render;
	projectsInstancesArray: Project[];

	constructor({
		status,
		projectsFromLocalStorage
	}: {
		status: 'active' | 'finished';
		projectsFromLocalStorage: IProject[] | null;
	}) {
		this.status = status;
		this.projectsInstancesArray = this.initProjectsInstancesArray(projectsFromLocalStorage);
		this.createProjectElement = new CreateProjectElement();
		this.render = new Render({ status: status });
		this.invokeRerender();
	}

	private initProjectsInstancesArray = (projectsFromLocalStorage: IProject[] | null): Project[] => {
		if (projectsFromLocalStorage && projectsFromLocalStorage.length) {
			const projectsFromLocalStorageFilteredByStatus: IProject[] = projectsFromLocalStorage.filter(
				project => project.status === this.status
			);
			if (projectsFromLocalStorageFilteredByStatus.length) {
				let projectsInstancesArray: Project[] = [];
				for (const project of projectsFromLocalStorageFilteredByStatus) {
					const projectInstance: Project = new Project({
						id: project.id,
						status: project.status,
						title: project.title,
						description: project.description,
						info: project.info
					});
					projectsInstancesArray.push(projectInstance);
				}
				return projectsInstancesArray;
			}
			return [];
		}
		return [];
	};

	private invokeRerender = () => {
		const projectsListElementsArray = this.createProjectElement.createProjectsElementsArray(
			this.projectsInstancesArray
		);
		if (projectsListElementsArray) {
			this.render.renderProjectList(projectsListElementsArray);
		}
	};

	addNewProject = (projectData: IProject) => {
		const newProject: Project = new Project({
			id: projectData.id,
			status: projectData.status,
			title: projectData.title,
			description: projectData.description,
			info: projectData.info
		});
		this.projectsInstancesArray.push(newProject);
		const $project = this.createProjectElement.createProjectElement(newProject);
		this.render.renderProject($project);
	};

	removeProjectById = (id: ID) => {
		// remove project from instances array
		const indexToRemove: number = this.projectsInstancesArray.findIndex(project => project.id === id);
		this.projectsInstancesArray.splice(indexToRemove, 1);
		// unrender project
		this.render.unrenderProjectById(id);
	};
}
