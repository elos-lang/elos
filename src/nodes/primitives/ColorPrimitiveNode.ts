import Node from "../../parser/Node";
import Parser from "../../parser/Parser";
import {TokenType} from "../../types/token-type";
import Compiler from "../../compiler/Compiler";

export default class ColorPrimitiveNode extends Node {

    static parse(parser: Parser): boolean {

        if (parser.accept(TokenType.COLOR)) {
            parser.insert(new ColorPrimitiveNode(parser.getCurrVal()));
            parser.advance();
            return true;
        }

        return false;
    }

    compile(compiler: Compiler) {
        compiler.write(`#${this.getVal()}`);
    }
}
