import { v4 as uuidv4 } from 'uuid';
import { LocalStorage } from './classes/common/local-storage';
import { ProjectsList } from './classes/projects-list/projects-list';
import { IProject } from './interfaces/interfaces';
import { Project } from './classes/projects-list/project';
import { Logger } from './classes/common/logger';

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
// project lists
const $activeProjects = document.getElementById('active-projects') as HTMLDivElement | null;
const $addActiveProjectButton = $activeProjects?.querySelector(
	'.projects-list__add-button'
) as HTMLButtonElement | null;
const $finishedProjects = document.getElementById('finished-projects') as HTMLDivElement | null;
const $addFinishedProjectButton = $finishedProjects?.querySelector(
	'.projects-list__add-button'
) as HTMLButtonElement | null;
// add new project modal
const $newProjectModal = document.getElementById('new-project-modal') as HTMLDivElement | null;
const $cancelNewProjectModalButton = $newProjectModal?.querySelector(
	'.new-project-modal__cancel-button'
) as HTMLButtonElement | null;
const $newProjectModalForm = $newProjectModal?.querySelector('.new-project-modal__form') as HTMLFormElement | null;
// more info modal
const $moreInfoModal = document.getElementById('more-info-modal') as HTMLDivElement | null;
const $moreInfoModalTitle = $moreInfoModal?.querySelector('.more-info-modal__title') as HTMLParagraphElement | null;
const $moreInfoModalDescription = $moreInfoModal?.querySelector(
	'.more-info-modal__description'
) as HTMLParagraphElement | null;
const $moreInfoModalInfo = $moreInfoModal?.querySelector('.more-info-modal__info') as HTMLParagraphElement | null;
const $moreInfoModalDeleteButton = $moreInfoModal?.querySelector(
	'.more-info-modal__delete-button'
) as HTMLButtonElement | null;
const $moreInfoModalCloseButton = $moreInfoModal?.querySelector(
	'.more-info-modal__close-button'
) as HTMLButtonElement | null;

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
			Logger.logError('Status argument error.');
	}
};

