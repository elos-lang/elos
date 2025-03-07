import Node from "../parser/Node";
import ColNode from "./ColNode";
import Parser from "../parser/Parser";
import {TokenType} from "../types/token-type";
import Compiler from "../compiler/Compiler";
import parseClass from "../parser/helpers/parse-class";
import config from "../grammar";

export default class ColsNode extends Node {

    static parse(parser: Parser): boolean {

        if (parser.acceptWithValue(TokenType.IDENT, 'cols')) {
            parser.advance();

            let className = parseClass(parser);

            if (parser.expectWithValue(TokenType.SYMBOL, config.BLOCK_OPEN_SYMBOL)) {
                parser.advance();

                const colsNode = new ColsNode();

                if (className) {
                    colsNode.setAttribute('className', className);
                }

                parser.insert(colsNode);
                parser.in();

                while (ColNode.parse(parser));

                if (parser.expectWithValue(TokenType.SYMBOL, config.BLOCK_CLOSE_SYMBOL)) {
                    parser.out();
                    parser.advance();
                }

                return true;
            }
        }

        return false;
    }

    compile(compiler: Compiler) {

        const colsId = compiler.remember('colsId', parseInt(compiler.get('colsId') as string) + 1);

        const scrollBarWidth = 15;
        const colCount = this.getChildren().length;
        const currWidth = parseInt(compiler.get('currWidth') as string);
        const width = parseInt(compiler.variable('width') as string);
        const mediaQueryWidth = width + parseInt(compiler.variable('edge') as string) * 2 + scrollBarWidth;
        const gap = parseInt(compiler.variable('hgap') as string);
        const colWidth = Math.floor((currWidth / colCount) - gap + Math.floor(gap / colCount));

        compiler.writeLn(`<table width="100%;" cellspacing="0" cellpadding="0" style="width: 100%; max-width:${currWidth}px;border:none;border-spacing:0;text-align:left;">`);
        compiler.writeLn('<tr>');
        compiler.writeLn('<td>');

        compiler.writeLn('<!--[if mso]>');
        compiler.writeLn('<table role="presentation" width="100%">');
        compiler.writeLn('<tr>');
        compiler.writeLn('<![endif]-->');

        this.getChildren().forEach((child, i) => {

            compiler.remember('currWidth', colWidth);

            compiler.writeLnHead(`<style media="screen and (min-width:${mediaQueryWidth}px)">`);
            compiler.writeLnHead(`.elos-col-${colsId}-${i} {`);
            compiler.writeLnHead(`float: left;`);
            compiler.writeLnHead(`max-width: ${colWidth}px !important;`);
            //compiler.writeLnHead(`padding-left: ${gap/2}px;`);
            compiler.writeLnHead(`margin-bottom: 0 !important;`);

            if (i < colCount-1) {
                compiler.writeLnHead(`padding-right: ${gap}px !important;`);
            }

            if (i===0) {
                //compiler.writeLnHead(`margin-left: -${gap/2}px;`);
            }

            compiler.writeLnHead('}');
            compiler.writeLnHead('</style>');

            compiler.writeLn('<!--[if mso]>');
            compiler.writeLn(`<td style="width: ${colWidth}px; padding: 0;" align="left" valign="top">`);
            compiler.writeLn('<![endif]-->');
            compiler.writeLn(`<div class="elos-col-${colsId}-${i}" style="display:inline-block; margin-bottom: ${gap}px; width:100%; vertical-align:top; text-align:left;">`);

            child.compile(compiler);

            compiler.writeLn('</div>');
            compiler.writeLn('<!--[if mso]>');
            compiler.writeLn('</td>');
            compiler.writeLn('<![endif]-->');

        });

        compiler.remember('currWidth', currWidth);

        compiler.writeLn('<!--[if mso]>');
        compiler.writeLn('</tr>');
        compiler.writeLn('</table>');
        compiler.writeLn('<![endif]-->');

        compiler.writeLn('</td>');
        compiler.writeLn('</tr>');
        compiler.writeLn('</table>');
    }
}
