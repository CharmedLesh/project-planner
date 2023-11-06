import { Project } from './project';
import { Render } from './render';
import { CreateProjectElement } from './create-project-element';
import { LocalStorage } from '../common/local-storage';
import { IProject } from '../../interfaces/interfaces';

export class ProjectsList {
	localStorage: LocalStorage<IProject[]>;
	render: Render;
	projectsInstancesArray: Project[];

	constructor({ status, key }: { status: 'active' | 'finished'; key: string }) {
		this.localStorage = new LocalStorage<IProject[]>({ key });
		this.render = new Render({ status: status });
		this.projectsInstancesArray = this.initProjectsInstancesArray(status);
		this.init();
	}

	private init = () => {
		const projectsListElementsArray = this.createProjectsListElementsArray();
		if (projectsListElementsArray) {
			this.render.renderProjectList(projectsListElementsArray);
		}
	};

	private initProjectsInstancesArray = (status: 'active' | 'finished'): Project[] => {
		const projectsFromLocalStorage: IProject[] | null = this.localStorage.get();
		if (projectsFromLocalStorage) {
			const projectsFromLocalStorageFilteredByStatus: IProject[] = projectsFromLocalStorage.filter(
				project => project.status === status
			);
			if (projectsFromLocalStorageFilteredByStatus.length) {
				let projectsInstancesArray: Project[] = [];
				for (const project of projectsFromLocalStorageFilteredByStatus) {
					const projectInstance: Project = new Project({
						status: project.status,
						title: project.title,
						description: project.description,
						info: project.info
					});
					projectsInstancesArray.push(projectInstance);
				}
				return projectsInstancesArray;
			}
		}
		return [];
	};

	private createProjectsListElementsArray = (): HTMLLIElement[] | null => {
		if (this.projectsInstancesArray.length) {
			let projectsListElementsArray: HTMLLIElement[] = [];
			for (const project of this.projectsInstancesArray) {
				const createProjectElement = new CreateProjectElement({ projectData: project });
				const $project = createProjectElement.createProjectElement();
				projectsListElementsArray.push($project);
			}
			return projectsListElementsArray;
		}
		return null;
	};

	private addNewProjectToLocalStorage = (newProject: Project) => {
		const projects: IProject[] | null = this.localStorage.get();
		if (projects) {
			projects.push(newProject);
			this.localStorage.set(projects);
		} else {
			this.localStorage.set([newProject]);
		}
	};

	addNewProject = (projectData: IProject) => {
		const newProject: Project = new Project({
			status: projectData.status,
			title: projectData.title,
			description: projectData.description,
			info: projectData.info
		});
		this.addNewProjectToLocalStorage(newProject);
	};
}
