import Node from "../parser/Node";
import Parser from "../parser/Parser";
import {TokenType} from "../types/token-type";
import Compiler from "../compiler/Compiler";

export default class DefNode extends Node {

    private readonly defName: string;

    constructor(defName: string, value: string) {
        super(value);

        this.defName = defName;
    }

    static parse(parser: Parser): boolean {

        if (parser.acceptWithValue(TokenType.IDENT, 'def')) {
            parser.advance();

            if (parser.expect(TokenType.VAR)) {

                let defName = parser.getCurrentValue();
                parser.advance();

                if (parser.accept(TokenType.STRING) || parser.accept(TokenType.NUMBER)) {
                    parser.insert(new DefNode(defName, parser.getCurrentValue()));
                    parser.advance();

                    return true;
                }
            }
        }

        return false;
    }

    compile(compiler: Compiler) {
        compiler.define(this.defName, this.getValue());
    }
}
