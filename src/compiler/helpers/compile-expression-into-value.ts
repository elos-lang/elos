import Compiler from "../Compiler";
import ExpressionNode from "../../nodes/ExpressionNode";
import {Nullable} from "../../types/nullable";

export default {
	compileExpressionIntoValue(compiler: Compiler, expression: Nullable<ExpressionNode>): Nullable<string> {

		if (! expression) {
			return null;
		}

		const compilerClone = compiler.clone();
		expression.compile(compilerClone);
		return compilerClone.getBody();
	}
};
