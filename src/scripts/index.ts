import { v4 as uuidv4 } from 'uuid';
import { ProjectsList } from './classes/projects-list/projects-list';
import { IProject } from './interfaces/interfaces';
import { Project } from './classes/projects-list/project';
import { Logger } from './classes/common/logger';

type ID = string;

const activeProjectsKey: string = 'ACTIVE_PROJECTS';
const finishedProjectsKey: string = 'FINISHED_PROJECTS';

// projects lists[]
const activeProjectsList: ProjectsList = new ProjectsList({
	status: 'active',
	key: activeProjectsKey
});
const finishedProjectsList: ProjectsList = new ProjectsList({
	status: 'finished',
	key: finishedProjectsKey
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
// modal
const $modal = document.getElementById('modal') as HTMLDivElement | null;
const $modalNewProjectForm = $modal?.querySelector('.new-project-form') as HTMLFormElement | null;
const $modalNewProjectActiveRadio = $modal?.querySelector('#radio-option-active') as HTMLInputElement | null;
const $modalNewProjectFinishedRadio = $modal?.querySelector('#radio-option-finished') as HTMLInputElement | null;
const $modalCancelNewProjectButton = $modalNewProjectForm?.querySelector(
	'.new-project-form__cancel-button'
) as HTMLButtonElement | null;
const $modalMoreInfo = $modal?.querySelector('.more-info') as HTMLDivElement | null;
const $modalMoreInfoTitle = $modalMoreInfo?.querySelector('.more-info__title') as HTMLParagraphElement | null;
const $modalMoreInfoDescription = $modalMoreInfo?.querySelector(
	'.more-info__description'
) as HTMLParagraphElement | null;
const $modalMoreInfoInfo = $modalMoreInfo?.querySelector('.more-info__info') as HTMLParagraphElement | null;
const $modalMoreInfoDeleteButton = $modalMoreInfo?.querySelector(
	'.more-info__delete-button'
) as HTMLButtonElement | null;
const $modalMoreInfoCloseButton = $modalMoreInfo?.querySelector('.more-info__close-button') as HTMLButtonElement | null;

// helpers
// get project + remove from list + create new project in oposite list
const takeActionOnProject = (status: string, id: ID): void => {
	try {
		switch (status) {
			case 'active':
			case 'active-projects':
				// get project
				const activeProject: Project | null = activeProjectsList.getProjectById(id);
				if (!activeProject) {
					throw new Error('Project not found.');
				}
				// remove project from active projects list
				activeProjectsList.removeProjectById(id);
				// add project to finished projects list
				finishedProjectsList.addNewProject(activeProject);
				break;
			case 'finished':
			case 'finished-projects':
				// get project
				const finishedProject: Project | null = finishedProjectsList.getProjectById(id);
				if (!finishedProject) {
					throw new Error('Project not found.');
				}
				// remove project from finished projects list
				finishedProjectsList.removeProjectById(id);
				// add project to active projects list
				activeProjectsList.addNewProject(finishedProject);
				break;
			default:
				throw new Error('Unable to determine project list status. Check project list id.');
		}
	} catch (error) {
		if (error instanceof Error) {
			Logger.logError(error.message);
		}
	}
};

// open new project modal
const openNewProjectModal = (status: 'active' | 'finished') => {
	console.log(status);
	try {
		if (!$modal || !$modalNewProjectForm || !$modalNewProjectActiveRadio || !$modalNewProjectFinishedRadio) {
			throw new Error('Modal element not found');
		}
		if (status === 'active') {
			$modalNewProjectActiveRadio.checked = true;
		}
		if (status === 'finished') {
			console.log('check finished radio triggered');
			console.log($modalNewProjectFinishedRadio);
			$modalNewProjectFinishedRadio.checked = true;
		}
		$modal.style.display = 'flex';
		$modalNewProjectForm.style.display = 'block';
	} catch (error) {
		if (error instanceof Error) {
			Logger.logError(error.message);
		}
	}
};

// close new project modal
const closeNewProjectModal = () => {
	try {
		if (!$modal || !$modalNewProjectForm) {
			throw new Error('Modal element not found');
		}
		$modal.style.display = 'none';
		$modalNewProjectForm.style.display = 'none';
		$modalNewProjectForm.reset();
	} catch (error) {
		if (error instanceof Error) {
			Logger.logError(error.message);
		}
	}
};

// open more info modal
const openMoreInfoModal = () => {
	try {
		if (!$modal || !$modalMoreInfo) {
			throw new Error('Modal element not found');
		}
		$modal.style.display = 'flex';
		$modalMoreInfo.style.display = 'block';
	} catch (error) {
		if (error instanceof Error) {
			Logger.logError(error.message);
		}
	}
};

const closeMoreInfoModal = () => {
	try {
		if (!$modal || !$modalMoreInfo) {
			throw new Error('Modal element not found.');
		}
		$modal.style.display = 'none';
		$modalMoreInfo.style.display = 'none';
	} catch (error) {
		if (error instanceof Error) {
			Logger.logError(error.message);
		}
	}
};

// handlers
const newProjectModalSubmitFormHandler = (event: SubmitEvent): void => {
	event.preventDefault();
	const $target = event.target as HTMLFormElement;
	const formData = new FormData($target);
	const formValues = Object.fromEntries(formData);
	const status = formValues.status as 'active' | 'finished';
	const projectData: IProject = {
		id: uuidv4(),
		title: formValues.title as string,
		description: formValues.description as string,
		info: formValues.info as string
	};
	if (status === 'active') {
		activeProjectsList.addNewProject(projectData);
	}
	if (status === 'finished') {
		finishedProjectsList.addNewProject(projectData);
	}
	closeNewProjectModal();
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
		// get project list id
		const $projectList: HTMLDivElement | null = $project.closest('.projects-list');
		if (!$projectList) {
			throw new Error('Project list element not found.');
		}
		const projectListId: string | null = $projectList.id;
		if (!projectListId) {
			throw new Error('Project list id not found.');
		}
		// get project + remove from previous list + create new project in oposite list
		takeActionOnProject(projectListId, id);
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
		if (!$projectList) {
			throw new Error('Project list element not found.');
		}
		const projectListId: string | null = $projectList.id;
		if (!projectListId) {
			throw new Error('Project list id not found.');
		}
		if (projectListId !== 'active-projects' && projectListId !== 'finished-projects') {
			throw new Error('Project list id error.');
		}
		const status: 'active' | 'finished' = projectListId === 'active-projects' ? 'active' : 'finished';
		// get project data from appropriate list
		const project: Project | null =
			status === 'active' ? activeProjectsList.getProjectById(id) : finishedProjectsList.getProjectById(id);
		if (!project) {
			throw new Error(`Project instance for id ${id} not found.`);
		}
		if (!$modalMoreInfo || !$modalMoreInfoTitle || !$modalMoreInfoDescription || !$modalMoreInfoInfo) {
			throw new Error('Modal element not found.');
		}
		// fill modal with project data
		$modalMoreInfo.setAttribute('data-id', project.id);
		$modalMoreInfoTitle.innerText = project.title;
		$modalMoreInfoDescription.innerText = project.description;
		$modalMoreInfoInfo.innerText = project.info;
		// apply event listeners to buttons inside modal
		const closeHandler = () => closeMoreInfoModalButtonClickHandler(closeHandler, deleteHandler);
		const deleteHandler = () => deleteProjectButtonClickHandler(id, status, closeHandler, deleteHandler);
		$modalMoreInfoCloseButton?.addEventListener('click', closeHandler);
		$modalMoreInfoDeleteButton?.addEventListener('click', deleteHandler);
		// show more info modal filled with new data
		openMoreInfoModal();
	} catch (error) {
		if (error instanceof Error) {
			Logger.logError(error.message);
		}
	}
};

function closeMoreInfoModalButtonClickHandler(closeHandler: () => void, deleteHandler: () => void): void {
	try {
		closeMoreInfoModal();
		$modalMoreInfoCloseButton?.removeEventListener('click', closeHandler);
		$modalMoreInfoDeleteButton?.removeEventListener('click', deleteHandler);
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
		// invoke delete method in appropriate list
		switch (status) {
			case 'active':
				activeProjectsList.removeProjectById(id);
				break;
			case 'finished':
				finishedProjectsList.removeProjectById(id);
				break;
			default:
				throw new Error('Status parameter error.');
		}
		// close more info modal
		closeMoreInfoModalButtonClickHandler(closeHandler, deleteHandler);
	} catch (error) {
		if (error instanceof Error) {
			Logger.logError(error.message);
		}
	}
}

// listeners
window.addEventListener('load', () => {
	$modalCancelNewProjectButton?.addEventListener('click', closeNewProjectModal);
	$modalNewProjectForm?.addEventListener('submit', newProjectModalSubmitFormHandler);
});

document.addEventListener('click', (e: any) => {
	const $target = e.target;

	if ($target) {
		// target is add new active project button
		if ($target === $addActiveProjectButton) {
			openNewProjectModal('active');
		}

		// target is add new finished project button
		if ($target === $addFinishedProjectButton) {
			openNewProjectModal('finished');
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
