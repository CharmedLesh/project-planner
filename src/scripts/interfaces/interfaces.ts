export interface IProject {
	id: string;
	title: string;
	description: string;
	info: string;
}

export interface IElements {
	$activeProjects: HTMLDivElement | null;
	$addActiveProjectButton: HTMLButtonElement | null;
	$finishedProjects: HTMLDivElement | null;
	$addFinishedProjectButton: HTMLButtonElement | null;
	$modal: HTMLDivElement | null;
	$modalNewProjectForm: HTMLFormElement | null;
	$modalNewProjectActiveRadio: HTMLInputElement | null;
	$modalNewProjectFinishedRadio: HTMLInputElement | null;
	$modalCancelNewProjectButton: HTMLButtonElement | null;
	$modalMoreInfo: HTMLDivElement | null;
	$modalMoreInfoTitle: HTMLParagraphElement | null;
	$modalMoreInfoDescription: HTMLParagraphElement | null;
	$modalMoreInfoInfo: HTMLParagraphElement | null;
	$modalMoreInfoDeleteButton: HTMLButtonElement | null;
	$modalMoreInfoCloseButton: HTMLButtonElement | null;
}
