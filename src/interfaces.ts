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
    steps: string
}