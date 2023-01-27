"use strict";

const REGEX_IDENT = /[a-zA-ZÆÐƎƏƐƔĲŊŒẞÞǷȜæðǝəɛɣĳŋœĸſßþƿȝĄƁÇĐƊĘĦĮƘŁØƠŞȘŢȚŦŲƯY̨Ƴąɓçđɗęħįƙłøơşșţțŧųưy̨ƴÁÀÂÄǍĂĀÃÅǺĄÆǼǢƁĆĊĈČÇĎḌĐƊÐÉÈĖÊËĚĔĒĘẸƎƏƐĠĜǦĞĢƔáàâäǎăāãåǻąæǽǣɓćċĉčçďḍđɗðéèėêëěĕēęẹǝəɛġĝǧğģɣĤḤĦIÍÌİÎÏǏĬĪĨĮỊĲĴĶƘĹĻŁĽĿʼNŃN̈ŇÑŅŊÓÒÔÖǑŎŌÕŐỌØǾƠŒĥḥħıíìiîïǐĭīĩįịĳĵķƙĸĺļłľŀŉńn̈ňñņŋóòôöǒŏōõőọøǿơœŔŘŖŚŜŠŞȘṢẞŤŢṬŦÞÚÙÛÜǓŬŪŨŰŮŲỤƯẂẀŴẄǷÝỲŶŸȲỸƳŹŻŽẒŕřŗſśŝšşșṣßťţṭŧþúùûüǔŭūũűůųụưẃẁŵẅƿýỳŷÿȳỹƴźżžẓ]/;
const REGEX_NUMBER = /\d/;
const REGEX_SYMBOL = /[.!?,;:()'"-—…]/;
const REGEX_WHITESPACE = /\s/;
const REGEX_NEWLINE = /[\n\r]/;
const REGEX_STRING_DELIMITER = /["']/;

const MODE_ALL = 1;
const MODE_IDENT = 2;
const MODE_NUMBER = 3;
const MODE_SYMBOL = 4;
const MODE_WHITESPACE = 5;
const MODE_UNKNOWN = 6;
const MODE_NEWLINE = 7;
const MODE_STRING = 8;

let mode = MODE_ALL;

let cursor = 0;
let end = 0;

let currLine = 1;
let currLinePos = 0;

let tokens = [];
let currTokenValue;
let currCharacter;
let nextCharacter;

function getMode() {

    // Reset the current token value
    currTokenValue = '';

    if (REGEX_IDENT.exec(currCharacter)) {
        return MODE_IDENT;
    }

    if (REGEX_STRING_DELIMITER.exec(currCharacter)) {
        return MODE_STRING;
    }

    if (REGEX_NUMBER.exec(currCharacter)) {
        return MODE_NUMBER;
    }

    if (REGEX_SYMBOL.exec(currCharacter)) {
        return MODE_SYMBOL;
    }

    if (REGEX_NEWLINE.exec(currCharacter)) {
        return MODE_NEWLINE;
    }

    if (REGEX_WHITESPACE.exec(currCharacter)) {
        return MODE_WHITESPACE;
    }

    return MODE_UNKNOWN;
}

function lexIdent() {

    currTokenValue += currCharacter;
    cursor++;
    currLinePos++;

    if (! nextCharacter || ! REGEX_IDENT.exec(nextCharacter)) {
        tokens.push({
            type: 'ident',
            value: currTokenValue,
            line: currLine,
            position: currLinePos
        });
        mode = MODE_ALL;
    }
}

function lexString() {

    if (! REGEX_STRING_DELIMITER.exec(currCharacter)) {
        currTokenValue += currCharacter;
    }
    cursor++;

    if (REGEX_STRING_DELIMITER.exec(nextCharacter)) {
        tokens.push({
            type: 'string',
            value: currTokenValue,
            line: currLine,
            position: currLinePos
        });
        mode = MODE_ALL;
        cursor++;
        currLinePos++;
    }
}

function lexNumber() {
    currTokenValue += currCharacter;
    cursor++;
    currLinePos++;

    if (!nextCharacter || !REGEX_NUMBER.exec(nextCharacter)) {
        tokens.push({
            type: 'number',
            value: currTokenValue,
            line: currLine,
            position: currLinePos
        });
        mode = MODE_ALL;
    }
}

function lexSymbol() {
    tokens.push({
        type: 'symbol',
        value: currCharacter,
        line: currLine,
        position: currLinePos
    });
    cursor++;
    currLinePos++;
    mode = MODE_ALL;
}

function lexNewline() {
    cursor++;
    currLine++;
    currLinePos = 0;
    mode = MODE_ALL;
}

function lexWhitespace() {
    cursor++;
    mode = MODE_ALL;
}

function lexUnknown() {
    tokens.push({
        type: 'unknown',
        value: currCharacter,
        line: currLine,
        position: currLinePos
    });
    cursor++;
    currLinePos++;
    mode = MODE_ALL;
}

export default function lex(text) {

    end = text.length;

    while (cursor < end) {

        currCharacter = text[cursor];
        nextCharacter = text[cursor+1] || null;

        // Determine the mode
        if (mode === MODE_ALL) {
            mode = getMode();
        }

        switch (mode) {
            case MODE_STRING:
                lexString();
                break;
            case MODE_IDENT:
                lexIdent();
                break;
            case MODE_NUMBER:
                lexNumber();
                break;
            case MODE_SYMBOL:
                lexSymbol();
                break;
            case MODE_NEWLINE:
                lexNewline();
                break;
            case MODE_WHITESPACE:
                lexWhitespace();
                break;
            case MODE_UNKNOWN:
                lexUnknown();
                break;
        }
    }

    return tokens;
}
