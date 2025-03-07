import {TokenStream} from "../types/token-stream";
import Node from "./Node";
import AstNode from "./AstNode";
import RootNode from "../nodes/RootNode";
import {TokenType} from "../types/token-type";
import UnexpectedToken from "../errors/UnexpectedToken";
import {Nullable} from "../types/nullable";

export default class Parser {

    /**
     *
     * @private
     */
    private cursor: number = 0;

    /**
     *
     * @private
     */
    private tokens: TokenStream;

    /**
     *
     * @private
     */
    private ast: AstNode = new AstNode();

    /**
     *
     * @private
     */
    private scope: Node = this.ast;

    /**
     *
     * @param tokens
     */
    setTokenStream(tokens: TokenStream) {
        this.tokens = tokens;
    }

    /**
     *
     * @param tokens
     */
    parse(tokens: TokenStream): AstNode {
        this.setTokenStream(tokens);
        this.parseAll();
        return this.ast;
    }

    /**
     *
     */
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

    /**
     *
     */
    getCurrentToken() {
        return this.tokens[this.cursor];
    }

    /**
     *
     * @param offset
     */
    getOffsetToken(offset: number) {
        return this.tokens[this.cursor + offset];
    }

    /**
     *
     * @param name
     * @param value
     */
    setAttribute(name: string, value: Nullable<string | Node> = null) {
        if (value === null) {
            value = this.getLastNode();
            this.getScope().removeLastChild();
        }
        this.getScope().setAttribute(name, value);
    }

    /**
     *
     */
    getCurrentValue() {
        return this.getCurrentToken().value;
    }

    /**
     *
     * @param offset
     */
    advance(offset: number = 1) {
        this.cursor = this.cursor + offset;
    }

    /**
     *
     * @param type
     */
    accept(type: TokenType): boolean {
        let token = this.getCurrentToken();
        return (token && token.type === type);
    }

    /**
     *
     * @param type
     */
    expect(type: TokenType): boolean {
        if (this.accept(type)) {
            return true;
        }
        throw new UnexpectedToken(type, this.getCurrentToken());
    }

    /**
     *
     * @param type
     */
    skip(type: TokenType): boolean {
        if (this.accept(type)) {
            this.advance();
            return true;
        }
        return false;
    }

    /**
     *
     * @param type
     * @param value
     */
    skipWithValue(type: TokenType, value: string): boolean {
        if (this.acceptWithValue(type, value)) {
            this.advance();
            return true;
        }
        return false;
    }

    /**
     *
     * @param type
     * @param offset
     */
    acceptAt(type: TokenType, offset: number): boolean {
        const token = this.getOffsetToken(offset);
        return (token && token.type === type);
    }

    /**
     *
     * @param type
     * @param value
     */
    acceptWithValue(type: TokenType, value: string): boolean {
        const token = this.getCurrentToken();
        return (
            token &&
            token.type === type &&
            token.value === value
        );
    }

    /**
     *
     * @param type
     * @param value
     */
    expectWithValue(type: TokenType, value: string): boolean {

        if (this.acceptWithValue(type, value)) {
            return true;
        }

        throw new UnexpectedToken(type, this.getCurrentToken());
    }

    /**
     *
     * @param type
     * @param offset
     * @param value
     */
    expectAtWithValue(type: TokenType, offset: number, value: string): boolean {
        if (this.acceptAtWithValue(type, offset, value)) {
            return true;
        }
        throw new UnexpectedToken(type, this.getCurrentToken());
    }

    /**
     *
     * @param type
     * @param offset
     * @param value
     */
    acceptAtWithValue(type: TokenType, offset: number, value: string): boolean {
        const token = this.getOffsetToken(offset);
        return (
            token &&
            token.type === type &&
            token.value === value
        );
    }

    /**
     *
     */
    in() {
        this.scope = this.getLastNode();
    }

    /**
     *
     */
    out() {
        this.scope = this.scope.getParent();
    }

    /**
     *
     */
    getScope(): Node {
        return this.scope;
    }

    /**
     *
     */
    getLastNode(): Node {
        return this.scope.getChildren()[this.scope.getChildren().length-1];
    }

    /**
     *
     * @param node
     */
    insert(node: Node) {
        node.setParent(this.scope);
        this.scope.addChild(node);
    }

    /**
     *
     * @param node
     */
    setScope(node: Node) {
        this.scope = node;
    }

    /**
     *
     */
    traverseUp() {
        this.setScope(this.getLastNode());
    }

    /**
     *
     */
    traverseDown() {
        this.setScope(this.getScope().getParent());
    }

    /**
     *
     * @param node
     */
    wrap(node: Node) {
        const last = this.getLastNode();
        this.getScope().removeLastChild();

        this.insert(node);
        this.traverseUp();

        this.insert(last);
    }

    /**
     *
     */
    getAst(): AstNode {
        return this.ast;
    }
}
