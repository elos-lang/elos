import Node from "../parser/Node";
import StylePropertyNode from "./StylePropertyNode.js";
import parseClass from "../parser/helpers/parse-class.js";
import config from "../grammar.js";
import {TokenType} from "../types/token-type";
import Parser from "../parser/Parser";
import Compiler from "../compiler/Compiler";

export default class StyleNode extends Node {

    public isClass: boolean;

    constructor(name: string, isClass: boolean) {
        super(name);
        this.isClass = isClass;
    }

    static parse(parser: Parser): boolean {

        if (parser.skipWithValue(TokenType.IDENT, 'style')) {

            let identifier = '';

            if (parser.expect(TokenType.IDENT)) {
                identifier = parser.getCurrentValue();
                parser.advance();
            }

            let className = parseClass(parser);
            let isClass = (className !== null);

            if (parser.expectWithValue(TokenType.SYMBOL, config.BLOCK_OPEN_SYMBOL)) {
                parser.advance();

                parser.insert(new StyleNode(className ? className : identifier, isClass));
                parser.in();
            }

            while (StylePropertyNode.parse(parser));

            if (parser.expectWithValue(TokenType.SYMBOL, config.BLOCK_CLOSE_SYMBOL)) {
                parser.out();
                parser.advance();
            }

            return true;
        }

        return false;
    }

    compile(compiler: Compiler) {
        this.getChildren().forEach(child => child.compile(compiler));
    }
}
