import Node from "./Node";
import Compiler from "../compiler/Compiler";

export default class AstNode extends Node {
    compile(compiler: Compiler) {
        this.getChildren().forEach(child => child.compile(compiler));
    }
}
