export interface SentenceReturn {
    definition: RegExp,
    config: SentenceConfig,
    cb: Function
}

export interface SentenceConfig {

}

export interface ModuleConfig {
    name?: string
    declarations: SentenceReturn[]
    stepsPath: string
    verbose?: boolean
    continueOnError?: boolean;
}

export interface Feature {
    Feature: {
        Name: string;
        Scenarios: Scenario[]
    }
}

interface Scenario {
    Name: string;
    Steps: Step[]
    data: any[]
}

interface Step {
    Given?: string
    Then?: string
    When?: string
    And?: string
}