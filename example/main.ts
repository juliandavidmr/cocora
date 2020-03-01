import { Module } from "../src";
import CaseA from "./openWindow.step";
import CaseB from "./closeWindow.step";
import { HelloWord, ShowNumber, MultipleParams, GooglePage, ClickSearchButton, SearchBox, Metioned } from "./helloWord.step";

Module({
    name: 'Scenario 1',
    declarations: [
        CaseA,
        CaseB,
        HelloWord,
        MultipleParams,
        ShowNumber,
        GooglePage,
        SearchBox,
        ClickSearchButton,
        Metioned
    ],
    stepsPath: './steps.yml'
}).run();