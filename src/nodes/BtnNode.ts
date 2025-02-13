import Node from "../parser/Node";
import parseClass from "../parser/helpers/parse-class.js";
import styleCompiler from "../parser/helpers/compile-style-attrs.js";
import {Nullable} from "../types/nullable";
import Parser from "../parser/Parser";
import {TokenType} from "../types/token-type";
import Compiler from "../compiler/Compiler";

export default class BtnNode extends Node {

    static parse(parser: Parser) {

        if (parser.acceptWithVal(TokenType.IDENT, 'btn')) {
            parser.advance();

            let className = parseClass(parser);

            parser.expect(TokenType.STRING);
            let textValue = parser.getCurrVal();
            parser.advance();

            const btnNode = new BtnNode(textValue);

            if (className) {
                btnNode.setAttribute('className', className);
            }

            if (
                parser.acceptWithVal(TokenType.SYMBOL, '-') &&
                parser.acceptAtWithVal(TokenType.SYMBOL, 1, '>')
            ) {
                parser.advance(2);

                parser.expect(TokenType.STRING);
                let urlValue = parser.getCurrVal();

                if (urlValue) {
                    btnNode.setAttribute('url', urlValue);
                }

                parser.insert(btnNode);
                parser.advance();
                return true;
            }

            parser.insert(btnNode);
            return true;
        }

        return false;
    }

    compile(compiler: Compiler) {

        const url = this.getAttribute('url') as string || '';
        const className = this.getAttribute('className') as string || null;
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
        compiler.writeLn(this.getVal());
        compiler.writeLn('</a>');
        compiler.writeLn('</td>');
        compiler.writeLn('</tr>');
        compiler.writeLn('</tbody>');
        compiler.writeLn('</table>');
    }
}
