"use strict";

import Node from "../node.js";

export default class Space extends Node {

    static name = 'space';

    static parse(parser) {

        if (parser.acceptWithVal('ident', 'space')) {
            parser.advance();
            parser.insert(new Space());
            return true;
        }

        return false;
    }

    compile(compiler) {

        compiler.writeLn(`<table width="100%;" cellspacing="0" cellpadding="0" style="width: 100%; max-width:${compiler.get('width')}px;border:none;border-spacing:0;text-align:left;">`);
        compiler.writeLn('<tr>');
        compiler.writeLn('<td style="height: 25px;"></td>');
        compiler.writeLn('</tr>');
        compiler.writeLn('</table>');
    }
}
