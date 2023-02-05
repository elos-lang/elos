"use strict";

import Node from "../node.js";
import Col from "./col.js";

export default class Cols extends Node {

    static name = 'cols';

    static parse(parser) {

        if (parser.acceptWithVal('ident', 'cols')) {
            parser.advance();

            parser.insert(new Cols());
            parser.in();

            while (Col.parse(parser));

            parser.out();
            return true;
        }

        return false;
    }

    compile(compiler) {

        const colsId = compiler.remember('colsId', parseInt(compiler.get('colsId')) + 1);

        const scrollBarWidth = 15;
        const colCount = this.getChildren().length;
        const currWidth = parseInt(compiler.get('currWidth'));
        const width = parseInt(compiler.variable('width'));
        const mediaQueryWidth = width + parseInt(compiler.variable('edge')) * 2 + scrollBarWidth;
        const gap = parseInt(compiler.variable('hgap'));
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
