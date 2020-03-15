import { Then, Given } from "cocora";
import { expect } from "chai";
import { PageHelper } from "../pageHelper";

/**
 * export the instance of the page
 */
export const page = new PageHelper();

export const GooglePage = Given('That I have gone to the Google page', {}, async () => {
    await page.init({
        headless: false,
        defaultViewport: { height: 1000, width: 1300 }
    });
    await page.open('https://duckduckgo.com/')
})

export const SearchBox = Then('I add {string} to the search box', {}, async (search: string) => {
    await page.sendElementText('#search_form_input_homepage', search)
})

export const ClickSearchButton = Then('click the Search Button', {}, async () => {
    await page.clickElement('#search_button_homepage');
    await page.delay(1000);
})

export const Metioned = Then('{string} should be mentioned in the results', {}, async (search: string) => {
    expect(search).not.undefined;
    const content = await page.getContent();
    expect(content).contains(search);
})

export const ClosePage = Then('Close page', {}, async () => {
    await page.close();
})

export const Number = Then(/([0-9]{3,5})/, {}, async () => {
    await page.close();
})