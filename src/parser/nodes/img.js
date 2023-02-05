"use strict";

import Node from "../node.js";
import parseClass from "../helpers/parse-class.js";

export default class Img extends Node {

    static name = 'img';

    constructor(value, className, url = null) {
        super(value);
        this.className = className;
        this.url = url;
    }

    static parse(parser) {

        if (parser.acceptWithVal('ident', 'img')) {
            parser.advance();

            let className = parseClass(parser);

            parser.expect('string');
            let value = parser.getCurrVal();
            parser.advance();

            if (
                parser.accept('symbol', '-') &&
                parser.acceptAtWithVal('symbol', 1, '>')
            ) {
                parser.advance();
                parser.advance();

                parser.expect('string');
                let urlValue = parser.getCurrVal();

                parser.insert(new Img(value, className, urlValue));
                parser.advance();
                return true;
            }

            parser.insert(new Img(value, className));
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

        if (this.url) {
            compiler.writeLn(`<a href="${this.url}" target="_blank" style="text-decoration: none;">`);
        }
        compiler.writeLn(`<img class="elos-img-${imgId}" border="0" src="${this.getVal()}" style="display:block; border: 0; width: 100%;"/>`);
        if (this.url) {
            compiler.writeLn(`</a>`);
        }
    }
}
