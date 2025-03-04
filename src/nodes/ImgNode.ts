import Node from "../parser/Node";
import Parser from "../parser/Parser";
import {TokenType} from "../types/token-type";
import ArrowNode from "./ArrowNode";
import {Nullable} from "../types/nullable";
import Compiler from "../compiler/Compiler";

export default class ImgNode extends Node {

    private url: Nullable<string>;

    constructor(value: string, url: string = null) {
        super(value);
        this.url = url;
    }

    static parse(parser: Parser) {

        if (parser.acceptWithValue(TokenType.IDENT, 'img')) {
            parser.advance();

            parser.expect(TokenType.STRING);
            let value = parser.getCurrentValue();
            parser.advance();

            if (ArrowNode.parse(parser)) {

                parser.expect(TokenType.STRING);
                let urlValue = parser.getCurrentValue();

                parser.insert(new ImgNode(value, urlValue));
                parser.advance();
                return true;
            }

            parser.insert(new ImgNode(value));

            return true;
        }

        return false;
    }

    compile(compiler: Compiler) {

        const scrollBarWidth = 15;
        const width = parseInt(compiler.variable('width') as string);
        const mediaQueryWidth = width + parseInt(compiler.variable('edge') as string) * 2 + scrollBarWidth;

        const imgId = compiler.remember('imgId', parseInt(compiler.get('imgId') as string) + 1);
        const currWidth = parseInt(compiler.get('currWidth') as string);

        compiler.writeLnHead(`<style media="screen and (min-width:${mediaQueryWidth}px)">`);
        compiler.writeLnHead(`.elos-img-${imgId} {`);
        compiler.writeLnHead(`width: ${currWidth}px !important;`);
        compiler.writeLnHead('}');
        compiler.writeLnHead('</style>');

        if (this.url) {
            compiler.writeLn(`<a href="${this.url}" target="_blank" style="text-decoration: none;">`);
        }

        compiler.writeLn(`<img class="elos-img-${imgId}" border="0" src="${this.getValue()}" style="display:block; border: 0; width: 100%;"/>`);

        if (this.url) {
            compiler.writeLn(`</a>`);
        }
    }
}
