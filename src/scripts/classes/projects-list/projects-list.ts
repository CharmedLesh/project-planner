import { IProject } from '../../interfaces/interfaces';
import { LocalStorage } from '../common/local-storage';
import { Project } from './project';

export class ProjectsList {
	localStorage: LocalStorage<IProject[]>;
	projectsInstancesArray: Project[];

	constructor({ status, key }: { status: 'active' | 'finished'; key: string }) {
		this.localStorage = new LocalStorage<IProject[]>({ key });
		this.projectsInstancesArray = this.initProjectsInstancesArray(status);
	}

	private initProjectsInstancesArray = (status: 'active' | 'finished'): Project[] => {
		const projectsFromLocalStorage: IProject[] | null = this.localStorage.get();
		if (projectsFromLocalStorage) {
			const projectsFromLocalStorageFilteredByStatus: IProject[] = projectsFromLocalStorage.filter(project => {
				project.status === status;
			});
			if (projectsFromLocalStorageFilteredByStatus.length) {
				let projectsInstancesArray: Project[] = [];
				for (const projectFromLocalStorage of projectsFromLocalStorage) {
					const projectInstance: Project = new Project({
						status: projectFromLocalStorage.status,
						title: projectFromLocalStorage.title,
						description: projectFromLocalStorage.description,
						info: projectFromLocalStorage.info
					});
					projectsInstancesArray.push(projectInstance);
				}
				return projectsInstancesArray;
			}
		}
		return [];
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
