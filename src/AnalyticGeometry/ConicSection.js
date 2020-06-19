import Trigonometry from "../Trigonometry";
import { lusolve, det } from "mathjs";
import Polynomial from "../Polynomial";
import Line from "./Line";
import Ellipse from "./Ellipse";
import Circle from "./Circle";
import Hyperbole from "./Hyperbole";
import Parabola from "./Parabola";
import Quadratic from "../Polynomial/Quadratic";
import Utils from "../Utils"

function safeNumber(x) {
    if (Number.isFinite(x)) {
        return x;
    }

    return 0;
}

export default class ConicSection {
    static Types = Object.freeze({
        emptySet: 'emptySet',
        point: 'point',
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
        const a = safeNumber(poly.coefficients['x^2']);
        const b = safeNumber(poly.coefficients['xy']);
        const c = safeNumber(poly.coefficients['y^2']);
        const d = safeNumber(poly.coefficients['x']);
        const e = safeNumber(poly.coefficients['y']);
        const f = safeNumber(poly.constant);

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

    asQuadraticFromFixedX(x) {
        return new Quadratic(this.c, this.e + this.b * x, this.d * x + this.a * x**2 + this.f);
    }

    g(x, y) {
        return this.a * x**2 + this.b * x * y + this.c * y**2 + this.d * x + this.e * y + this.f;
    }

    simplifyLinearTerms() {
        if (Utils.doubleEquals(this.d, 0) && Utils.doubleEquals(this.e, 0)) {
            return;
        }

        const A = [[this.a, this.b/2], [this.b/2, this.c]];
        const b = [-this.d/2, -this.e/2];

        if (Utils.doubleEquals(det(A), 0)) {
            // Zero or infinite solutions. Either way lusolve will fail since the matrix is not invertible.
        
            const ratio = this.a / (this.b/2);

            if (Number.isFinite(ratio) && Utils.doubleEquals((this.b/2)/this.c, ratio) && Utils.doubleEquals(this.d/this.e, ratio)) {
                console.log("[ConicSection simplifyLinearTerms] Found infinite translations");
                // If there are infinite solutions, both equations are equivalent. This means
                // that the coefficients have the same "ratio"

                // So, to calculate h and k, simply choose any h. Lets say h = 0.
                // Then k = -e/(2c)

                this.translate(0, -this.e/(2*this.c));

                // This conic has infinite centers => we have two parallel lines or two identical lines
                this.type = ConicSection.Types.lines;
            } else {
                console.log("[ConicSection simplifyLinearTerms] Found no possible translations");
                // This conic has no center => we have a parabola
                this.type = ConicSection.Types.parabola;
            }
            
            return;
        }

        const solution = lusolve(A, b);
        const h = solution[0][0];
        const k = solution[1][0];

        this.translate(h, k);

        // TODO: this.coordinateSystem.translate(...);
    }

    simplifyMixedTerms() {
        if (Utils.doubleEquals(this.b, 0)) {
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

    /**
     * Returns 'one' if there is only one solution, 'zero' if there are no solutions or 'infinite' if there are infinite solutions.
     */
    numberOfSolutionsString() {
        // We rewrite the conic as a quadratic (cy^2 + (e + bx)y + dx + ax^2 + f = 0) (*).
        // Our discriminant is a function of x.
        // So we need to check if that function is positive or zero for some x to
        // determine if our system has any solution.

        // Discriminant of the discriminant of (*).
        const a = this.b**2 - 4 * this.a * this.c;
        const b = 2 * this.b * this.e - 4 * this.c * this.d;
        const c = this.e**2 - 4 * this.c * this.f;

        // If a is 0...
        if (Utils.doubleEquals(a, 0)) {
            if (Utils.doubleEquals(b, 0)) {
                if (c > 0) {
                    return 'infinite';
                } else if (Utils.doubleEquals(c, 0)) {
                    return 'one';
                } else { // c < 0
                    return 'zero';
                }
            } else {
                return 'infinite';
            }
        }

        if (a > 0) {
            return 'infinite';
        }

        const quadratic = new Quadratic(a, b, c);
        const discriminant = quadratic.discriminant();
        
        // At this point, we know a < 0

        if (Utils.doubleEquals(discriminant, 0)) {
            return 'one';
        } else if (discriminant > 0) {
            return 'infinite';
        } else { // discriminant < 0
            return 'zero';
        }
    }

    identifyType() {
        this.simplify();

        if (!!this.type) {
            return;
        }

        const solutionsString = this.numberOfSolutionsString();

        if (solutionsString === 'one') {
            this.type = ConicSection.Types.point;
            return;
        }

        if (solutionsString === 'zero') {
            this.type = ConicSection.Types.emptySet;
            return;
        }

        // Else, there are infinite solutions, so more checks need to be made

        if (!Utils.doubleEquals(this.a, 0) && !Utils.doubleEquals(this.c, 0)
            && Utils.doubleEquals(this.b, 0) && Utils.doubleEquals(this.d, 0)
            && Utils.doubleEquals(this.e, 0) && Utils.doubleEquals(this.f, 0)) {
            this.type = ConicSection.Types.lines;
            return;
        }

        if ((this.a > 0 && this.c < 0) || (this.a < 0 && this.c > 0)) {
            this.type = ConicSection.Types.hyperbole;
            return;
        }

        if (!Utils.doubleEquals(this.a, 0) && Utils.doubleEquals(this.c, this.a)) {
            this.type = ConicSection.Types.circle;
            return;
        }

        if (!Utils.doubleEquals(this.a, 0) && !Utils.doubleEquals(this.c, 0)
            && !Utils.doubleEquals(this.a, this.c)) {
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