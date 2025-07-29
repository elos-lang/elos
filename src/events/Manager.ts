import {EventListener} from "../types/event-listener";
import {EventQueueTuple} from "../types/event-queue-tuple";

export class Manager {

	/**
	 * @private
	 */
	private static listeners: Record<string, EventListener[]> = {};

	/**
	 * @private
	 */
	private static queue: Array<EventQueueTuple> = []

	/**
	 * Adds an event listener to the manager
	 * @param id
	 * @param listener
	 */
	static addListener(id: string, listener: EventListener): void {
		if (! this.listeners[id]) {
			this.listeners[id] = [];
		}

		this.listeners[id] = [
			...this.listeners[id],
			listener
		];
	}

	/**
	 * Emits an event
	 * @param id
	 * @param data
	 */
	static emit(id: string, data: object): void {
		if (! this.listeners || ! this.listeners[id]) {
			return;
		}

		this.listeners[id].forEach(listener => this.queue.push([listener, data]));
		this.process();
	}

	/**
	 * Process the event queue
	 */
	static process(): void {
		if (! this.queue.length) {
			return;
		}

		this.queue.forEach(queueItem => {
			const [listener, data] = queueItem;
			listener(data);
		});

		// Empty the queue
		this.queue = [];
	}
}
