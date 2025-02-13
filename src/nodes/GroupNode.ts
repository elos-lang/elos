import Node from "../parser/Node";
import parseBody from "../parser/helpers/parse-body";
import styleCompiler from "../parser/helpers/compile-style-attrs.js";
import parseClass from "../parser/helpers/parse-class.js";
import config from "../grammar.js";
import compilerHelpers from "../compiler/helpers/compile-with-vgap.js";
import {TokenType} from "../types/token-type";
import Parser from "../parser/Parser";
import {AlignmentOption} from "../types/alignment-option";
import Compiler from "../compiler/Compiler";

export default class GroupNode extends Node {

    static parse(parser: Parser) {

        if (parser.acceptWithVal(TokenType.IDENT, 'group')) {
            parser.advance();

            let className = parseClass(parser);

            if (parser.expectWithVal(TokenType.SYMBOL, config.BLOCK_OPEN_SYMBOL)) {
                parser.advance();

                const groupNode = new GroupNode();

                if (className) {
                    groupNode.setAttribute('className', className);
                }

                parser.insert(groupNode);
                parser.in();

                parseBody(parser);

                if (parser.expectWithVal(TokenType.SYMBOL, config.BLOCK_CLOSE_SYMBOL)) {
                    parser.out();
                    parser.advance();
                }

                return true;
            }
        }

        return false;
    }

    compile(compiler: Compiler) {

        const currentWidth = compiler.get('currWidth') as string;
        const className= this.getAttribute('className') as string || null;

        const css = styleCompiler.compileStyleAttrs(compiler, 'group', className, {
            'background-color': '#f0f0f0',
            'padding': '25px',
            'text-align': 'left'
        });

        const bgColor = css['background-color'];
        const padding = parseInt(css['padding']);
        const align = css['text-align'] as AlignmentOption;

        const currWidth = parseInt(currentWidth);
        compiler.remember('currWidth', currWidth - (padding*2));

        compiler.writeLn(`<table width="100%;" cellspacing="0" cellpadding="0" style="width:100%;max-width:${currWidth}px;border:none;border-spacing:0;text-align:${align};">`);

        compiler.writeLn('<tr>');
        compiler.writeLn(`<td bgcolor="${bgColor}" width="${padding}"></td>`);
        compiler.writeLn(`<td bgcolor="${bgColor}" height="${padding}"></td>`);
        compiler.writeLn(`<td bgcolor="${bgColor}" width="${padding}"></td>`);
        compiler.writeLn('</tr>');

        compiler.writeLn('<tr>');
        compiler.writeLn(`<td bgcolor="${bgColor}" width="${padding}"></td>`);
        compiler.writeLn(`<td bgcolor="${bgColor}" align="${align}">`);

        compilerHelpers.compileWithVgap(compiler, this.getChildren(), align);

        compiler.writeLn('</td>');
        compiler.writeLn(`<td bgcolor="${bgColor}" width="${padding}"></td>`);
        compiler.writeLn('</tr>');

        compiler.writeLn('<tr>');
        compiler.writeLn(`<td bgcolor="${bgColor}" width="${padding}"></td>`);
        compiler.writeLn(`<td bgcolor="${bgColor}" height="${padding}"></td>`);
        compiler.writeLn(`<td bgcolor="${bgColor}" width="${padding}"></td>`);
        compiler.writeLn('</tr>');

        compiler.writeLn('</table>');

        compiler.remember('currWidth', currWidth);
    }
}
