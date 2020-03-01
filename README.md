# Cocora

Cocora is a lightweight tool written in Typescript that supports [Behavior Based Development (BDD)](https://en.wikipedia.org/wiki/Behavior-driven_development), a software development process that aims to improve software quality and reduce maintenance costs.

Cocora is a modular system that allows you to declare and execute multiple scenarios with configurable steps.

## FAQ

- How does Cocora relate to [Cucumber](https://cucumber.io/)?

Cocora is inspired by Cucumber, has similarities in the definition format of Scenarios and Steps. Cocora incorporates extra functionalities and brings with it a new execution architecture. [See examples section](#).


## Examples

**Steps definitions:**

```yml
# steps.yml

- Feature:
    Name: Feature 1
    Scenarios:
    - Name: Scenario 1
      Steps:
      - Given: that I have gone to the Google page
      - When: 'I add "cats" to the search box'
      - And: click the Search Button
      - Then: '"cats" should be mentioned in the results'
      data: []
```

**Steps declarations:**

```ts
// declarations.steps.ts

import { Then, Given } from "../src";

const GooglePage = Given('that I have gone to the Google page', {}, async () => {
    console.log('Go to Google page');
    await wait(1000);
})

const SearchBox = Then('I add {string} to the search box', {}, async (search: string) => {
    console.log(`Type ${search} in the search box`);
})

const ClickSearchButton = Then('click the Search Button', {}, async () => {
    console.log('Click on the search button');
})

const Metioned = Then('{string} should be mentioned in the results', {}, async (search: string) => {
    console.log(`The word ${search} appears`);
})

export { GooglePage, SearchBox, ClickSearchButton, Metioned }
```

**Module referencing**

```ts
// main.ts

import { Module } from "cocora";
import { GooglePage, ClickSearchButton, SearchBox, Metioned } from "./declarations.steps.ts";

Module({
    name: 'Module A',
    declarations: [ GooglePage, SearchBox, ClickSearchButton, Metioned ],
    stepsPath: './steps.yml'
}).run();
```

**Running the module**

```bash
$ ts-node main.ts

Go to Google page
Type cats in the search box
Click on the search button
The word cats appears

Report
- State: Success
- Scenarios executed: 1
- Steps executed: 4 / 4
```

## API

## TODO

- [ ] Process custom input data
- [ ] Support for Float and regular expressions
- [ ] Support condditions
- [x] Generate report
- [ ] Hook support
- [ ] Support extensions
- [ ] Create CLI