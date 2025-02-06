import Node from "../Node";
import {TokenType} from "../../types/token-type";
import Parser from "../Parser";
import StyleNode from "./StyleNode";

export default class StylePropertyNode extends Node {

    private property: string;

    constructor(property: string, value: string) {
        super(value);
        this.property = property;
    }

    static parse(parser: Parser): boolean {

        if (parser.accept(TokenType.IDENT)) {

            let property = parser.getCurrVal();
            parser.advance();

            if (parser.accept(TokenType.NUMBER) || parser.accept(TokenType.STRING)) {
                let value = parser.getCurrVal();
                parser.advance();
                parser.insert(new StylePropertyNode(property, value));

                return true;
            }
        }

        return false;
    }

    compile(compiler) {

        const parent = this.getParent() as StyleNode;
        const name = parent.getVal();
        const style = (parent.isClass ? compiler.get('classes') : compiler.get('identStyles'));

        if (! style[name]) {
            style[name] = [];
        }

        style[name] = [...style[name], [this.property, this.getVal()]];
    }
}
