import { v4 as uuidv4 } from 'uuid';
import { LocalStorage } from './classes/common/local-storage';
import { ProjectsList } from './classes/projects-list/projects-list';
import { IProject } from './interfaces/interfaces';
import { Project } from './classes/projects-list/project';

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
		$cancelNewProjectModalButton?.addEventListener('click', cancelNewProjectModalButtonClickHandler);
		$newProjectModalForm?.addEventListener('submit', newProjectModalSubmitFormHandler);
		$newProjectModal.style.display = 'flex';
	}
};

const cancelNewProjectModalButtonClickHandler = (): void => {
	if ($newProjectModal) {
		$newProjectModal.style.display = 'none';
		$cancelNewProjectModalButton?.removeEventListener('click', cancelNewProjectModalButtonClickHandler);
		$newProjectModalForm?.removeEventListener('submit', newProjectModalSubmitFormHandler);
		$newProjectModalForm?.reset();
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
	const $project: HTMLLIElement | null = $target.closest('.js-project');
	if ($project) {
		// get project id
		const id: ID | null = $project.getAttribute('data-id');
		// get projects from localstorage
		const projects: IProject[] | null = localStorage.get();
		if (id && projects) {
			// update projects
			const indexToMove = projects.findIndex(project => project.id === id);
			if (indexToMove !== -1) {
				const [project] = projects.splice(indexToMove, 1);
				project.status = project.status === 'active' ? 'finished' : 'active';
				projects.push(project);
				// set updated projects to localstorage
				localStorage.set(projects);
				// remove project from appropriate list
				removeProjectFromAppropriateList(project.status, id);
				// add project to appropriate list
				addProjectToAppropriateList(project);
			}
		}
	}
};

const moreInfoClickHandler = ($target: HTMLButtonElement): void => {
	const $project: HTMLLIElement | null = $target.closest('.js-project');
	if ($project) {
		// get project id
		const id: ID | null = $project.getAttribute('data-id');
		if (id) {
			// get project status
			const $projectList: HTMLDivElement | null = $project.closest('.projects-list');
			const status: 'active' | 'finished' = $projectList?.id === 'active-projects' ? 'active' : 'finished';
			// get project data from appropriate list
			const project: Project | null =
				status === 'active' ? activeProjectsList.getProjectById(id) : finishedProjectsList.getProjectById(id);
			if (project) {
				if ($moreInfoModal && $moreInfoModalTitle && $moreInfoModalDescription && $moreInfoModalInfo) {
					// fill modal with project data
					$moreInfoModalTitle.innerText = project.title;
					$moreInfoModalDescription.innerText = project.description;
					$moreInfoModalInfo.innerText = project.info;
					// apply event listeners to buttons inside modal
					$moreInfoModalCloseButton?.addEventListener('click', closeMoreInfoModalClickHandler);
					// show more info modal filled with new data
					$moreInfoModal.style.display = 'flex';
				} else {
					console.error('Modal element not found.');
				}
			} else {
				console.error(`Project instance for id ${id} not found.`);
			}
		} else {
			console.error('data-id attribute not found.');
		}
	} else {
		console.error('Project element not found.');
	}
};

const closeMoreInfoModalClickHandler = (): void => {
	if ($moreInfoModal) {
		$moreInfoModal.style.display = 'none';
		$moreInfoModalCloseButton?.removeEventListener('click', closeMoreInfoModalClickHandler);
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

		// target is more info button
		if ($target.classList.contains('js-project__more-info-button')) {
			moreInfoClickHandler($target);
		}
	}
});
