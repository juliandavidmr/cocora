import { Module } from "cocora";

import { GooglePage, ClickSearchButton, SearchBox, Metioned, ClosePage } from "./definitions/helloWord.step";

Module({
    name: 'Module A',
    declarations: [Metioned, SearchBox, GooglePage, ClickSearchButton, ClosePage],
    stepsPath: './steps.yml'
}).run();