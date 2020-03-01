import { BASE_PARAMETERS_REGEX, EXPRESSIONS } from "./sentence";
import { ModuleConfig, Feature } from "./interfaces";
import { readYaml } from "./reader";
import { Example } from "./example";

export function Module(params: ModuleConfig) {
	params = { verbose: true, continueOnError: false, ...params };

	const input = readYaml(params.stepsPath);

	// console.log(JSON.stringify(input))

	return { run: () => run(input, params) };
}

async function run(features: Feature[], params: ModuleConfig) {
	for (const feature of features) {
		let scenariosExecuted = 0;
		let stepsExecuted = 0;
		let examplesCount = 0;
		try {
			for (const Scenario of feature.Feature.Scenarios) {
				scenariosExecuted++;
				const ScenarioExample = new Example(Scenario.Examples);
				examplesCount = ScenarioExample.length;
				for (let i = 0; i < ScenarioExample.length; i++) {
					console.log();
					for await (const Step of Scenario.Steps) {
						try {
							let sentencePhrase = Step.Given || Step.Then || Step.When || Step.And || '';
							sentencePhrase = replaceExprExample(sentencePhrase, i, ScenarioExample);
							const currentDef = params.declarations.find(s => s.definition.test(sentencePhrase));
	
							if (currentDef) {
								const params = getParameters(sentencePhrase, currentDef.definition);
								await runFn(currentDef.cb, params?.slice(1) || [], { sentencePhrase });
								stepsExecuted++;
							} else {
								let message = '';
								if (params.name) {
									message += `Current module '${params.name}'.\n`
								}
								if (Scenario.Name) {
									message += `Current Scenario: ${Scenario.Name || 'Not specified'}\n`
								}
								message += `No definition found for: ${sentencePhrase}`
	
								throw new Error(message);
							}
						} catch (error) {
							if (!params.continueOnError) {
								throw error;
							}
						}
					}
				}
			}
		} catch (error) {
			if (!params.continueOnError) {
				console.error(error)
			}
		} finally {
			const totalSteps = feature.Feature.Scenarios.map(s => s.Steps.length).reduce((a, b) => a + b)

			const report = {
				scenariosExecuted,
				stepsExecuted,
				totalSteps,
				success: ((totalSteps * examplesCount) - stepsExecuted) === 0
			}

			if (params.verbose) {
				console.info('\nReport');
				console.info('- State:', report.success ? 'Success' : 'Fail');
				console.info('- Scenarios executed:', scenariosExecuted);
				console.info('- Steps executed:', (stepsExecuted / examplesCount), `/`, totalSteps);
			}

			return report;
		}
	}
}

function replaceExprExample(phrase: string, rowIndex: number, example: Example) {
	return phrase.replace(EXPRESSIONS.example, (column: string) => {
		const columnName = EXPRESSIONS.example.exec(column) || [];
		let value = example.getValue(columnName[1], rowIndex);

		if (!value?.startsWith('"')) {
			value = '"' + value;
		}

		if (!value?.endsWith('"')) {
			value = value + '"';
		}

		return value;
	});
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

async function runFn(cb: Function, params: any[], extra?: { sentencePhrase: string }): Promise<boolean> {
	if (typeof cb === 'function') {
		return await cb.call({}, ...params);
	}
	throw new Error(extra && extra.sentencePhrase ? `The ${extra.sentencePhrase} definition does not have a function` : 'There is a definition without function');
}