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

const addNewProjectButtonCickHandler = (status: 'active' | 'finished') => {
	if ($newProjectModal) {
		$newProjectModal.style.display = 'flex';
		$cancelNewProjectModalButton?.addEventListener('click', cancelNewProjectModalButtonClickHandler);
		$newProjectModalForm?.addEventListener('submit', event => submitNewProjectModalFormHandler(event, status));
	}
};

const cancelNewProjectModalButtonClickHandler = () => {
	if ($newProjectModal) {
		$newProjectModal.style.display = 'none';
	}
	$cancelNewProjectModalButton?.removeEventListener('click', cancelNewProjectModalButtonClickHandler);
};

const submitNewProjectModalFormHandler = (event: SubmitEvent, status: 'active' | 'finished') => {
	event.preventDefault();
	const $target = event.target as HTMLFormElement | null;
	if ($target) {
		const formData = new FormData($target);
		const formValues = Object.fromEntries(formData);
		const projectData: IProject = {
			status: status,
			title: formValues.title as string,
			description: formValues.description as string,
			info: formValues.info as string
		};

		switch (status) {
			case 'active':
				activeProjectsList.addNewProject(projectData);
				break;
			case 'finished':
				finishedProjectsList.addNewProject(projectData);
				break;
			default:
				console.error('Status argument error.');
		}

		$target.reset();
	}
};

document.addEventListener('click', (e: any) => {
	const $target = e.target;

	if ($target) {
		// target is add active project button
		if ($target === $addActiveProjectButton) {
			addNewProjectButtonCickHandler('active');
		}
		// target is add finished project button
		if ($target === $addFinishedProjectButton) {
			addNewProjectButtonCickHandler('finished');
		}
	}
});
