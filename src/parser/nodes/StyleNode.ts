import Node from "../Node";
import StylePropertyNode from "./StylePropertyNode.js";
import parseClass from "../helpers/parse-class.js";
import config from "../../grammar.js";
import {TokenType} from "../../types/token-type";
import Parser from "../Parser";

export default class StyleNode extends Node {

    public isClass: boolean;

    constructor(name: string, isClass = false) {
        super(name);
        this.isClass = isClass;
    }

    static parse(parser: Parser): boolean {

        if (parser.acceptWithVal(TokenType.IDENT, 'style')) {
            parser.advance();

            let className = parseClass(parser);
            let isClass = true;

            if (className === null) {
                if (parser.accept(TokenType.IDENT)) {
                    className = parser.getCurrVal();
                    isClass = ! isClass;
                    parser.advance();
                }
            }

            if (parser.acceptWithVal(TokenType.SYMBOL, config.BLOCK_OPEN_SYMBOL)) {
                parser.advance();

                parser.insert(new StyleNode(className, isClass));
                parser.in();
            }

            while (StylePropertyNode.parse(parser));

            if (parser.acceptWithVal(TokenType.SYMBOL, config.BLOCK_CLOSE_SYMBOL)) {
                parser.out();
                parser.advance();
            }

            return true;
        }

        return false;
    }

    compile(compiler) {
        this.getChildren().forEach(child => child.compile(compiler));
    }
}
