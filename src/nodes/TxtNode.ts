import Node from "../parser/Node";
import parseClass from "../parser/helpers/parse-class.js";
import styleCompiler from "../parser/helpers/compile-style-attrs.js";
import Parser from "../parser/Parser";
import {TokenType} from "../types/token-type";
import ArrowNode from "./ArrowNode";
import Compiler from "../compiler/Compiler";

export default class TxtNode extends Node {

    static parse(parser: Parser): boolean {

        if (parser.acceptWithValue(TokenType.IDENT, 'txt')) {
            parser.advance();

            let className = parseClass(parser);

            parser.expect(TokenType.STRING);
            let textValue = parser.getCurrentValue();
            parser.advance();

            const txtNode = new TxtNode(textValue);

            if (className) {
                txtNode.setAttribute('className', className);
            }

            if (ArrowNode.parse(parser)) {

                parser.expect(TokenType.STRING);
                let urlValue = parser.getCurrentValue();

                if (urlValue) {
                    txtNode.setAttribute('url', urlValue);
                }

                parser.insert(txtNode);
                parser.advance();
                return true;
            }

            parser.insert(txtNode);
            return true;
        }

        return false;
    }

    compile(compiler: Compiler) {

        const url = this.getAttribute('url') as string || null;
        const className = this.getAttribute('className') as string || null;
        const width = compiler.variable('width');

        const css = styleCompiler.compileStyleAttrs(compiler, 'txt', className, {
            'font-size': '12px',
            'color': '#000000',
            'line-height': '16px',
            'text-decoration': 'none'
        });

        const cssString = styleCompiler.attrsToCssString(css);

        compiler.writeLn(`<table cellspacing="0" cellpadding="0" style="max-width:${width}px;border:none;border-spacing:0;text-align:left;">`);
        compiler.writeLn('<tr>');
        compiler.writeLn(`<td style="${cssString}">`);

        if (url) {
            compiler.writeLn(`<a href="${url}" target="_blank" style="${cssString}">`);
        }

        compiler.writeLn(`${this.getValue()}`);

        if (url) {
            compiler.writeLn(`</a>`);
        }

        compiler.writeLn(`</td>`);
        compiler.writeLn('</tr>');
        compiler.writeLn('</table>');
    }
}
