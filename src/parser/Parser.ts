import {TokenStream} from "../types/token-stream";
import Node from "./Node";
import AstNode from "./AstNode";
import RootNode from "./nodes/RootNode";
import {TokenType} from "../types/token-type";
import UnexpectedToken from "../errors/UnexpectedToken";

export default class Parser {

    private cursor: number = 0;

    private tokens: TokenStream;

    private ast: AstNode = new AstNode();

    private scope: Node = this.ast;

    setTokenStream(tokens: TokenStream) {
        this.tokens = tokens;
    }

    parse(tokens: TokenStream): AstNode {
        this.setTokenStream(tokens);
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

        if (RootNode.parse(this)) {
            this.parseAll();
        }
    }

    getCurrToken() {
        return this.tokens[this.cursor];
    }

    getOffsetToken(offset) {
        return this.tokens[this.cursor + offset];
    }

    setAttribute(name: string) {
        const last = this.getLastNode();
        this.getScope().removeLastChild();
        this.getScope().setAttribute(name, last);
    }

    getCurrVal() {
        return this.getCurrToken().value;
    }

    advance(offset: number = 1) {
        this.cursor = this.cursor + offset;
    }

    accept(type: TokenType): boolean {
        let token = this.getCurrToken();
        return (token && token.type === type);
    }

    expect(type: TokenType): boolean {

        if (this.accept(type)) {
            return true;
        }

        throw new UnexpectedToken(type, this.getCurrToken());
    }

    skip(type: TokenType): boolean {
        if (this.accept(type)) {
            this.advance();
            return true;
        }
        return false;
    }

    skipWithVal(type: TokenType, value: string): boolean {
        if (this.acceptWithVal(type, value)) {
            this.advance();
            return true;
        }
        return false;
    }

    acceptAt(type: TokenType, offset: number): boolean {
        const token = this.getOffsetToken(offset);
        return (token && token.type === type);
    }

    acceptWithVal(type: TokenType, value: string): boolean {
        const token = this.getCurrToken();
        return (
            token &&
            token.type === type &&
            token.value === value
        );
    }

    expectWithVal(type: TokenType, value: string): boolean {

        if (this.acceptWithVal(type, value)) {
            return true;
        }

        throw new UnexpectedToken(type, this.getCurrToken());
    }

    expectAtWithVal(type: TokenType, offset: number, value: string): boolean {

        if (this.acceptAtWithVal(type, offset, value)) {
            return true;
        }

        throw new UnexpectedToken(type, this.getCurrToken());
    }

    acceptAtWithVal(type: TokenType, offset: number, value: string): boolean {
        const token = this.getOffsetToken(offset);
        return (
            token &&
            token.type === type &&
            token.value === value
        );
    }

    acceptNextChain(...types: TokenType[]): boolean {

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

    getValAt(offset: number): string {
        let token = this.getOffsetToken(offset);
        if (token) {
            return token.value;
        }
        return null;
    }

    getValChain(amount: number): string {
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

    getScope(): Node {
        return this.scope;
    }

    getLastNode(): Node {
        return this.scope.getChildren()[this.scope.getChildren().length-1];
    }

    insert(node: Node) {
        node.setParent(this.scope);
        this.scope.addChild(node);
    }

    setScope(node: Node) {
        this.scope = node;
    }

    traverseUp() {
        this.setScope(this.getLastNode());
    }

    traverseDown() {
        this.setScope(this.getScope().getParent());
    }

    wrap(node: Node) {
        const last = this.getLastNode();
        this.getScope().removeLastChild();

        this.insert(node);
        this.traverseUp();

        this.insert(last);
    }

    getAst(): AstNode {
        return this.ast;
    }
}
