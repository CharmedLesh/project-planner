// import { ProjectsList } from './classes/projects-list/projects-list';

// const key = 'PROJECTS';
// const activeProjectsList = new ProjectsList({ status: 'active', key: key });
// const finishedProjectsList = new ProjectsList({ status: 'finished', key: key });

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

const addNewProjectButtonCickHandler = () => {
	if ($newProjectModal) {
		$newProjectModal.style.display = 'flex';
	}
};

const cancelNewProjectModalButtonClickHandler = () => {
	if ($newProjectModal) {
		$newProjectModal.style.display = 'none';
	}
	$cancelNewProjectModalButton?.removeEventListener('click', cancelNewProjectModalButtonClickHandler);
};

document.addEventListener('click', (e: any) => {
	const $target = e.target;

	if ($target) {
		// target is add active project button
		if ($target === $addActiveProjectButton) {
			addNewProjectButtonCickHandler();
			$cancelNewProjectModalButton?.addEventListener('click', cancelNewProjectModalButtonClickHandler);
		}
		// target is add finished project button
		if ($target === $addFinishedProjectButton) {
			addNewProjectButtonCickHandler();
			$cancelNewProjectModalButton?.addEventListener('click', cancelNewProjectModalButtonClickHandler);
		}
	}
});
