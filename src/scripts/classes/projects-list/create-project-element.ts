import { IProject } from '../../interfaces/interfaces';
import { Project } from './project';

export class CreateProjectElement {
	projectData: IProject | Project;
	constructor({ projectData }: { projectData: IProject | Project }) {
		this.projectData = projectData;
	}

	createProjectElement = (): HTMLLIElement => {
		const projectActionButtonInnerText = this.projectData.status === 'active' ? 'Finish' : 'Activate';
		const $project = this.createLi('js-project', this.projectData.id);
		const $projectTitle = this.createH2('js-project__title', undefined, this.projectData.title);
		const $projectDescription = this.createP('js-project__description', undefined, this.projectData.description);
		const $projectButtonsContainer = this.createDiv('js-project__buttons-container', undefined, undefined);
		const $projectMoreInfoButton = this.createButton(
			['js-project__more-info-button', 'outlined-red-button'],
			undefined,
			'More Info',
			undefined
		);
		const $projectActionButton = this.createButton(
			['js-project__action-button', 'filled-red-button'],
			undefined,
			projectActionButtonInnerText,
			undefined
		);

		$projectButtonsContainer.append($projectMoreInfoButton, $projectActionButton);
		$project.append($projectTitle, $projectDescription, $projectButtonsContainer);

		return $project;
	};

	private createLi(classNameOrClassNamesArray?: string | string[], dataId?: string): HTMLLIElement {
		const $li = document.createElement('li');
		if (classNameOrClassNamesArray) {
			this.addToClassNameList(classNameOrClassNamesArray, $li);
		}
		if (dataId) {
			$li.setAttribute('data-id', dataId);
		}
		return $li;
	}

	private createH2 = (classNameOrClassNamesArray?: string | string[], id?: string, innerText?: string) => {
		const $h2 = document.createElement('h2');
		if (classNameOrClassNamesArray) {
			this.addToClassNameList(classNameOrClassNamesArray, $h2);
		}
		if (id) {
			$h2.id = id;
		}
		if (innerText) {
			$h2.innerText = innerText;
		}
		return $h2;
	};

	private createP = (
		classNameOrClassNamesArray?: string | string[],
		id?: string,
		innerText?: string
	): HTMLParagraphElement => {
		const $p = document.createElement('p');
		if (classNameOrClassNamesArray) {
			this.addToClassNameList(classNameOrClassNamesArray, $p);
		}
		if (id) {
			$p.id = id;
		}
		if (innerText) {
			$p.innerText = innerText;
		}
		return $p;
	};

	private createDiv = (
		classNameOrClassNamesArray?: string | string[],
		id?: string,
		innerText?: string
	): HTMLDivElement => {
		const $div = document.createElement('div');
		if (classNameOrClassNamesArray) {
			this.addToClassNameList(classNameOrClassNamesArray, $div);
		}
		if (id) {
			$div.id = id;
		}
		if (innerText) {
			$div.innerText = innerText;
		}
		return $div;
	};

	private createButton = (
		classNameOrClassNamesArray?: string | string[],
		id?: string,
		innerText?: string,
		innerIcon?: string
	): HTMLButtonElement => {
		const $button = document.createElement('button');
		if (classNameOrClassNamesArray) {
			this.addToClassNameList(classNameOrClassNamesArray, $button);
		}
		if (id) {
			$button.id = id;
		}
		if (innerIcon && innerText) {
			$button.innerHTML = `${innerText} ${innerIcon}`;
		} else {
			if (innerText) {
				$button.innerHTML = innerText;
			}
			if (innerIcon) {
				$button.innerHTML = innerIcon;
			}
		}

		return $button;
	};

	private addToClassNameList = (classNameOrClassNamesArray: string | string[], $element: HTMLElement): void => {
		if (typeof classNameOrClassNamesArray === 'string') {
			$element.classList.add(classNameOrClassNamesArray);
		}
		if (Array.isArray(classNameOrClassNamesArray)) {
			for (const className of classNameOrClassNamesArray) {
				$element.classList.add(className);
			}
		}
	};
}
