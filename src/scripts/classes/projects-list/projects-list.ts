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

	addNewProject = (projectData: IProject) => {
		console.log(projectData.status, projectData.title, projectData.description, projectData.info);
	};
}
