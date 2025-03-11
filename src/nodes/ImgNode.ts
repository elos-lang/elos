import Node from "../parser/Node";
import Parser from "../parser/Parser";
import {TokenType} from "../types/token-type";
import ArrowNode from "./ArrowNode";
import Compiler from "../compiler/Compiler";
import parseClass from "../parser/helpers/parse-class";
import ExpressionNode from "./ExpressionNode";
import expressionCompiler from "../compiler/helpers/compile-expression-into-value";

export default class ImgNode extends Node {

    static parse(parser: Parser) {

        if (parser.acceptWithValue(TokenType.IDENT, 'img')) {
            parser.advance();
            parser.insert(new ImgNode());
            parser.traverseUp();

            let className = parseClass(parser);
            if (className) {
                parser.setAttribute('className', className);
            }

            if (! ExpressionNode.parse(parser)) {
                throw new Error('Expected an expression');
            }
            parser.setAttribute('src');

            if (ArrowNode.parse(parser)) {
                if (! ExpressionNode.parse(parser)) {
                    throw new Error('Expected an expression');
                }
                parser.setAttribute('url');
            }

            parser.traverseDown();

            return true;
        }
    }

    compile(compiler: Compiler) {

        const src = expressionCompiler.compileExpressionIntoValue(compiler, this.getAttribute('src') as ExpressionNode);
        const className = this.getAttribute('className') as string;
        const url = expressionCompiler.compileExpressionIntoValue(compiler, this.getAttribute('url') as ExpressionNode);

        const scrollBarWidth = 15;
        const width = parseInt(compiler.variable('width') as string);
        const mediaQueryWidth = width + parseInt(compiler.variable('edge') as string) * 2 + scrollBarWidth;

        const imgId = compiler.remember('imgId', parseInt(compiler.get('imgId') as string) + 1);
        const currWidth = parseInt(compiler.get('currWidth') as string);

        compiler.writeLineToHead(`<style media="screen and (min-width:${mediaQueryWidth}px)">`);
        compiler.writeLineToHead(`.elos-img-${imgId} {`);
        compiler.writeLineToHead(`width: ${currWidth}px !important;`);
        compiler.writeLineToHead('}');
        compiler.writeLineToHead('</style>');

        if (url) {
            compiler.writeLineToBody(`<a href="${url}" target="_blank" style="text-decoration: none;">`);
        }

        compiler.writeLineToBody(`<img class="elos-img-${imgId}" border="0" src="${src}" style="display:block; border: 0; width: 100%;"/>`);

        if (url) {
            compiler.writeLineToBody(`</a>`);
        }
    }
}
