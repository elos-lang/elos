import {TokenType} from "../../types/token-type.js";
import Parser from "../Parser";
import {Nullable} from "../../types/nullable";

export default function parseClass(parser: Parser): Nullable<string> {

    if (parser.skipWithValue(TokenType.SYMBOL, '.')) {
        parser.expect(TokenType.IDENT);
        let className = parser.getCurrentValue();
        parser.advance();
        return className;
    }

    return null;
}
