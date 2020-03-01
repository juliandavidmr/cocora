import { ModuleConfig } from "./interfaces";
import { BASE_PARAMETERS_REGEX } from "./sentence";

export function Module(params: ModuleConfig) {
    const stepsDefinitions = stepsToList(params.steps);

    async function run() {
        for await (const stepDefinition of stepsDefinitions) {
            const currentDef = params.declarations.find((s) => s.definition.test(stepDefinition.definition));

            if (currentDef) {
                const params = getParameters(stepDefinition.definition, currentDef.definition);
                await runFn(currentDef.cb, params?.slice(1) || []);
            } else {
                let message = '';
                if (params.name) {
                    message += `Current module '${params.name}'. `
                }
                message += `No definition found for: ${stepDefinition.definition}`

                throw new Error(message);
            }
        }
    }

    return { run };
}

function stepsToList(steps: string): { definition: string }[] {
    return steps.split('\n')
        .map(s => s.trim())
        .filter(s => s)
        .map(s => ({ definition: s }));
}

function getParameters(definition: string, definitionSentence: RegExp): (string | number)[] {
    const params = definitionSentence.exec(definition);
    return params?.map(v => {
        if (new RegExp(BASE_PARAMETERS_REGEX.string).test(v)) {
            return v.slice(1, v.length - 1);
        } else if (new RegExp(BASE_PARAMETERS_REGEX.number).test(v)) {
            return +v;
        } else {
            return v;
        }
    }) || [];
}

async function runFn(cb: Function, params: any[]): Promise<boolean> {
    if (typeof cb === 'function') {
        return await cb.call({}, ...params);
    }
    return false;
}