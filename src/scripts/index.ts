import { v4 as uuidv4 } from 'uuid';
import { LocalStorage } from './classes/common/local-storage';
import { ProjectsList } from './classes/projects-list/projects-list';
import { IProject } from './interfaces/interfaces';

type ID = string;

const key: string = 'PROJECTS';
const localStorage = new LocalStorage<IProject[]>({ key: key });
const initialProjectsFromLocalStorage: IProject[] | null = localStorage.get();

// projects lists
const activeProjectsList: ProjectsList = new ProjectsList({
	status: 'active',
	projectsFromLocalStorage: initialProjectsFromLocalStorage
});
const finishedProjectsList: ProjectsList = new ProjectsList({
	status: 'finished',
	projectsFromLocalStorage: initialProjectsFromLocalStorage
});

// elements
const $activeProjects = document.getElementById('active-projects') as HTMLDivElement | null;
const $addActiveProjectButton = $activeProjects?.querySelector(
	'.projects-list__add-button'
) as HTMLButtonElement | null;
const $finishedProjects = document.getElementById('finished-projects') as HTMLDivElement | null;
const $addFinishedProjectButton = $finishedProjects?.querySelector(
	'.projects-list__add-button'
) as HTMLButtonElement | null;

const $newProjectModal = document.getElementById('new-project-modal') as HTMLDivElement | null;
const $cancelNewProjectModalButton = $newProjectModal?.querySelector(
	'.new-project-modal__cancel-button'
) as HTMLButtonElement | null;
const $newProjectModalForm = $newProjectModal?.querySelector('.new-project-modal__form') as HTMLFormElement | null;

// helpers
const addNewProject = (projectData: IProject): void => {
	switch (projectData.status) {
		case 'active':
			localStorage.add(projectData);
			activeProjectsList.addNewProject(projectData);
			break;
		case 'finished':
			localStorage.add(projectData);
			finishedProjectsList.addNewProject(projectData);
			break;
		default:
			console.error('Status argument error.');
	}
};

const removeProjectFromAppropriateList = (newStatus: 'active' | 'finished', id: ID) => {
	if (newStatus === 'active') {
		finishedProjectsList.removeProjectById(id);
	}
	if (newStatus === 'finished') {
		activeProjectsList.removeProjectById(id);
	}
};

const addProjectToAppropriateList = (project: IProject) => {
	if (project.status === 'active') {
		activeProjectsList.addNewProject(project);
	}
	if (project.status === 'finished') {
		finishedProjectsList.addNewProject(project);
	}
};

// handlers
const addNewProjectButtonClickHandler = (): void => {
	if ($newProjectModal) {
		$newProjectModal.style.display = 'flex';
	}
	$cancelNewProjectModalButton?.addEventListener('click', cancelNewProjectModalButtonClickHandler);
	$newProjectModalForm?.addEventListener('submit', submitNewProjectModalFormHandler);
};

const cancelNewProjectModalButtonClickHandler = (): void => {
	if ($newProjectModal) {
		$newProjectModal.style.display = 'none';
		$newProjectModalForm?.reset();
	}
	$cancelNewProjectModalButton?.removeEventListener('click', cancelNewProjectModalButtonClickHandler);
	$newProjectModalForm?.removeEventListener('submit', submitNewProjectModalFormHandler);
};

const submitNewProjectModalFormHandler = (event: SubmitEvent): void => {
	event.preventDefault();
	const $target = event.target as HTMLFormElement;
	const formData = new FormData($target);
	const formValues = Object.fromEntries(formData);
	const projectData: IProject = {
		id: uuidv4(),
		status: formValues.status as 'active' | 'finished',
		title: formValues.title as string,
		description: formValues.description as string,
		info: formValues.info as string
	};
	addNewProject(projectData);
	cancelNewProjectModalButtonClickHandler();
};

const actionButtonClickHandler = ($target: HTMLButtonElement): void => {
	const $project: HTMLLIElement | null = $target.closest('.js-project');
	if ($project) {
		// get project id
		const projectId: string | null = $project.getAttribute('data-id');
		// get projects from localstorage
		const projects: IProject[] | null = localStorage.get();
		if (projectId && projects) {
			// update projects
			const indexToMove = projects.findIndex(project => project.id === projectId);
			if (indexToMove !== -1) {
				const [project] = projects.splice(indexToMove, 1);
				project.status = project.status === 'active' ? 'finished' : 'active';
				projects.push(project);
				// set updated projects to localstorage
				localStorage.set(projects);
				// remove project from appropriate list
				removeProjectFromAppropriateList(project.status, projectId);
				// add project to appropriate list
				addProjectToAppropriateList(project);
			}
		}
	}
};

// listeners
document.addEventListener('click', (e: any) => {
	const $target = e.target;

	if ($target) {
		// target is add new project button
		if ($target === $addActiveProjectButton || $target === $addFinishedProjectButton) {
			addNewProjectButtonClickHandler();
		}

		//target is action button
		if ($target.classList.contains('js-project__action-button')) {
			actionButtonClickHandler($target);
		}
	}
});
