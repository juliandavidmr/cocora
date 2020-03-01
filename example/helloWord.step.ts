import { Sentence, Then } from "../src";

function wait(time: number) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, time);
    })
}

export const HelloWord = Sentence('Hello {string}', {}, async (name: string) => {
    console.log(`Start!`);
    await wait(5000);
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