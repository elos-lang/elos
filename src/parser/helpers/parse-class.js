"use strict";

export default function parseClass(parser) {

    if (parser.skipWithVal('symbol', '.')) {
        parser.expect('ident');
        let className = parser.getCurrVal();
        parser.advance();
        return className;
    }

    return null;
}
