import { v4 as uuidv4 } from 'uuid';
import { ProjectsList } from './projects-list';
import { IElements, IProject } from '../../interfaces/interfaces';
import { Project } from './project';
import { Logger } from '../common/logger';

type ID = string;

export class ProjectPlanner {
	activeProjectsList: ProjectsList;
	finishedProjectsList: ProjectsList;
	elements: IElements;

	constructor({ appId }: { appId: string }) {
		this.activeProjectsList = new ProjectsList({
			status: 'active',
			key: `${appId}_ACTIVE_PROJECTS`
		});
		this.finishedProjectsList = new ProjectsList({
			status: 'finished',
			key: `${appId}_FINISHED_PROJECTS`
		});
		this.elements = this.initElementsObject();
		this.init();
	}

	private init = (): void => {
		window.addEventListener('load', () => {
			this.elements.$modalCancelNewProjectButton?.addEventListener('click', this.closeNewProjectModal);
			this.elements.$modalNewProjectForm?.addEventListener('submit', this.newProjectModalSubmitFormHandler);
		});

		document.addEventListener('click', (e: any) => {
			const $target = e.target;

			if ($target) {
				// target is add new active project button
				if ($target === this.elements.$addActiveProjectButton) {
					this.openNewProjectModal('active');
				}

				// target is add new finished project button
				if ($target === this.elements.$addFinishedProjectButton) {
					this.openNewProjectModal('finished');
				}

				//target is action button
				if ($target.classList.contains('js-project__action-button')) {
					this.actionButtonClickHandler($target);
				}

				// target is more info button
				if ($target.classList.contains('js-project__more-info-button')) {
					this.moreInfoClickHandler($target);
				}
			}
		});
	};

	private initElementsObject = (): IElements => {
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
		const $modalNewProjectFinishedRadio = $modal?.querySelector(
			'#radio-option-finished'
		) as HTMLInputElement | null;
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
		const $modalMoreInfoCloseButton = $modalMoreInfo?.querySelector(
			'.more-info__close-button'
		) as HTMLButtonElement | null;

		const elements = {
			$activeProjects,
			$addActiveProjectButton,
			$finishedProjects,
			$addFinishedProjectButton,
			$modal,
			$modalNewProjectForm,
			$modalNewProjectActiveRadio,
			$modalNewProjectFinishedRadio,
			$modalCancelNewProjectButton,
			$modalMoreInfo,
			$modalMoreInfoTitle,
			$modalMoreInfoDescription,
			$modalMoreInfoInfo,
			$modalMoreInfoDeleteButton,
			$modalMoreInfoCloseButton
		};
		return elements;
	};

