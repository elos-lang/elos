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

        const mediaQueryWidth = (parseInt(compiler.get('width')) + parseInt(compiler.get('edge')) * 2);
        const colWidth = compiler.get('width') / this.getChildren().length;

        compiler.writeLn('<!--[if mso]>');
        compiler.writeLn('<table role="presentation" width="100%">');
        compiler.writeLn('<tr>');
        compiler.writeLn('<![endif]-->');

        this.getChildren().forEach((child, i) => {

            compiler.writeLnHead(`<style media="screen and (min-width:${mediaQueryWidth}px)">`);
            compiler.writeLnHead(`.elos-col-${i} {`);
            compiler.writeLnHead(`float: left;`);
            compiler.writeLnHead(`max-width: ${colWidth}px !important;`);
            compiler.writeLnHead('}');
            compiler.writeLnHead('</style>');

            compiler.writeLn('<!--[if mso]>');
            compiler.writeLn(`<td style="width: ${colWidth}px; padding: 0;" align="left" valign="top">`);
            compiler.writeLn('<![endif]-->');
            compiler.writeLn(`<div class="elos-col-${i}" style="display:inline-block; width:100%; vertical-align:top; text-align:left;">`);

            child.compile(compiler);

            compiler.writeLn('</div>');
            compiler.writeLn('<!--[if mso]>');
            compiler.writeLn('</td>');
            compiler.writeLn('<![endif]-->');

        });

        compiler.writeLn('<!--[if mso]>');
        compiler.writeLn('</tr>');
        compiler.writeLn('</table>');
        compiler.writeLn('<![endif]-->');
    }
}
