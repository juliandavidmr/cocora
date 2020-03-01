export interface SentenceReturn {
    definition: RegExp,
    config: SentenceConfig,
    cb: Function
}

export interface SentenceConfig {
    timeout?: number
}

export interface ModuleConfig {
    name?: string
    declarations: SentenceReturn[]
    stepsPath: string
    verbose?: boolean
    continueOnError?: boolean;
    timeout?: number
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
    Examples: string;
}

interface Step {
    Given?: string
    Then?: string
    When?: string
    And?: string
}