	// handlers
	private newProjectModalSubmitFormHandler = (event: SubmitEvent): void => {
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
			this.activeProjectsList.addNewProject(projectData);
		}
		if (status === 'finished') {
			this.finishedProjectsList.addNewProject(projectData);
		}
		this.closeNewProjectModal();
	};

	private actionButtonClickHandler = ($target: HTMLButtonElement): void => {
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
			this.takeActionOnProject(projectListId, id);
		} catch (error) {
			if (error instanceof Error) {
				Logger.logError(error.message);
			}
		}
	};

	private moreInfoClickHandler = ($target: HTMLButtonElement): void => {
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
				status === 'active'
					? this.activeProjectsList.getProjectById(id)
					: this.finishedProjectsList.getProjectById(id);
			if (!project) {
				throw new Error(`Project instance for id ${id} not found.`);
			}
			if (
				!this.elements.$modalMoreInfo ||
				!this.elements.$modalMoreInfoTitle ||
				!this.elements.$modalMoreInfoDescription ||
				!this.elements.$modalMoreInfoInfo
			) {
				throw new Error('Modal element not found.');
			}
			// fill modal with project data
			this.elements.$modalMoreInfo.setAttribute('data-id', project.id);
			this.elements.$modalMoreInfoTitle.innerText = project.title;
			this.elements.$modalMoreInfoDescription.innerText = project.description;
			this.elements.$modalMoreInfoInfo.innerText = project.info;
			// apply event listeners to buttons inside modal
			const closeHandler = () => this.closeMoreInfoModalButtonClickHandler(closeHandler, deleteHandler);
			const deleteHandler = () => this.deleteProjectButtonClickHandler(id, status, closeHandler, deleteHandler);
			this.elements.$modalMoreInfoCloseButton?.addEventListener('click', closeHandler);
			this.elements.$modalMoreInfoDeleteButton?.addEventListener('click', deleteHandler);
			// show more info modal filled with new data
			this.openMoreInfoModal();
		} catch (error) {
			if (error instanceof Error) {
				Logger.logError(error.message);
			}
		}
	};

	private closeMoreInfoModalButtonClickHandler(closeHandler: () => void, deleteHandler: () => void): void {
		try {
			this.closeMoreInfoModal();
			this.elements.$modalMoreInfoCloseButton?.removeEventListener('click', closeHandler);
			this.elements.$modalMoreInfoDeleteButton?.removeEventListener('click', deleteHandler);
		} catch (error) {
			if (error instanceof Error) {
				Logger.logError(error.message);
			}
		}
	}

	private deleteProjectButtonClickHandler(
		id: ID,
		status: 'active' | 'finished',
		closeHandler: () => void,
		deleteHandler: () => void
	): void {
		try {
			// invoke delete method in appropriate list
			switch (status) {
				case 'active':
					this.activeProjectsList.removeProjectById(id);
					break;
				case 'finished':
					this.finishedProjectsList.removeProjectById(id);
					break;
				default:
					throw new Error('Status parameter error.');
			}
			// close more info modal
			this.closeMoreInfoModalButtonClickHandler(closeHandler, deleteHandler);
		} catch (error) {
			if (error instanceof Error) {
				Logger.logError(error.message);
			}
		}
	}

	// helpers
	// get project + remove from list + create new project in oposite list
	private takeActionOnProject = (status: string, id: ID): void => {
		try {
			switch (status) {
				case 'active':
				case 'active-projects':
					// get project
					const activeProject: Project | null = this.activeProjectsList.getProjectById(id);
					if (!activeProject) {
						throw new Error('Project not found.');
					}
					// remove project from active projects list
					this.activeProjectsList.removeProjectById(id);
					// add project to finished projects list
					this.finishedProjectsList.addNewProject(activeProject);
					break;
				case 'finished':
				case 'finished-projects':
					// get project
					const finishedProject: Project | null = this.finishedProjectsList.getProjectById(id);
					if (!finishedProject) {
						throw new Error('Project not found.');
					}
					// remove project from finished projects list
					this.finishedProjectsList.removeProjectById(id);
					// add project to active projects list
					this.activeProjectsList.addNewProject(finishedProject);
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
	private openNewProjectModal = (status: 'active' | 'finished'): void => {
		console.log(status);
		try {
			if (
				!this.elements.$modal ||
				!this.elements.$modalNewProjectForm ||
				!this.elements.$modalNewProjectActiveRadio ||
				!this.elements.$modalNewProjectFinishedRadio
			) {
				throw new Error('Modal element not found');
			}
			if (status === 'active') {
				this.elements.$modalNewProjectActiveRadio.checked = true;
			}
			if (status === 'finished') {
				this.elements.$modalNewProjectFinishedRadio.checked = true;
			}
			this.elements.$modal.style.display = 'flex';
			this.elements.$modalNewProjectForm.style.display = 'block';
		} catch (error) {
			if (error instanceof Error) {
				Logger.logError(error.message);
			}
		}
	};

	// close new project modal
	private closeNewProjectModal = (): void => {
		try {
			if (!this.elements.$modal || !this.elements.$modalNewProjectForm) {
				throw new Error('Modal element not found');
			}
			this.elements.$modal.style.display = 'none';
			this.elements.$modalNewProjectForm.style.display = 'none';
			this.elements.$modalNewProjectForm.reset();
		} catch (error) {
			if (error instanceof Error) {
				Logger.logError(error.message);
			}
		}
	};

	// open more info modal
	private openMoreInfoModal = (): void => {
		try {
			if (!this.elements.$modal || !this.elements.$modalMoreInfo) {
				throw new Error('Modal element not found');
			}
			this.elements.$modal.style.display = 'flex';
			this.elements.$modalMoreInfo.style.display = 'block';
		} catch (error) {
			if (error instanceof Error) {
				Logger.logError(error.message);
			}
		}
	};

	private closeMoreInfoModal = (): void => {
		try {
			if (!this.elements.$modal || !this.elements.$modalMoreInfo) {
				throw new Error('Modal element not found.');
			}
			this.elements.$modal.style.display = 'none';
			this.elements.$modalMoreInfo.style.display = 'none';
		} catch (error) {
			if (error instanceof Error) {
				Logger.logError(error.message);
			}
		}
	};
}
