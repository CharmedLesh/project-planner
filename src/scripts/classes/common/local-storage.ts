export class LocalStorage<T> {
	private readonly key: string;

	constructor({ key }: { key: string }) {
		this.key = key;
	}

	set(data: T): void {
		try {
			localStorage.setItem(this.key, JSON.stringify(data));
		} catch (e) {
			console.error(e);
		}
	}

	get(): T | null {
		try {
			const data: string | null = localStorage.getItem(this.key);
			return data ? JSON.parse(data) : null;
		} catch (e) {
			console.error(e);
			return null;
		}
	}

	add(dataToAdd: any): void {
		try {
			const rawData: string | null = localStorage.getItem(this.key);
			const dataJson: T | null = rawData ? JSON.parse(rawData) : null;
			if (dataJson) {
				if (Array.isArray(dataJson)) {
					dataJson.push(dataToAdd);
					localStorage.setItem(this.key, JSON.stringify(dataJson));
				} else {
					throw new Error('Data format is not array. An error could occure while trying to stringify data.');
				}
			} else {
				localStorage.setItem(this.key, JSON.stringify([dataToAdd]));
			}
		} catch (e) {
			console.error(e);
		}
	}
}
