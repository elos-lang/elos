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

        compiler.writeLineToBody(`<table width="100%;" cellspacing="0" cellpadding="0" style="width: 100%; max-width:${currWidth}px;border:none;border-spacing:0;text-align:left;">`);
        compiler.writeLineToBody('<tr>');
        compiler.writeLineToBody('<td>');

        compiler.writeLineToBody('<!--[if mso]>');
        compiler.writeLineToBody('<table role="presentation" width="100%">');
        compiler.writeLineToBody('<tr>');
        compiler.writeLineToBody('<![endif]-->');

        this.getChildren().forEach((child, i) => {

            compiler.remember('currWidth', colWidth);

            compiler.writeLineToHead(`<style media="screen and (min-width:${mediaQueryWidth}px)">`);
            compiler.writeLineToHead(`.elos-col-${colsId}-${i} {`);
            compiler.writeLineToHead(`float: left;`);
            compiler.writeLineToHead(`max-width: ${colWidth}px !important;`);
            //compiler.writeLnHead(`padding-left: ${gap/2}px;`);
            compiler.writeLineToHead(`margin-bottom: 0 !important;`);

            if (i < colCount-1) {
                compiler.writeLineToHead(`padding-right: ${gap}px !important;`);
            }

            if (i===0) {
                //compiler.writeLnHead(`margin-left: -${gap/2}px;`);
            }

            compiler.writeLineToHead('}');
            compiler.writeLineToHead('</style>');

            compiler.writeLineToBody('<!--[if mso]>');
            compiler.writeLineToBody(`<td style="width: ${colWidth}px; padding: 0;" align="left" valign="top">`);
            compiler.writeLineToBody('<![endif]-->');
            compiler.writeLineToBody(`<div class="elos-col-${colsId}-${i}" style="display:inline-block; margin-bottom: ${gap}px; width:100%; vertical-align:top; text-align:left;">`);

            child.compile(compiler);

            compiler.writeLineToBody('</div>');
            compiler.writeLineToBody('<!--[if mso]>');
            compiler.writeLineToBody('</td>');
            compiler.writeLineToBody('<![endif]-->');

        });

        compiler.remember('currWidth', currWidth);

        compiler.writeLineToBody('<!--[if mso]>');
        compiler.writeLineToBody('</tr>');
        compiler.writeLineToBody('</table>');
        compiler.writeLineToBody('<![endif]-->');

        compiler.writeLineToBody('</td>');
        compiler.writeLineToBody('</tr>');
        compiler.writeLineToBody('</table>');
    }
}
