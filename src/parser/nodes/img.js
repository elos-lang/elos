"use strict";

import Node from "../node.js";
import parseClass from "../helpers/parse-class.js";
import Expression from "./expression.js";

export default class Img extends Node {

    static name = 'img';

    constructor(value, className) {
        super(value);
        this.className = className;
    }

    static parse(parser) {

        if (parser.acceptWithVal('ident', 'img')) {
            parser.advance();

            let className = parseClass(parser);

            parser.expect('string');
            let value = parser.getCurrVal();
            parser.advance();

            parser.insert(new Img(value, className));

            if (
                parser.accept('symbol', '-') &&
                parser.acceptAtWithVal('symbol', 1, '>')
            ) {
                parser.advance();
                parser.advance();

                if (Expression.parse(parser)) {
                    console.log('setting url', parser.getScope());
                    parser.setAttribute('url');
                } else {
                    // @TODO throw error
                }
            }

            return true;
        }

        return false;
    }

    compile(compiler) {

        const scrollBarWidth = 15;
        const width = parseInt(compiler.variable('width'));
        const mediaQueryWidth = width + parseInt(compiler.variable('edge')) * 2 + scrollBarWidth;

        const imgId = compiler.remember('imgId', parseInt(compiler.get('imgId')) + 1);
        const currWidth = parseInt(compiler.get('currWidth'));

        compiler.writeLnHead(`<style media="screen and (min-width:${mediaQueryWidth}px)">`);
        compiler.writeLnHead(`.elos-img-${imgId} {`);
        compiler.writeLnHead(`width: ${currWidth}px !important;`);
        compiler.writeLnHead('}');
        compiler.writeLnHead('</style>');

        console.log(this.getAttribute('url'));

        if (this.getAttribute('url')) {
            compiler.writeLn(`<a href="${this.getAttribute('url')}" target="_blank" style="text-decoration: none;">`);
        }

        compiler.writeLn(`<img class="elos-img-${imgId}" border="0" src="${this.getVal()}" style="display:block; border: 0; width: 100%;"/>`);

        if (this.getAttribute('url')) {
            compiler.writeLn(`</a>`);
        }
    }
}
