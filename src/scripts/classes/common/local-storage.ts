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
			const data = localStorage.getItem(this.key);
			return data ? JSON.parse(data) : null;
		} catch (e) {
			console.error(e);
			return null;
		}
	}
}
