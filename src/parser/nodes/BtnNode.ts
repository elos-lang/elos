import Node from "../Node";
import parseClass from "../helpers/parse-class.js";
import styleCompiler from "../helpers/compile-style-attrs.js";
import {Nullable} from "../../types/nullable";
import Parser from "../Parser";
import {TokenType} from "../../types/token-type";

export default class BtnNode extends Node {

    private className: Nullable<string>;
    private url: Nullable<string>;

    constructor(value: string, className: string, url = null) {
        super(value);
        this.className = className;
        this.url = url;
    }

    static parse(parser: Parser) {

        if (parser.acceptWithVal(TokenType.IDENT, 'btn')) {
            parser.advance();

            let className = parseClass(parser);

            parser.expect(TokenType.STRING);
            let textValue = parser.getCurrVal();
            parser.advance();

            if (
                parser.acceptWithVal(TokenType.SYMBOL, '-') &&
                parser.acceptAtWithVal(TokenType.SYMBOL, 1, '>')
            ) {
                parser.advance(2);

                parser.expect(TokenType.STRING);
                let urlValue = parser.getCurrVal();

                parser.insert(new BtnNode(textValue, className, urlValue));
                parser.advance();
                return true;
            }

            parser.insert(new BtnNode(textValue, className));
            return true;
        }

        return false;
    }

    compile(compiler) {

        const width = compiler.get('currWidth');

        let css = styleCompiler.compileStyleAttrs(compiler, 'btn', this.className, {
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
        compiler.writeLn(`<a href="${this.url ? this.url : '#'}" style="display:inline-block;margin:0;${cssString}" target="_blank">`);
        compiler.writeLn(this.getVal());
        compiler.writeLn('</a>');
        compiler.writeLn('</td>');
        compiler.writeLn('</tr>');
        compiler.writeLn('</tbody>');
        compiler.writeLn('</table>');
    }
}
