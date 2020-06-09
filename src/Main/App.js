import React from 'react';
import './App.css';
import { EditableMathField, StaticMathField, addStyles } from 'react-mathquill';
import { parser } from "mathjs"

addStyles();

String.prototype.replaceAll = function(str1, str2, ignore) {
    return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
}

function latexToMathJS(latex) {
	console.log(latex);
	return latex.replaceAll("\\cdot", "*")
				.replaceAll("{", "(")
				.replaceAll("}", ")")
				.replaceAll("xy", "x*y")
				.replaceAll("yx", "y*x")
				.replaceAll("\\left", "")
				.replaceAll("\\right", "");
}

export default class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = { latex: "2x^2-3y^2=0", outputLatex: "2x^2-3y^2=0" };

		this.parser = parser();
	}

	updateLatex = (field) => {
		this.setState({ latex: field.latex() });
	}

	render() {
		return (
			<div className="App">
				Input: <EditableMathField className="math-field" latex={this.state.latex} onChange={this.updateLatex}></EditableMathField>
				<br/>

				Simplified: <StaticMathField className="math-field">{this.state.outputLatex}</StaticMathField>
				<br/>
			</div>
		);
	}
}
