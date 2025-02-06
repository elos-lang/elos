"use strict";

import grammar from "../grammar.js";
import {LexMode} from "../types/lex-mode";
import {TokenStream} from "../types/token-stream";
import {TokenType} from "../types/token-type";

export class Lexer {

    private mode: LexMode = LexMode.ALL;

    private cursor: number = 0;

    private end: number = 0;

    private currLine: number = 1;

    private currLinePos: number = 1;

    private tokens: TokenStream = [];

    private currTokenValue: string = '';

    private currCharacter: string = '';

    private nextCharacter: string = '';

    private tokenDelimiter: string = '';

    determineMode(): LexMode {

        // Reset the current token value
        this.currTokenValue = '';

        if (grammar.REGEX_IDENT.exec(this.currCharacter)) {
            return LexMode.IDENT;
        }

        if (grammar.REGEX_STRING_DELIMITER.exec(this.currCharacter)) {
            this.tokenDelimiter = this.currCharacter;
            return LexMode.STRING;
        }

        if (grammar.REGEX_NUMBER.exec(this.currCharacter)) {
            return LexMode.NUMBER;
        }

        if (grammar.REGEX_SYMBOL.exec(this.currCharacter)) {
            return LexMode.SYMBOL;
        }

        if (grammar.REGEX_NEWLINE.exec(this.currCharacter)) {
            return LexMode.NEWLINE;
        }

        if (grammar.REGEX_WHITESPACE.exec(this.currCharacter)) {
            return LexMode.WHITESPACE;
        }

        return LexMode.UNKNOWN;
    }

    lexIdent() {

        this.currTokenValue += this.currCharacter;
        this.cursor++;
        this.currLinePos++;

        if (! this.nextCharacter || ! grammar.REGEX_IDENT.exec(this.nextCharacter)) {
            this.tokens.push({
                type: TokenType.IDENT,
                value: this.currTokenValue,
                line: this.currLine,
                position: this.currLinePos,
                end: this.cursor < this.end
            });
            this.mode = LexMode.ALL;
        }
    }

    lexString() {

        if (this.tokenDelimiter !== this.currCharacter) {
            this.currTokenValue += this.currCharacter;
        }
        this.cursor++;

        if (this.nextCharacter === this.tokenDelimiter) {
            this.tokens.push({
                type: TokenType.STRING,
                value: this.currTokenValue,
                line: this.currLine,
                position: this.currLinePos,
                end: this.cursor < this.end
            });
            this.mode = LexMode.ALL;
            this.cursor++;
            this.currLinePos++;
            this.tokenDelimiter = '';
        }
    }

    lexNumber() {
        this.currTokenValue += this.currCharacter;
        this.cursor++;
        this.currLinePos++;

        if (!this.nextCharacter || !grammar.REGEX_NUMBER.exec(this.nextCharacter)) {
            this.tokens.push({
                type: TokenType.NUMBER,
                value: this.currTokenValue,
                line: this.currLine,
                position: this.currLinePos,
                end: this.cursor < this.end
            });
            this.mode = LexMode.ALL;
        }
    }

    lexSymbol() {
        this.tokens.push({
            type: TokenType.SYMBOL,
            value: this.currCharacter,
            line: this.currLine,
            position: this.currLinePos,
            end: this.cursor < this.end
        });
        this.cursor++;
        this.currLinePos++;
        this.mode = LexMode.ALL;
    }

    lexNewline() {
        this.cursor++;
        this.currLine++;
        this.currLinePos = 0;
        this.mode = LexMode.ALL;
    }

    lexWhitespace() {
        this.cursor++;
        this.mode = LexMode.ALL;
    }

    lexUnknown() {
        this.tokens.push({
            type: TokenType.UNKNOWN,
            value: this.currCharacter,
            line: this.currLine,
            position: this.currLinePos,
            end: this.cursor < this.end
        });
        this.cursor++;
        this.currLinePos++;
        this.mode = LexMode.ALL;
    }

    tokenize(text: string): TokenStream {

        this.end = text.length;

        while (this.cursor < this.end) {

            this.currCharacter = text[this.cursor];
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
                case LexMode.UNKNOWN:
                    this.lexUnknown();
                    break;
            }
        }

        return this.tokens;
    }
}
