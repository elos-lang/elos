import grammar from "../grammar";
import {LexMode} from "../types/lex-mode";
import {TokenStream} from "../types/token-stream";
import {TokenType} from "../types/token-type";

export default class Lexer {

    /**
     * The source code to tokenize
     * @private
     */
    private source: string;

    /**
     * The current mode of lexing
     * @private
     */
    private mode: LexMode = LexMode.ALL;

    /**
     * The current position of the cursor
     * @private
     */
    private cursor: number = 0;

    /**
     * The position of the cursor at the start of the mode
     * @private
     */
    private modeStartCursor: number = 0;

    /**
     * The current line, starting at line 1
     * @private
     */
    private line: number = 1;

    /**
     * The current position on the current line, starting at 1
     * @private
     */
    private column: number = 1;

    /**
     * The current character
     * @private
     */
    private character: string = '';

    /**
     * The next character, handy for simple look-ahead
     * @private
     */
    private nextCharacter: string = '';

    /**
     * The index of the last character, also the amount of characters
     * @private
     */
    private end: number = 0;

    /**
     * The current token stream being created
     * @private
     */
    private tokens: TokenStream = [];

    /**
     * The current value being lexed
     * @private
     */
    private value: string = '';

    /**
     * The current delimiter (e.g. string delimiter or boundary)
     * @private
     */
    private delimiter: string = ''

    /**
     * Transforms code into a TokenStream
     * @param text
     */
    tokenize(text: string): TokenStream {

        this.source = text;
        this.end = this.source.length;

        while (this.cursor < this.end) {

            this.character = this.source[this.cursor];
            this.nextCharacter = this.source[this.cursor+1] || null;

            // Determine the mode
            if (this.mode === LexMode.ALL) {
                this.mode = this.determineMode();
                this.modeStartCursor = this.cursor;
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
                    this.lexVariable();
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
    private atEnd(accountForDelimiter: boolean = false): boolean {
        const offset = accountForDelimiter ? 1 : 0;
        return this.cursor + offset >= this.end;
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

    /**
     * Tokenize identifier
     * @private
     */
    private lexIdent() {

        this.value += this.character;
        this.cursor++;

        if (! this.nextCharacter || ! grammar.REGEX_IDENT.exec(this.nextCharacter)) {
            this.tokens.push({
                type: TokenType.IDENT,
                value: this.value,
                line: this.line,
                position: this.column,
                end: this.atEnd(),
            });
            this.column += this.value.length;
            this.mode = LexMode.ALL;
        }
    }

    /**
     * Tokenize string
     * @private
     */
    private lexString() {

        let escSequence = (this.character === grammar.STRING_ESCAPE_SYMBOL);

        // String escaping
        if (escSequence) {
            this.cursor += 1;
            // We directly alter the character and nextCharacter,
            // so we can directly consume them further down in the method
            this.character = this.source[this.cursor];
            this.nextCharacter = this.source[this.cursor + 1] || null;
        }

        if (this.character !== this.delimiter || escSequence) {
            // Consume the character
            this.value += this.character;
        }

        this.cursor++;

        if (this.nextCharacter === this.delimiter) {
            this.tokens.push({
                type: TokenType.STRING,
                value: this.value,
                line: this.line,
                position: this.column,
                end: this.atEnd(true),
            });
            this.cursor++;
            this.column += this.cursor - this.modeStartCursor;
            this.mode = LexMode.ALL;
            this.delimiter = '';
        }
    }

    /**
     * Tokenize number
     * @private
     */
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
            this.column += this.cursor - this.modeStartCursor;
            this.mode = LexMode.ALL;
        }
    }

    /**
     * Tokenize symbol
     * @private
     */
    private lexSymbol() {

        this.cursor++;

        this.tokens.push({
            type: TokenType.SYMBOL,
            value: this.character,
            line: this.line,
            position: this.column,
            end: this.atEnd(),
        });
        this.column++;
        this.mode = LexMode.ALL;
    }

    /**
     * Tokenize newline
     * @private
     */
    private lexNewline() {
        this.cursor++;
        this.line++;
        this.column = 1;
        this.mode = LexMode.ALL;
    }

    /**
     * Tokenize whitespace
     * @private
     */
    private lexWhitespace() {
        this.cursor++;
        this.column++;
        this.mode = LexMode.ALL;
    }

    /**
     * Tokenize color
     * @private
     */
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
            this.column += this.cursor - this.modeStartCursor;
            this.delimiter = '';
        }
    }

    /**
     * Tokenize variable
     * @private
     */
    private lexVariable() {
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
            this.column += this.cursor - this.modeStartCursor;
            this.delimiter = '';
        }
    }

    /**
     * Tokenize unknown
     * @private
     */
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

    /**
     * Tokenize comment
     * @private
     */
    private lexComment() {
        this.cursor++;

        if (grammar.REGEX_NEWLINE.exec(this.nextCharacter)) {
            this.mode = LexMode.ALL;
            this.column++;
        }
    }
}
