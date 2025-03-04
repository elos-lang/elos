type EventListener = (data: object) => void;

declare class Elos {
    /**
     * @param code
     * @param path
     */
    static make(code: string, path?: string): string;
    /**
     * @param eventId
     * @param listener
     */
    static on(eventId: string, listener: EventListener): void;
}

export { Elos };
