import Compiler from "./compiler/Compiler";
import {Lexer} from "./lexer/Lexer";
import Parser from "./parser/Parser";
import {EventListener} from "./types/event-listener";
import {Manager} from "./events/Manager";

export default class Elos {

	/**
	 * @param code
	 * @param path
	 */
	public static make(code: string, path: string = '') {
		const tokens = (new Lexer()).tokenize(code);
		const ast = (new Parser()).parse(tokens);
		return (new Compiler({ path })).compile(ast);
	}

	/**
	 * @param eventId
	 * @param listener
	 */
	public static on(eventId: string, listener: EventListener) {
		Manager.addListener(eventId, listener);
	}
}
