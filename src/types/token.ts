import {TokenType} from "./token-type";

export type Token = {
	value: string;
	type: TokenType;
	line: number;
	position: number;
	end: boolean;
}