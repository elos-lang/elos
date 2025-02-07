type EventListener = (data: object) => void;

declare class Elos {
    /**
     * @param code
     * @param path
     */
    static make(code: string, path?: string): string;
    /**
     * @param eventId
     * @param listener
     */
    static on(eventId: string, listener: EventListener): void;
}

declare enum TokenType {
    UNKNOWN = "Unknown",
    IDENT = "Ident",
    NUMBER = "Number",
    SYMBOL = "Symbol",
    WHITESPACE = "Whitespace",
    NEWLINE = "Newline",
    STRING = "String"
}

type Token = {
    value: string;
    type: TokenType;
    line: number;
    position: number;
    end: boolean;
};

type TokenStream = Token[];

declare function lex(text: string): TokenStream;

type Nullable<T> = T | null;

type AttributeValue = Node | string | number;

declare class Parser {
    private cursor;
    private tokens;
    private ast;
    private scope;
    setTokenStream(tokens: TokenStream): void;
    parse(tokens: TokenStream): AstNode;
    parseAll(): void;
    getCurrToken(): Token;
    getOffsetToken(offset: any): Token;
    setAttribute(name: string): void;
    getCurrVal(): string;
    advance(offset?: number): void;
    accept(type: TokenType): boolean;
    expect(type: TokenType): boolean;
    skip(type: TokenType): boolean;
    skipWithVal(type: TokenType, value: string): boolean;
    acceptAt(type: TokenType, offset: number): boolean;
    acceptWithVal(type: TokenType, value: string): boolean;
    expectWithVal(type: TokenType, value: string): boolean;
    expectAtWithVal(type: TokenType, offset: number, value: string): boolean;
    acceptAtWithVal(type: TokenType, offset: number, value: string): boolean;
    acceptNextChain(...types: TokenType[]): boolean;
    getValAt(offset: number): string;
    getValChain(amount: number): string;
    in(): void;
    out(): void;
    getScope(): Node;
    getLastNode(): Node;
    insert(node: Node): void;
    setScope(node: Node): void;
    traverseUp(): void;
    traverseDown(): void;
    wrap(node: Node): void;
    getAst(): AstNode;
}

declare class Node {
    protected value: string;
    protected parent: Nullable<Node>;
    protected children: Node[];
    protected attributes: Record<string, AttributeValue>;
    constructor(value?: string);
    getName(): string;
    setParent(node: Node): void;
    getParent(): Node;
    getVal(): string;
    setVal(value: string): void;
    addChild(node: Node): void;
    getChildren(): Node[];
    hasChildren(): boolean;
    setAttribute(name: string, value: AttributeValue): void;
    getAttribute(name: string): AttributeValue;
    removeLastChild(): void;
    parse(parser: Parser): boolean;
    compile(compiler: any): void;
}

declare class AstNode extends Node {
    compile(compiler: any): void;
}

declare function parse(tokens: TokenStream): AstNode;

declare function compile(ast: AstNode): string;

export { Elos, compile, lex, parse };
