import { Module } from "../src";
import StepsDefinitions from "./definitions";
import CaseA from "./openWindow.step";
import CaseB from "./closeWindow.step";
import { HelloWord, ShowNumber, MultipleParams } from "./helloWord.step";

Module({
    name: 'Scenario 1',
    declarations: [
        CaseA,
        CaseB,
        HelloWord,
        MultipleParams,
        ShowNumber
    ],
    steps: StepsDefinitions
}).run();