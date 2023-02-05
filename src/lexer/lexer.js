"use strict";

import grammar from "../grammar.js";

const MODE_ALL = 1;
const MODE_IDENT = 2;
const MODE_NUMBER = 3;
const MODE_SYMBOL = 4;
const MODE_WHITESPACE = 5;
const MODE_UNKNOWN = 6;
const MODE_NEWLINE = 7;
const MODE_STRING = 8;

export default class Lexer {

    constructor() {

        this.mode = MODE_ALL;
        this.cursor = 0;
        this.end = 0;
        this.currLine = 1;
        this.currLinePos = 1;

        this.tokens = [];
        this.currTokenValue = '';
        this.currCharacter = '';
        this.nextCharacter = '';
    }

    determineMode() {

        // Reset the current token value
        this.currTokenValue = '';

        if (grammar.REGEX_IDENT.exec(this.currCharacter)) {
            return MODE_IDENT;
        }

        if (grammar.REGEX_STRING_DELIMITER.exec(this.currCharacter)) {
            return MODE_STRING;
        }

        if (grammar.REGEX_NUMBER.exec(this.currCharacter)) {
            return MODE_NUMBER;
        }

        if (grammar.REGEX_SYMBOL.exec(this.currCharacter)) {
            return MODE_SYMBOL;
        }

        if (grammar.REGEX_NEWLINE.exec(this.currCharacter)) {
            return MODE_NEWLINE;
        }

        if (grammar.REGEX_WHITESPACE.exec(this.currCharacter)) {
            return MODE_WHITESPACE;
        }

        return MODE_UNKNOWN;
    }

    lexIdent() {

        this.currTokenValue += this.currCharacter;
        this.cursor++;
        this.currLinePos++;

        if (! this.nextCharacter || ! grammar.REGEX_IDENT.exec(this.nextCharacter)) {
            this.tokens.push({
                type: 'ident',
                value: this.currTokenValue,
                line: this.currLine,
                position: this.currLinePos
            });
            this.mode = MODE_ALL;
        }
    }

    lexString() {

        if (! grammar.REGEX_STRING_DELIMITER.exec(this.currCharacter)) {
            this.currTokenValue += this.currCharacter;
        }
        this.cursor++;

        if (grammar.REGEX_STRING_DELIMITER.exec(this.nextCharacter)) {
            this.tokens.push({
                type: 'string',
                value: this.currTokenValue,
                line: this.currLine,
                position: this.currLinePos
            });
            this.mode = MODE_ALL;
            this.cursor++;
            this.currLinePos++;
        }
    }

    lexNumber() {
        this.currTokenValue += this.currCharacter;
        this.cursor++;
        this.currLinePos++;

        if (!this.nextCharacter || !grammar.REGEX_NUMBER.exec(this.nextCharacter)) {
            this.tokens.push({
                type: 'number',
                value: this.currTokenValue,
                line: this.currLine,
                position: this.currLinePos
            });
            this.mode = MODE_ALL;
        }
    }

    lexSymbol() {
        this.tokens.push({
            type: 'symbol',
            value: this.currCharacter,
            line: this.currLine,
            position: this.currLinePos
        });
        this.cursor++;
        this.currLinePos++;
        this.mode = MODE_ALL;
    }

    lexNewline() {
        this.cursor++;
        this.currLine++;
        this.currLinePos = 0;
        this.mode = MODE_ALL;
    }

    lexWhitespace() {
        this.cursor++;
        this.mode = MODE_ALL;
    }

    lexUnknown() {
        this.tokens.push({
            type: 'unknown',
            value: this.currCharacter,
            line: this.currLine,
            position: this.currLinePos
        });
        this.cursor++;
        this.currLinePos++;
        this.mode = MODE_ALL;
    }

    tokenize(text) {

        this.end = text.length;

        while (this.cursor < this.end) {

            this.currCharacter = text[this.cursor];
            this.nextCharacter = text[this.cursor+1] || null;

            // Determine the mode
            if (this.mode === MODE_ALL) {
                this.mode = this.determineMode();
            }

            switch (this.mode) {
                case MODE_STRING:
                    this.lexString();
                    break;
                case MODE_IDENT:
                    this.lexIdent();
                    break;
                case MODE_NUMBER:
                    this.lexNumber();
                    break;
                case MODE_SYMBOL:
                    this.lexSymbol();
                    break;
                case MODE_NEWLINE:
                    this.lexNewline();
                    break;
                case MODE_WHITESPACE:
                    this.lexWhitespace();
                    break;
                case MODE_UNKNOWN:
                    this.lexUnknown();
                    break;
            }
        }

        return this.tokens;
    }
}
