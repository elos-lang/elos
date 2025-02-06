import Node from "./Node";

export default class AstNode extends Node {
    compile(compiler) {
        this.getChildren().forEach(child => child.compile(compiler));
    }
}
