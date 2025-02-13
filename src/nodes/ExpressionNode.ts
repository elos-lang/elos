import Node from "../parser/Node";
import ColorPrimitiveNode from "./primitives/ColorPrimitiveNode.js";
import StringPrimitiveNode from "./primitives/StringPrimitiveNode.js";
import Parser from "../parser/Parser";
import Compiler from "../compiler/Compiler";

export default class ExpressionNode extends Node {

    static parse(parser: Parser): boolean {

        if (
            ColorPrimitiveNode.parse(parser) ||
            StringPrimitiveNode.parse(parser)
        ) {
            if (parser.getScope().getName() !== this.name) {
                parser.wrap(new ExpressionNode());
            }

            parser.traverseDown();
            return true;
        }

        return false;
    }

    compile(compiler: Compiler) {
        this.getChildren().forEach((child, i) => {
            child.compile(compiler);
        });
    }
}
