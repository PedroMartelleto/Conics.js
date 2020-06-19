import React from 'react';
import './App.css';
import { EditableMathField, StaticMathField, addStyles } from 'react-mathquill';
import { simplify } from "mathjs"
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

function formatPoints(list) {
	if (!list) {
		return "";
	}

	let str = "";

	for (let i = 0; i < list.length; ++i) {
		if (!list[i]) {
			return "";
		}

		str += list[i].toString() + "_{\\Sigma}";

		if (i < list.length - 1) str += ", ";
	}

	return str;
}

export default class App extends React.Component {
	constructor(props) {
		super(props);

		const startLatex = "4x^2-4xy+7y^2+12x+6y-9";

		const { conic, foci, center, vertices, extra, sigmaCondition } = this.identifyConicFromLatex(startLatex);
		
		this.state = { latex: startLatex,
					   outputLatex: conic.toPolynomial().toString(),
					   conicType: conic.type,
					   foci, center, vertices, extra, sigmaCondition };
	}

	identifyConicFromLatex(latex) {
		let conic = undefined;

		let foci, center, vertices, extra, sigmaCondition;

		try {
			const str = latexToMathJS(latex);
			const rootNode = simplify(str); // TODO: rationalize here would be better but... https://github.com/josdejong/mathjs/issues/1290
			
			const polynomial = Polynomial.fromNode(rootNode);
			conic = ConicSection.fromPolynomial(polynomial);
			console.log(JSON.stringify(conic));

			const identified = conic.createIdentifiedObject();

			switch (conic.type) {
				case 'circle':
					foci = identified.foci;
					center = identified.center;
					vertices = identified.vertices;
					sigmaCondition = "F_1=(c,0), F_2=(-c,0)";
					break;
				case 'ellipse':
					foci = identified.foci;
					center = identified.center;
					vertices = identified.vertices;
					sigmaCondition = "F_1=(c,0), F_2=(-c,0)";
					break;
				case 'hyperbole':
					foci = identified.focus;
					center = identified.center;
					vertices = identified.vertices;
					extra = identified.asymptoteEquations;
					sigmaCondition = "F_1=(c,0), F_2=(-c,0)";
					break;
				case 'parabola':
					foci = [identified.focus];
					vertices = [identified.vertex];
					extra = identified.axisEquation;
					sigmaCondition = "F=(p, 0)";
					break;
				default:
					break;
			}
		}
		catch (e) {
			return latex;
		}

		return { conic, foci, center, vertices, extra, sigmaCondition };
	}

	updateLatex = (field) => {
		const latex = field.latex();

		const { conic, foci, center, vertices, extra, sigmaCondition } = this.identifyConicFromLatex(latex);
		
		const str = !!conic ? conic.toPolynomial().toString() : latex;

		this.setState({ latex,
						outputLatex: str,
						conicType: !!conic ? conic.type : 'undefined',
						foci, center, vertices, extra, sigmaCondition });
	}

	render() {
		return (
			<div className="App" style={{fontWeight: 600}}>
				Input: <EditableMathField className="math-field" latex={this.state.latex} onChange={this.updateLatex}></EditableMathField>
				<br />

				<br />
				<br />
				Type: {this.state.conicType ?? ''}
				<br />

				Simplified: <StaticMathField className="math-field">{this.state.outputLatex}</StaticMathField>
				<br />

				Σ is chosen such that <StaticMathField className="math-field">{this.state.sigmaCondition}</StaticMathField>
				<br />

				Foci: <StaticMathField className="math-field">{ formatPoints(this.state.foci ?? []) }</StaticMathField>
				<br />
				
				Center: <StaticMathField className="math-field">{ formatPoints([this.state.center]) }</StaticMathField>
				<br />
				
				Vertices: <StaticMathField className="math-field">{ formatPoints(this.state.vertices ?? []) }</StaticMathField>
				<br />

				{ this.state.extra }
			</div>
		);
	}
}
