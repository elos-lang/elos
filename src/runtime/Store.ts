export default class Store<T> {

	/**
	 * @private
	 */
	private readonly items: Record<string, T> = {};

	/**
	 * @param items
	 */
	constructor(items: Record<string, T> = {}) {
		this.items = items;
	}

	/**
	 * Sets a value by name
	 * @param name
	 * @param value
	 */
	public set(name: string, value: T): T {
		this.items[name] = value;
		return value;
	}

	/**
	 * Gets a value by name
	 * @param name
	 */
	public get(name: string): T {
		return this.items[name];
	}

	/**
	 * Gets all items as an object
	 */
	public getAll(): Record<string, T> {
		return this.items;
	}

	/**
	 * Extends the items by an object of other items
	 * @param items
	 */
	public extend(items: Record<string, T>) {
		Object.assign(this.items, items);
	}
}