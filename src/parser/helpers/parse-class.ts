import {TokenType} from "../../types/token-type.js";
import Parser from "../Parser";
import {Nullable} from "../../types/nullable";

export default function parseClass(parser: Parser): Nullable<string> {

    if (parser.skipWithVal(TokenType.SYMBOL, '.')) {
        parser.expect(TokenType.IDENT);
        let className = parser.getCurrVal();
        parser.advance();
        return className;
    }

    return null;
}