const removeProjectFromAppropriateList = (status: 'active' | 'finished', id: ID) => {
	if (status === 'active') {
		activeProjectsList.removeProjectById(id);
	}
	if (status === 'finished') {
		finishedProjectsList.removeProjectById(id);
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
	try {
		if (!$newProjectModal) {
			throw new Error('new-project-modal element not found');
		}
		$cancelNewProjectModalButton?.addEventListener('click', cancelNewProjectModalButtonClickHandler);
		$newProjectModalForm?.addEventListener('submit', newProjectModalSubmitFormHandler);
		$newProjectModal.style.display = 'flex';
	} catch (error) {
		if (error instanceof Error) {
			Logger.logError(error.message);
		}
	}
};

const cancelNewProjectModalButtonClickHandler = (): void => {
	try {
		if (!$newProjectModal) {
			throw new Error('new-project-modal element not found');
		}
		$newProjectModal.style.display = 'none';
		$cancelNewProjectModalButton?.removeEventListener('click', cancelNewProjectModalButtonClickHandler);
		$newProjectModalForm?.removeEventListener('submit', newProjectModalSubmitFormHandler);
		$newProjectModalForm?.reset();
	} catch (error) {
		if (error instanceof Error) {
			Logger.logError(error.message);
		}
	}
};

const newProjectModalSubmitFormHandler = (event: SubmitEvent): void => {
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
	try {
		const $project: HTMLLIElement | null = $target.closest('.js-project');
		if (!$project) {
			throw new Error('Project element not found.');
		}
		// get project id
		const id: ID | null = $project.getAttribute('data-id');
		if (!id) {
			throw new Error('data-id attribute not found.');
		}
		// get projects from localstorage
		const projects: IProject[] | null = localStorage.get();
		if (!projects) {
			throw new Error('Projects not found in localstorage.');
		}
		// update projects
		const indexToMove = projects.findIndex(project => project.id === id);
		if (indexToMove === -1) {
			throw new Error(`Project with id ${id} not found in localstorage.`);
		}
		const [project] = projects.splice(indexToMove, 1);
		project.status = project.status === 'active' ? 'finished' : 'active';
		projects.push(project);
		// set updated projects to localstorage
		localStorage.set(projects);
		// remove project from appropriate list
		removeProjectFromAppropriateList(project.status === 'active' ? 'finished' : 'active', id);
		// add project to appropriate list
		addProjectToAppropriateList(project);
	} catch (error) {
		if (error instanceof Error) {
			Logger.logError(error.message);
		}
	}
};

const moreInfoClickHandler = ($target: HTMLButtonElement): void => {
	try {
		const $project: HTMLLIElement | null = $target.closest('.js-project');
		if (!$project) {
			throw new Error('Project element not found.');
		}
		// get project id
		const id: ID | null = $project.getAttribute('data-id');
		if (!id) {
			throw new Error('data-id attribute not found.');
		}
		// get project status
		const $projectList: HTMLDivElement | null = $project.closest('.projects-list');
		const status: 'active' | 'finished' = $projectList?.id === 'active-projects' ? 'active' : 'finished';
		// get project data from appropriate list
		const project: Project | null =
			status === 'active' ? activeProjectsList.getProjectById(id) : finishedProjectsList.getProjectById(id);
		if (!project) {
			throw new Error(`Project instance for id ${id} not found.`);
		}
		if (!$moreInfoModal || !$moreInfoModalTitle || !$moreInfoModalDescription || !$moreInfoModalInfo) {
			throw new Error('Modal element not found.');
		}
		// fill modal with project data
		$moreInfoModal.setAttribute('data-id', project.id);
		$moreInfoModalTitle.innerText = project.title;
		$moreInfoModalDescription.innerText = project.description;
		$moreInfoModalInfo.innerText = project.info;
		// apply event listeners to buttons inside modal
		const closeHandler = () => closeMoreInfoModalButtonClickHandler(closeHandler, deleteHandler);
		const deleteHandler = () => deleteProjectButtonClickHandler(id, status, closeHandler, deleteHandler);
		$moreInfoModalCloseButton?.addEventListener('click', closeHandler);
		$moreInfoModalDeleteButton?.addEventListener('click', deleteHandler);
		// show more info modal filled with new data
		$moreInfoModal.style.display = 'flex';
	} catch (error) {
		if (error instanceof Error) {
			Logger.logError(error.message);
		}
	}
};

function closeMoreInfoModalButtonClickHandler(closeHandler: () => void, deleteHandler: () => void): void {
	try {
		if (!$moreInfoModal) {
			throw new Error('more-info-modal element not found.');
		}
		$moreInfoModal.style.display = 'none';
		$moreInfoModalCloseButton?.removeEventListener('click', closeHandler);
		$moreInfoModalDeleteButton?.removeEventListener('click', deleteHandler);
	} catch (error) {
		if (error instanceof Error) {
			Logger.logError(error.message);
		}
	}
}

function deleteProjectButtonClickHandler(
	id: ID,
	status: 'active' | 'finished',
	closeHandler: () => void,
	deleteHandler: () => void
): void {
	try {
		const projects: IProject[] | null = localStorage.get();
		if (!projects) {
			throw new Error('Projects not found in localstorage.');
		}
		// update localstorage
		const newProjects = projects.filter(project => project.id !== id);
		localStorage.set(newProjects);
		// remove project instance from appropriate list
		removeProjectFromAppropriateList(status, id);
		// close more info modal
		closeMoreInfoModalButtonClickHandler(closeHandler, deleteHandler);
	} catch (error) {
		if (error instanceof Error) {
			Logger.logError(error.message);
		}
	}
}

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

		// target is more info button
		if ($target.classList.contains('js-project__more-info-button')) {
			moreInfoClickHandler($target);
		}
	}
});
