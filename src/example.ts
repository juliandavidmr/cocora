/**
 * @description Cache all input data in each scenario.
 */
export class Example {

	readonly rowsMap: Map<string, string[]> = new Map();
	rowsLength = 1; // TODO: replace by rowsMap

	constructor(str: string) {
		this._initialize(str);
	}

	private _initialize(str: string) {
		const rows = (str || '').split('\n')
			.filter(v => !!v)
			.map(v => v.split('&'))
			.map(v => v.map(c => c.trim()));

		if (rows.length) {
			const columns = rows.slice(0, 1)[0];
			rows.shift();
			columns.map((c, index) => {
				const rowsTmp = rows.map(r => r[index]);
				this.rowsMap.set(c, rowsTmp);
				if (rowsTmp.length > this.rowsLength) {
					this.rowsLength = rowsTmp.length;
				}
			})
		}
	}

	getValue(column: string, rowIndex: number): string | undefined {
		if (this.rowsMap.has(column)) {
			return (this.rowsMap.get(column) || [])[rowIndex];
		}
	}

	get length() {
		return this.rowsLength;
	}

	toString() {
		return this.rowsMap
	}
}