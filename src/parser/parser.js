"use strict";

import Ast from "./ast.js";
import All from "./nodes/all.js";

export default class Parser {

    constructor() {

        this.cursor = 0;
        this.tokens = [];

        this.ast = new Ast();
        this.scope = this.ast;
    }

    parse(tokens) {
        this.tokens = tokens;
        this.parseAll();
        return this.ast;
    }

    parseAll() {

        if (! this.tokens.length) {
            return;
        }

        if (this.cursor > (this.tokens.length-1)) {
            return;
        }

        if (All.parse(this)) {
            this.parseAll();
        }
    }

    getCurrToken() {
        return this.tokens[this.cursor];
    }

    getOffsetToken(offset) {
        return this.tokens[this.cursor + offset];
    }

    getCurrVal() {
        return this.getCurrToken().value;
    }

    advance(offset = 1) {
        this.cursor = this.cursor + offset;
    }

    accept(type) {
        let token = this.getCurrToken();
        return (token && token.type === type);
    }

    expect(type) {
        let token = this.getCurrToken();
        if (token && token.type === type) {
            return true;
        }

        throw Error('Expected '+type+' got '+token.type)
    }

    skip(type) {
        if (this.accept(type)) {
            this.advance();
            return true;
        }
        return false;
    }

    skipWithVal(type, value) {
        if (this.acceptWithVal(type, value)) {
            this.advance();
            return true;
        }
        return false;
    }

    acceptAt(type, offset) {
        let token = this.getOffsetToken(offset);
        return (token && token.type === type);
    }

    acceptWithVal(type, value) {
        let token = this.getCurrToken();
        return (
            token &&
            token.type === type &&
            token.value === value
        );
    }

    acceptAtWithVal(type, offset, value) {
        let token = this.getOffsetToken(offset);
        return (
            token &&
            token.type === type &&
            token.value === value
        );
    }

    acceptNextChain(...types) {

        let result = true;

        for (let i = 0; i < types.length; i++) {

            let token = this.getOffsetToken(i);

            if (!token) {
                return false;
            }

            result = (result && token.type === types[i]);
        }

        return result;
    }

    getValAt(offset) {
        let token = this.getOffsetToken(offset);
        if (token) {
            return token.value;
        }
        return null;
    }

    getValChain(amount) {
        let val = '';

        for (let i = 0; i < amount; i++) {
            let token = this.getOffsetToken(i);
            if (! token) {
                return val;
            }
            val += token.value;
        }

        return val;
    }

    in() {
        this.scope = this.getLastNode();
    }

    out() {
        this.scope = this.scope.getParent();
    }

    getScope() {
        return this.scope;
    }

    getLastNode() {
        return this.scope.children[this.scope.children.length-1];
    }

    insert(node) {
        node.setParent(this.scope);
        this.scope.addChild(node);
    }

    getAst() {
        return this.ast;
    }
}
