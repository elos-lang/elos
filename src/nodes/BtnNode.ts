import Node from "../parser/Node";
import parseClass from "../parser/helpers/parse-class.js";
import styleCompiler from "../parser/helpers/compile-style-attrs.js";
import Parser from "../parser/Parser";
import {TokenType} from "../types/token-type";
import Compiler from "../compiler/Compiler";
import ArrowNode from "./ArrowNode";
import ExpressionNode from "./ExpressionNode";
import expressionCompiler from "../compiler/helpers/compile-expression-into-value";

export default class BtnNode extends Node {

    static parse(parser: Parser) {

        if (parser.acceptWithVal(TokenType.IDENT, 'btn')) {

            parser.advance();
            parser.insert(new BtnNode());
            parser.traverseUp();

            let className = parseClass(parser);
            if (className) {
                parser.setAttribute('className', className);
            }

            if (! ExpressionNode.parse(parser)) {
                throw new Error('Expected an expression');
            }
            parser.setAttribute('expression');

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

        const expression = expressionCompiler.compileExpressionIntoValue(compiler, this.getAttribute('expression') as ExpressionNode);
        const className = this.getAttribute('className') as string;
        const url = expressionCompiler.compileExpressionIntoValue(compiler, this.getAttribute('url') as ExpressionNode);

        const width = compiler.get('currWidth');

        let css = styleCompiler.compileStyleAttrs(compiler, 'btn', className, {
            'background-color': '#000000',
            'color': '#ffffff',
            'border-radius': '8px',
            'font-size': '12px',
            'font-weight': 'normal',
            'line-height': '16px',
            'text-decoration': 'none',
            'text-transform': 'none',
            'padding': '8px 16px'
        });

        const bgColor = css['background-color'];
        const padding = css['padding'];
        const borderRadius = css['border-radius'];

        const cssString = styleCompiler.attrsToCssString(css);

        compiler.writeLn(`<table border="0" cellPadding="0" cellSpacing="0" role="presentation" style="border-collapse:separate;line-height:100%;">`);
        compiler.writeLn('<tbody>');
        compiler.writeLn('<tr>');
        compiler.writeLn(`<td align="center" bgcolor="${bgColor}" role="presentation" style="border:none;border-radius:${borderRadius};cursor:auto;mso-padding-alt:${padding};background:${bgColor};" valign="middle">`);
        compiler.writeLn(`<a href="${url ? url : '#'}" style="display:inline-block;margin:0;${cssString}" target="_blank">`);
        compiler.writeLn(expression);
        compiler.writeLn('</a>');
        compiler.writeLn('</td>');
        compiler.writeLn('</tr>');
        compiler.writeLn('</tbody>');
        compiler.writeLn('</table>');
    }
}
