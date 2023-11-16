import { Logger } from '../common/logger';

type ID = string;

export class Render {
	$projectsList: HTMLUListElement | null;

	constructor({ status }: { status: 'active' | 'finished' }) {
		this.$projectsList = this.initProjectListElement(status);
	}

	private initProjectListElement = (status: 'active' | 'finished'): HTMLUListElement | null => {
		switch (status) {
			case 'active':
				const $activeProjects = document.getElementById('active-projects') as HTMLDivElement | null;
				const $activeProjectsListElement = $activeProjects?.querySelector(
					'.projects-list__content'
				) as HTMLUListElement | null;
				return $activeProjectsListElement;
			case 'finished':
				const $finishedProjects = document.getElementById('finished-projects') as HTMLDivElement | null;
				const $finishedProjectsListElement = $finishedProjects?.querySelector(
					'.projects-list__content'
				) as HTMLUListElement | null;
				return $finishedProjectsListElement;
			default:
				return null;
		}
	};

	renderProject = ($project: HTMLLIElement | null): void => {
		try {
			if (!this.$projectsList) {
				throw new Error('Project list element not provided.');
			}
			if (!$project) {
				throw new Error('Project element not provided.');
			}
			this.$projectsList.append($project);
			this.$projectsList.scrollTo(0, this.$projectsList.scrollHeight);
		} catch (error) {
			if (error instanceof Error) {
				Logger.logError(error.message);
			}
		}
	};

	renderProjectList = (multipleProjectsElements: HTMLLIElement[]): void => {
		try {
			if (!this.$projectsList) {
				throw new Error('Project list element not provided.');
			}
			for (const $project of multipleProjectsElements) {
				this.renderProject($project);
			}
			this.$projectsList.scrollTo(0, 0);
		} catch (error) {
			if (error instanceof Error) {
				Logger.logError(error.message);
			}
		}
	};

	unrenderProjectById = (id: ID): void => {
		try {
			const $project = this.$projectsList?.querySelector(`[data-id="${id}"]`) as HTMLLIElement;
			$project.remove();
		} catch (error) {
			if (error instanceof Error) {
				Logger.logError(error.message);
			}
		}
	};
}
