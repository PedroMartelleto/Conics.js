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
				terms.push({ text: negs[i].replace(/\s/g, "").replace(/\*/g, ""), isNegative: i > 0 });
			}
		}

		// For loops through terms
		for (const term of terms) {
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

		/*
		Below is a better way to do this conversion, but the code still needs work.

		function getParent(node, parentsList) {
			return parentsList.find(n => {
				let isParent = false;

				n.forEach((nChild) => {
					if (nChild.equals(node)) {
						isParent = true;
					}
				})

				return isParent;
			});
		}

		const parentsList = [];

		rootNode.traverse((node, path, parent) => {
			switch (node.type) {
				case 'OperatorNode':
					parentsList.push(node);
					break;
				case 'ConstantNode':
					// Handles constant terms
					const parent = getParent(node, parentsList);

					if (!parent || parent.op === '+') {
						constant = node.value;
					}

					if (!!parent && parent.op === '-') {
						constant = -node.value;
					}
					break;
				case 'SymbolNode':
					// Handles non-constant terms
					
					const parent = getParent(node, parentsList);

					let isAtBottom = true;

					if (!parent) {
						coefficients[node.name] = 1;
						break;
					}

					// Ensures we are at the bottom of the tree
					parent.forEach(child => {
						if (child.type === 'OperatorNode') {
							isAtBottom = false;
						}
					})

					if (!isAtBottom) {
						break;
					}

					let coefficient = 1;
					let symbolNames = [];

					// Goes up the chain until we find addition or subtraction
					loop: while (!!parent) {
						if (parent.op === '*') {
							if (child.type === 'ConstantNode') {
								coefficient *= child.value;
							} else if (child.type === 'SymbolNode') {
								symbolNames.push(.name);
							}
						} else if (parent.op === '^') {
							let pow = 2;
							forEach

							symbolNames.push(node.name + '^' + pow);
						} else if (parent.op === '+') {
							break loop;
						} else if (parent.op === '-') {
							coefficient *= -1;
							break loop;
						}

						parent = getParent(parent, parentsList);
					}

					symbolNames.sort((a, b) => a.firstname.localeCompare(b.firstname));

					let symbolName = '';

					for (const symbol of symbolNames) {
						symbolName += symbol;
					}

					coefficients[symbolName] = coefficient;
					
					break;
			}
		});*/

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
}