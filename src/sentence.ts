import { SentenceReturn, SentenceConfig } from "./interfaces";

export function Sentence(definition: string, config: SentenceConfig, cb: Function): SentenceReturn {
    return { definition: String2RegExp(definition), config, cb }
}

export const When = Sentence;
export const Given = Sentence;
export const Then = Sentence;
export const And = Sentence;

/** ------------------- Utils -------------------- */

function String2RegExp(str: string) {
    return new RegExp(translateParams(str));
}

function translateParams(str: string) {
    return str
        .replace(EXPRESSIONS.string, BASE_PARAMETERS_REGEX.string)  // match string
        .replace(EXPRESSIONS.number, BASE_PARAMETERS_REGEX.number)  // match number
        .replace(EXPRESSIONS.example, BASE_PARAMETERS_REGEX.string); // match number
}

export const BASE_PARAMETERS_REGEX = Object.freeze({
    string: '("(?:[^"]*)")',
    number: '([0-9]+)'
})

export const EXPRESSIONS = {
    string: /{\s*string\s*}/g,
    number: /{\s*number\s*}/g,
    example: /<([\w+ ]+)>/g
}