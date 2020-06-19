function monomialString(coef, name, hasPrevious) {
	let rounded = Math.round(coef * 100) / 100;

	if (rounded === 0) {
		return '';
	}

	let prefix = '';
	
	if (hasPrevious && coef > 0) {
		prefix = '+';
	}

	if (rounded === 1) {
		rounded = '';
	}

	if (rounded === -1) {
		rounded = '-';
	}

	return prefix + rounded + name;
}

export default class Polynomial {
    /**
     * Creates a polynomial from a mathjs expression tree.
     * @param {node} rootNode 
     */
    static fromNode(rootNode) {
		let constant = 0;
		const coefficients = {};

		const text = rootNode.toString();
		const terms = [];

		// Splits the string into its coefficients.
		for (const plusString of text.split("+")) {
			const negs = plusString.split("-");

			for (let i = 0; i < negs.length; ++i) {
				// Removes spaces and * symbol.
				// Also determines if the term is negative by using the index i.
				terms.push({ text: negs[i].replace(/\s/g, "")
										  .replace(/\*/g, "")
										  .replace(/\(/g, "")
										  .replace(/\)/g, ""), isNegative: i > 0 });
			}
		}

		// For loops through terms
		for (let term of terms) {
			let value = 1;

			// If the entire string is simply a number, we have a constant term
			if (!isNaN(term.text)) {
				constant = parseFloat(term.text) * (term.isNegative ? -1 : 1);
				continue;
			}

			// If the first char is not a number, the coefficient is either 1 or -1
			if (term.text[0] >= '0' && term.text[0] <= '9') {
				const coef = term.text.replace(/(^\d*\.?\d*)(.+$)/i,'$1');
				value = parseFloat(coef);
			}

			const name = term.text.replace(/(^\d*\.?\d*)(.+$)/i,'$2');

			if (term.isNegative) {
				value *= -1;
			}

			coefficients[name] = value;
		}
		return new Polynomial(coefficients, constant);
    }

    /**
     * Every polynomial is a dictionary and a constant in memory. Example:
     * ({ "x^2": 3, "x": -2, "xy": 5 }, 3) <=> 3x^2 - 2x + 5xy + 3.
     * By convention, mixed terms like 3xy are sorted alphabetically.
     * @param {Dictionary<string, number>} coefficients
	 * @param {number | undefined} constant
     */
    constructor(coefficients, constant = undefined) {
		this.coefficients = coefficients;

		this.constant = constant ?? 0;
	}
	
	toString() {
		const keys = Object.keys(this.coefficients).sort((a, b) => a.localeCompare(b));
	
		let str = '';
		let isFirst = true;

		for (const key of keys) {
			const mono = monomialString(this.coefficients[key], key, !isFirst);
			
			if (isFirst) {
				isFirst = mono.length <= 0;
			}

			str += mono;
		}

		str += monomialString(this.constant, '', !isFirst);

		return str;
	}
}