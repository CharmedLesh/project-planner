import { LocalStorage } from './classes/common/local-storage';
import { ProjectsList } from './classes/projects-list/projects-list';
import { IProject } from './interfaces/interfaces';

const key = 'PROJECTS';
const activeProjectsList: ProjectsList = new ProjectsList({ status: 'active', key: key });
const finishedProjectsList: ProjectsList = new ProjectsList({ status: 'finished', key: key });

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
		status: formValues.status as 'active' | 'finished',
		title: formValues.title as string,
		description: formValues.description as string,
		info: formValues.info as string
	};
	addNewProject(projectData);
	cancelNewProjectModalButtonClickHandler();
};

const addNewProject = (projectData: IProject): void => {
	switch (projectData.status) {
		case 'active':
			activeProjectsList.addNewProject(projectData);
			break;
		case 'finished':
			finishedProjectsList.addNewProject(projectData);
			break;
		default:
			console.error('Status argument error.');
	}
};

const changeProjectStatusById = (projects: IProject[], id: string): void => {
	console.log(projects);
	const projectToUpdate = projects.find(project => project.id === id);

	if (projectToUpdate) {
		projectToUpdate.status = projectToUpdate.status === 'active' ? 'finished' : 'active';
		console.log(projects);
	} else {
		console.error(`Project with ID ${id} not found`);
	}
};

const actionButtonClickHandler = ($target: HTMLButtonElement) => {
	const $project = $target.closest('.js-project');
	if ($project) {
		const projectId: string | null = $project.getAttribute('data-id');
		if (projectId) {
			const localStorage = new LocalStorage<IProject[]>({ key: key });
			const projects = localStorage.get();
			if (projects) {
				changeProjectStatusById(projects, projectId);
				localStorage.set(projects);
			} else {
				console.error('Error occured while getting project from localstorage.');
			}
		} else {
			console.error('data-id attribute not found.');
		}
	} else {
		console.error('Project not found');
	}
};

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
