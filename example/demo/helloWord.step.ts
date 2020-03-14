import { Sentence, Then, Given } from "../../src";

function wait(time: number) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, time);
    })
}

export const HelloWord = Sentence('Hello {string}', {}, async (name: string) => {
    console.log(`Start!`);
    await wait(1000);
    console.log(`End!`);
    console.log(`Hello ${name}!`);
})

export const ShowNumber = Sentence('My age is {number} years old', {}, (age: string) => {
    console.log(`Your age is ${age}!`);
})

export const MultipleParams = Then('{string} {number} with {number}', {}, (op: string, a: number, b: number) => {
    switch (op) {
        case 'sum':
            console.log(`Result ${op}: ${a + b}`);
            break;
        case 'subs':
            console.log(`Result ${op}: ${a - b}`);
        default:
            break;
    }
})

export const GooglePage = Given('that I have gone to the Google page', {}, async () => {
    console.log('Go to Google page');
    await wait(1000);
})

export const SearchBox = Then('I add {string} to the search box', {}, async (search: string) => {
    console.log(`Type ${search} in the search box`);
})

export const ClickSearchButton = Then('click the Search Button', {}, async () => {
    console.log('Click on the search button');
})

export const Metioned = Then('{string} should be mentioned in the results', {}, async (search: string) => {
    console.log(`The word ${search} appears`);
})

export const DataFromExample = Then('Get {string} and show', {}, async (search: string) => {
    console.log(`Print ${search}`);
})