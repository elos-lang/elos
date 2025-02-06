import Node from "../../Node";
import Parser from "../../Parser";
import {TokenType} from "../../../types/token-type";

export default class ColorPrimitiveNode extends Node {

    static parse(parser: Parser): boolean {

        if (
            parser.acceptWithVal(TokenType.SYMBOL, '#')
        ) {
            parser.insert(new ColorPrimitiveNode('kleurtje'));
            parser.advance(6);
            return true;
        }

        return false;
    }

    compile(compiler) {
        compiler.write(this.value);
    }
}
