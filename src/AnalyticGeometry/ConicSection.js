import Trigonometry from "../Trigonometry";
import { lusolve } from "mathjs";
import Polynomial from "../Polynomial";
import Line from "./Line";
import Ellipse from "./Ellipse";
import Circle from "./Circle";
import Hyperbole from "./Hyperbole";
import Parabola from "./Parabola";
import Quadratic from "../Polynomial/Quadratic";

export default class ConicSection {
    static Types = Object.freeze({
        emptySet: 'emptySet',
        lines: 'lines',
        circle: 'circle',
        ellipse: 'ellipse',
        hyperbole: 'hyperbole',
        parabola: 'parabola'
    });

    /**
     * Safely creates a ConicSection from a Polynomial.
     * @param {Polynomial} poly 
     * @param {CoordinateSystem} coordinateSystem
     */
    static fromPolynomial(poly, coordinateSystem) {
        const a = poly.coefficients['x^2'] ?? 0;
        const b = poly.coefficients['xy'] ?? 0;
        const c = poly.coefficients['y^2'] ?? 0;
        const d = poly.coefficients['x'] ?? 0;
        const e = poly.coefficients['y'] ?? 0;
        const f = poly.constant ?? 0;

        return new ConicSection(a, b, c, d, e, f, coordinateSystem);
    }

    /**
     * The coefficients represent the equation below:
     *     ax^2 + bxy + cy^2 + dx + ey + f = 0.
     * 
     * Note that the coordinateSystem should be on a plane (2D).
     * 
     * @param {number} a 
     * @param {number} b 
     * @param {number} c 
     * @param {number} d 
     * @param {number} e 
     * @param {number} f 
     * @param {CoordinateSystem} coordinateSystem 
     */
    constructor(a, b, c, d, e, f, coordinateSystem) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.e = e;
        this.f = f;
        this.coordinateSystem = coordinateSystem;
        this.type = undefined;
    }

    yAsFunctionOfX(x) {
        return new Quadratic(this.c, this.e + this.b * x, this.d * x + this.a * x**2 + this.f).roots();
    }

    g(x, y) {
        return this.a * x**2 + this.b * x * y + this.c * y**2 + this.d * x + this.e * y + this.f;
    }

    simplifyLinearTerms() {
        if (this.d === 0 && this.e === 0) {
            return;
        }

        const A = [[this.a, this.b/2], [this.b/2, this.c]];
        const b = [-this.d/2, -this.e/2];

        try {
            const solution = lusolve(A, b);
            const h = solution[0][0];
            const k = solution[1][0];

            this.translate(h, k);
        } catch (e) {
            // This conic has no center => It is a parabola
            this.type = ConicSection.Types.parabola;
            return;
        }

        // TODO: this.coordinateSystem.translate(...);
    }

    simplifyMixedTerms() {
        if (this.b === 0) {
            return;
        }
        
        const theta = Trigonometry.arccot((this.a - this.c) / this.b) / 2;
        this.rotate(theta);

        // TODO: this.coordinateSystem.rotate(...);
    }

    toPolynomial() {
        return new Polynomial({
            'x^2': this.a, 'xy': this.b, 'y^2': this.c, 'x': this.d, 'y': this.e
        }, this.f);
    }

    /**
     * Eliminates, if possible, b, d and e by changing the coordinate system.
     */
    simplify() {
        this.simplifyLinearTerms();
        this.simplifyMixedTerms();
    }

    translate(h, k) {
        const d = 2 * this.a * h + this.b * k + this.d;
        const e = 2 * this.c * k + this.b * h + this.e;
        const f = this.g(h, k);

        this.d = d;
        this.e = e;
        this.f = f;
    }

    rotate(theta) {
        const c = Math.cos(theta);
        const s = Math.sin(theta);

        const newA = this.a * (c**2) + this.b * s * c + this.c * (s**2);
        const newB = (this.c - this.a) * Math.sin(2 * theta) + this.b * Math.cos(2 * theta);
        const newC = this.a * s**2 - this.b * s * c + this.c * c**2;
        const newD = this.d * c + this.e * s;
        const newE = -this.d * s + this.e * c;
        const newF = this.f;

        this.a = newA;
        this.b = newB;
        this.c = newC;
        this.d = newD;
        this.e = newE;
        this.f = newF;
    }

    isEmptySet() {
        const roots = this.yAsFunctionOfX(0);
        return roots[0] === 'imaginary' && roots[1] === 'imaginary';
    }

    identifyType() {
        this.simplify();

        if (!!this.type) {
            return;
        }

        if (this.isEmptySet()) {
            this.type = ConicSection.Types.emptySet;
            return;
        }

        if (this.a !== 0 && this.c !== 0 && this.b === 0 && this.d === 0 && this.e === 0 && this.f === 0) {
            this.type = ConicSection.Types.lines;
            return;
        }

        if ((this.a > 0 && this.c < 0) || (this.a < 0 && this.c > 0)) {
            this.type = ConicSection.Types.hyperbole;
            return;
        }

        if (this.a !== 0 && this.c === this.a) {
            this.type = ConicSection.Types.circle;
            return;
        }

        if (this.a !== 0 && this.c !== 0 && this.c !== this.a) {
            this.type = ConicSection.Types.ellipse;
            return;
        }

        this.type = ConicSection.Types.lines;
    }

    createIdentifiedObject() {
        this.identifyType();

        switch (this.type) {
            case 'emptySet':
                return undefined;
            case 'lines':
                return Line.fromConicSection(this);
            case 'circle':
                return Circle.fromConicSection(this);
            case 'ellipse':
                return Ellipse.fromConicSection(this);
            case 'hyperbole':
                return Hyperbole.fromConicSection(this);
            case 'parabola':
                return Parabola.fromConicSection(this);
            default:
                return undefined;
        }
    }

    /**
     * Finds new coefficients such that this conic is equivalent in the new coordinate system.
     * @param {CoordinateSystem} coordinateSystem 
     */
    /*
     TODO: Implement this
     changeCoordinateSystem(coordinateSystem) {
        // Let the current basis be E and the other basis be F.
        const E = this.coordinateSystem;
        const F = coordinateSystem;

        // This should be a 2x2 matrix
        const Mfe = F.matrixTo(E);
        const Mef = E.matrixTo(F);

        // a, b, c calculation

        // d, e calculation

        // f does not change

        this.coordinateSystem = coordinateSystem;
    }
    */


    // MARK: Cloning
    
    /**
     * Clones this.
     */
    clone() {
        return new ConicSection(this.a, this.b, this.c, this.d, this.e, this.f, this.coordinateSystem);
    }
}