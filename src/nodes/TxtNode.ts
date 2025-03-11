import Node from "../parser/Node";
import parseClass from "../parser/helpers/parse-class";
import styleCompiler from "../parser/helpers/compile-style-attrs";
import Parser from "../parser/Parser";
import {TokenType} from "../types/token-type";
import ArrowNode from "./ArrowNode";
import Compiler from "../compiler/Compiler";
import ExpressionNode from "./ExpressionNode";
import expressionCompiler from "../compiler/helpers/compile-expression-into-value";

export default class TxtNode extends Node {

    static parse(parser: Parser) {

        if (parser.acceptWithValue(TokenType.IDENT, 'txt')) {
            parser.advance();
            parser.insert(new TxtNode());
            parser.traverseUp();

            let className = parseClass(parser);
            if (className) {
                parser.setAttribute('className', className);
            }

            if (! ExpressionNode.parse(parser)) {
                throw new Error('Expected an expression');
            }
            parser.setAttribute('text');

            if (ArrowNode.parse(parser)) {
                if (! ExpressionNode.parse(parser)) {
                    throw new Error('Expected an expression');
                }
                parser.setAttribute('url');
            }

            parser.traverseDown();

            return true;
        }

        return false;
    }

    compile(compiler: Compiler) {

        const text = expressionCompiler.compileExpressionIntoValue(compiler, this.getAttribute('text') as ExpressionNode);
        const className = this.getAttribute('className') as string;
        const url = expressionCompiler.compileExpressionIntoValue(compiler, this.getAttribute('url') as ExpressionNode);

        const width = compiler.variable('width');

        const css = styleCompiler.compileStyleAttrs(compiler, 'txt', className, {
            'font-family': 'Arial',
            'font-size': '12px',
            'color': '#000000',
            'line-height': '16px',
            'text-decoration': 'none'
        });

        const cssString = styleCompiler.attrsToCssString(css);

        compiler.writeLineToBody(`<table cellspacing="0" cellpadding="0" style="max-width:${width}px;border:none;border-spacing:0;text-align:left;">`);
        compiler.writeLineToBody('<tr>');
        compiler.writeLineToBody(`<td style="${cssString}">`);

        if (url) {
            compiler.writeLineToBody(`<a href="${url}" target="_blank" style="${cssString}">`);
        }

        compiler.writeLineToBody(text);

        if (url) {
            compiler.writeLineToBody(`</a>`);
        }

        compiler.writeLineToBody(`</td>`);
        compiler.writeLineToBody('</tr>');
        compiler.writeLineToBody('</table>');
    }
}
