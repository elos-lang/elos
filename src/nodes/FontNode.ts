import Node from "../parser/Node";
import Parser from "../parser/Parser";
import {TokenType} from "../types/token-type";
import Compiler from "../compiler/Compiler";
import ExpressionNode from "./ExpressionNode";
import expressionCompiler from "../compiler/helpers/compile-expression-into-value";

export default class FontNode extends Node {

	static parse(parser: Parser): boolean {

		if (parser.acceptWithValue(TokenType.IDENT, 'font')) {
			parser.advance();
			parser.insert(new FontNode());
			parser.traverseUp();

			if (! ExpressionNode.parse(parser)) {
				throw new Error('Expected an expression');
			}
			parser.setAttribute('fontSrc');

			parser.traverseDown();
			return true;
		}

		return false;
	}

	compile(compiler: Compiler) {

		// Compile fileName expression
		const fontSrc = expressionCompiler.compileExpressionIntoValue(compiler, this.getAttribute('fontSrc') as ExpressionNode);

		compiler.writeHead(`
			<style>
			@import url('${fontSrc}');
			</style>
		`);
	}
}
