import React from 'react';
import './App.css';
import { EditableMathField, addStyles } from 'react-mathquill';
import Plot from "react-plotly.js";
import SurfaceData3D from './SurfaceData3D';
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
				.replaceAll("\\cos", "cos")
				.replaceAll("\\sin", "sin")
				.replaceAll("\\sqrt", "sqrt")
				.replaceAll("\\left", "")
				.replaceAll("\\right", "");
}

export default class App extends React.Component {
	constructor(props) {
		super(props);

		this.graph = new SurfaceData3D((x, y) => x + y);
		this.graph.generateXY();
		this.graph.generateZ();

		this.state = { latex: "f(x, y) = x + y", graphXData: this.graph.xData, graphYData: this.graph.yData, graphZData: this.graph.zData };

		this.parser = parser();
	}

	updateLatex = (field) => {
		const latex = field.latex();

		try {
			const converted = latexToMathJS(latex);
			console.log(converted);
			this.parser.evaluate(converted);
		}
		catch (e) {
			this.setState({ latex: field.latex() });
			return;
		}

		const f = this.parser.get("f");
		
		try {
			f(1, 1);
		}
		catch (e) {
			this.setState({ latex: field.latex() });
			return;
		}

		console.log("Successful conversion");

		this.graph.fn = f;
		this.graph.generateXY();
		this.graph.generateZ();

		this.setState({
			latex: field.latex(),
			graphXData: this.graph.xData,
			graphYData: this.graph.yData,
			graphZData: this.graph.zData
		})
	}

	render() {
		return (
			<div className="App">
				<EditableMathField className="math-field" latex={this.state.latex} onChange={this.updateLatex}></EditableMathField>
				<div>
					<Plot
						data={[{
							type: "surface",
							x: this.state.graphXData,
							y: this.state.graphYData,
							z: this.state.graphZData
						}]}
						layout={{
							width: window.innerWidth,
							height: window.innerHeight - 128,
							scene: {
								xaxis: {
									title: "x",
								},
								yaxis: {
									title: "y",
								},
								zaxis: {
									title: "z",
								}
							}
						}}
					/>
				</div>
			</div>
		);
	}
}
