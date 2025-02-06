import Node from "../Node";
import BodyNode from "./BodyNode";
import DefNode from "./DefNode";
import StyleNode from "./StyleNode";
import Parser from "../Parser";
import IncludeNode from "./IncludeNode";

export default class RootNode extends Node {

    static parse(parser: Parser): boolean {

        while (
            DefNode.parse(parser) ||
            StyleNode.parse(parser) ||
            IncludeNode.parse(parser)
        );

        if (BodyNode.parse(parser)) {
            parser.advance();
            return true;
        }

        return false;
    }

    compile(compiler) {
        //
    }
}
