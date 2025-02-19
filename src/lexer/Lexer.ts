import grammar from "../grammar";
import {LexMode} from "../types/lex-mode";
import {TokenStream} from "../types/token-stream";
import {TokenType} from "../types/token-type";

export class Lexer {

    /**
     *
     * @private
     */
    private mode: LexMode = LexMode.ALL;

    /**
     *
     * @private
     */
    private cursor: number = 0;

    /**
     *
     * @private
     */
    private end: number = 0;

    /**
     *
     * @private
     */
    private line: number = 1;

    /**
     *
     * @private
     */
    private column: number = 1;

    /**
     *
     * @private
     */
    private tokens: TokenStream = [];

    /**
     *
     * @private
     */
    private value: string = '';

    /**
     *
     * @private
     */
    private character: string = '';

    /**
     *
     * @private
     */
    private nextCharacter: string = '';

    /**
     *
     * @private
     */
    private delimiter: string = '';

    /**
     * Transforms code into a TokenStream
     * @param text
     */
    tokenize(text: string): TokenStream {

        this.end = text.length;

        while (this.cursor < this.end) {

            this.character = text[this.cursor];
            this.nextCharacter = text[this.cursor+1] || null;

            // Determine the mode
            if (this.mode === LexMode.ALL) {
                this.mode = this.determineMode();
            }

            switch (this.mode) {
                case LexMode.STRING:
                    this.lexString();
                    break;
                case LexMode.IDENT:
                    this.lexIdent();
                    break;
                case LexMode.NUMBER:
                    this.lexNumber();
                    break;
                case LexMode.SYMBOL:
                    this.lexSymbol();
                    break;
                case LexMode.NEWLINE:
                    this.lexNewline();
                    break;
                case LexMode.WHITESPACE:
                    this.lexWhitespace();
                    break;
                case LexMode.VAR:
                    this.lexVar();
                    break;
                case LexMode.COLOR:
                    this.lexColor();
                    break;
                case LexMode.COMMENT:
                    this.lexComment();
                    break;
                case LexMode.UNKNOWN:
                    this.lexUnknown();
                    break;
            }
        }

        return this.tokens;
    }

    /**
     * @private
     */
    private atEnd(): boolean {
        return this.cursor >= this.end;
    }

    /**
     * Determines the lexing mode based on the current character
     * @private
     */
    private determineMode(): LexMode {

        // Reset the current token value
        this.value = '';

        if (
            this.character === grammar.COMMENT_SYMBOL &&
            this.nextCharacter === grammar.COMMENT_SYMBOL
        ) {
            return LexMode.COMMENT;
        }

        if (grammar.REGEX_IDENT.exec(this.character)) {
            return LexMode.IDENT;
        }

        if (grammar.REGEX_STRING_DELIMITER.exec(this.character)) {
            this.delimiter = this.character;
            return LexMode.STRING;
        }

        if (grammar.REGEX_NUMBER.exec(this.character)) {
            return LexMode.NUMBER;
        }

        if (grammar.REGEX_COLOR_START.exec(this.character)) {
            return LexMode.COLOR;
        }

        if (grammar.REGEX_VAR_START.exec(this.character)) {
            return LexMode.VAR;
        }

        if (grammar.REGEX_SYMBOL.exec(this.character)) {
            return LexMode.SYMBOL;
        }

        if (grammar.REGEX_NEWLINE.exec(this.character)) {
            return LexMode.NEWLINE;
        }

        if (grammar.REGEX_WHITESPACE.exec(this.character)) {
            return LexMode.WHITESPACE;
        }

        return LexMode.UNKNOWN;
    }

    private lexIdent() {

        this.value += this.character;
        this.cursor++;
        this.column++;

        if (! this.nextCharacter || ! grammar.REGEX_IDENT.exec(this.nextCharacter)) {
            this.tokens.push({
                type: TokenType.IDENT,
                value: this.value,
                line: this.line,
                position: this.column,
                end: this.atEnd(),
            });
            this.mode = LexMode.ALL;
        }
    }

    private lexString() {
        if (this.delimiter !== this.character) {
            this.value += this.character;
        }
        this.cursor++;
        this.column++;

        if (this.nextCharacter === this.delimiter) {
            this.tokens.push({
                type: TokenType.STRING,
                value: this.value,
                line: this.line,
                position: this.column,
                end: this.atEnd(),
            });
            this.mode = LexMode.ALL;
            this.cursor++;
            this.column++;
            this.delimiter = '';
        }
    }

    private lexNumber() {
        this.value += this.character;
        this.cursor++;

        if (!this.nextCharacter || !grammar.REGEX_NUMBER.exec(this.nextCharacter)) {
            this.tokens.push({
                type: TokenType.NUMBER,
                value: this.value,
                line: this.line,
                position: this.column,
                end: this.atEnd(),
            });
            this.column++;
            this.mode = LexMode.ALL;
        }
    }

    private lexSymbol() {
        this.tokens.push({
            type: TokenType.SYMBOL,
            value: this.character,
            line: this.line,
            position: this.column,
            end: this.atEnd(),
        });
        this.cursor++;
        this.column++;
        this.mode = LexMode.ALL;
    }

    private lexNewline() {
        this.cursor++;
        this.line++;
        this.column = 0;
        this.mode = LexMode.ALL;
    }

    private lexWhitespace() {
        this.cursor++;
        this.column++;
        this.mode = LexMode.ALL;
    }

    private lexColor() {
        if (grammar.REGEX_COLOR.exec(this.character)) {
            this.value += this.character;
        }

        this.cursor++;

        if (!this.nextCharacter || this.value.length === 6 || !grammar.REGEX_COLOR.exec(this.nextCharacter)) {
            this.tokens.push({
                type: TokenType.COLOR,
                value: this.value,
                line: this.line,
                position: this.column,
                end: this.atEnd(),
            });
            this.mode = LexMode.ALL;
            this.column++;
            this.delimiter = '';
        }
    }

    private lexVar() {
        if (grammar.REGEX_VAR.exec(this.character)) {
            this.value += this.character;
        }

        this.cursor++;

        if (!this.nextCharacter || !grammar.REGEX_VAR.exec(this.nextCharacter)) {
            this.tokens.push({
                type: TokenType.VAR,
                value: this.value,
                line: this.line,
                position: this.column,
                end: this.atEnd(),
            });
            this.mode = LexMode.ALL;
            this.column++;
            this.delimiter = '';
        }
    }

    private lexUnknown() {
        this.tokens.push({
            type: TokenType.UNKNOWN,
            value: this.character,
            line: this.line,
            position: this.column,
            end: this.atEnd(),
        });
        this.cursor++;
        this.column++;
        this.mode = LexMode.ALL;
    }

    private lexComment() {
        this.cursor++;

        if (grammar.REGEX_NEWLINE.exec(this.nextCharacter)) {
            this.mode = LexMode.ALL;
            this.column++;
        }
    }
}
