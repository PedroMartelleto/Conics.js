import React from 'react';
import './App.css';
import { EditableMathField, StaticMathField, addStyles } from 'react-mathquill';
import { parse, simplify } from "mathjs"
import Polynomial from '../Polynomial';
import ConicSection from '../AnalyticGeometry/ConicSection';

addStyles();

function latexToMathJS(latex) {
	return latex.replace(/(\d+)x/g, "$1*x")
		.replace(/(\d+)y/g, "$1*y")
		.replace(/\\cdot/g, "*")
		.replace(/{/g, "(")
		.replace(/}/g, ")")
		.replace(/xy/g, "x*y")
		.replace(/yx/g, "y*x")
		.replace(/\\left/g, "")
		.replace(/\\right/g, "");
}

function monomialLatex(coef, name, hasPrevious) {
	const rounded = Math.round(coef * 100) / 100;

	if (rounded === 0) {
		return '';
	}

	let prefix = '';
	
	if (hasPrevious && coef > 0) {
		prefix = '+';
	}

	return prefix + rounded + name;
}

export default class App extends React.Component {
	constructor(props) {
		super(props);

		const startLatex = "4x^2-4xy+7y^2+12x+6y-9";
		this.state = { latex: startLatex, outputLatex: this.simplifyLatex(startLatex) };
	}

	simplifyLatex(latex) {
		let rootNode = undefined;
		let latexResult = latex;

		try {
			const str = latexToMathJS(latex);
			rootNode = parse(str);
			simplify(rootNode);
			
			const polynomial = Polynomial.fromNode(rootNode);
			const conic = ConicSection.fromPolynomial(polynomial);
			conic.simplify();

			latexResult = monomialLatex(conic.a, 'x^2', false) +
						  monomialLatex(conic.b, 'xy', true) +
						  monomialLatex(conic.c, 'y^2', true) +
						  monomialLatex(conic.d, 'x', true) +
						  monomialLatex(conic.e, 'y', true) +
						  monomialLatex(conic.f, '', true);
		}
		catch (e) {
			return latex;
		}

		return latexResult;
	}

	updateLatex = (field) => {
		const latex = field.latex();
		this.setState({ latex, outputLatex: this.simplifyLatex(latex) });
	}

	render() {
		return (
			<div className="App">
				Input: <EditableMathField className="math-field" latex={this.state.latex} onChange={this.updateLatex}></EditableMathField>
				<br />

				Simplified: <StaticMathField className="math-field">{this.state.outputLatex}</StaticMathField>
				<br />
			</div>
		);
	}
}
