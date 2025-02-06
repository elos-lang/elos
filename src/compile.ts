import Compiler from "./compiler/Compiler";
import AstNode from "./parser/AstNode";

export default function compile(ast: AstNode): string {
    return (new Compiler()).compile(ast);
}
