export class Render {
	$projectsList: HTMLUListElement | null;

	constructor({ status }: { status: 'active' | 'finished' }) {
		this.$projectsList = this.initProjectListElement(status);
	}

	private initProjectListElement = (status: 'active' | 'finished') => {
		const $activeProjects = document.getElementById('active-projects') as HTMLDivElement | null;
		const $finishedProjects = document.getElementById('finished-projects') as HTMLDivElement | null;
		switch (status) {
			case 'active':
				const $activeProjectsListElement = $activeProjects?.querySelector(
					'.projects-list__content'
				) as HTMLUListElement | null;
				return $activeProjectsListElement;
			case 'finished':
				const $finishedProjectsListElement = $finishedProjects?.querySelector(
					'.projects-list__content'
				) as HTMLUListElement | null;
				return $finishedProjectsListElement;
			default:
				return null;
		}
	};

	renderProject = ($project: HTMLLIElement | null) => {
		try {
			if (this.$projectsList) {
				if ($project) {
					this.$projectsList.append($project);
				} else {
					throw new Error('Project element not provided.');
				}
			} else {
				throw new Error('Project list element not provided.');
			}
		} catch (error) {
			console.error(error);
		}
	};

	renderProjectList = (multipleProjectsElements: HTMLLIElement[]) => {
		try {
			if (this.$projectsList) {
				for (const $project of multipleProjectsElements) {
					this.renderProject($project);
				}
			} else {
				throw new Error('Project list element not provided.');
			}
		} catch (error) {
			console.error(error);
		}
	};
}