import Quadratic from '../Polynomial/Quadratic';
import Point from '../LinearAlgebra/Point';

export default class Ellipse {
    static fromConicSection(conicSection) {
        // TODO: Safety checks here

        // We start with
        // g(x, y) = ax^2 + cy^2 + dx + ey + f = 0
        //
        // We want to get to
        // a(x - x0)^2 + b(y - y0)^2 + c2 = g(x, y)
        //
        
        // Completes the square to find x0 and c1
        const s1 = Quadratic.completeTheSquare(conicSection.a, conicSection.d, conicSection.f);

        // Analagously, we find y0 and c2
        const s2 = Quadratic.completeTheSquare(conicSection.c, conicSection.e, s1.k);

        const x0 = s1.x0;
        const y0 = s2.x0;
        const k = s2.k;
        const a = Math.sqrt(-k / conicSection.a);
        const b = Math.sqrt(-k / conicSection.c);

        return new Ellipse(a, b, x0, y0);
    }

    /**
     * Represents an ellipse with form
     * (x - x0)^2/a^2 + (y - y0)^2/b^2 = 1.
     * @param {*} a 
     * @param {*} b 
     * @param {*} x0 
     * @param {*} y0 
     */
    constructor(a, b, x0, y0) {
        this.a = a;
        this.b = b;
        this.x0 = x0;
        this.y0 = y0;
    }

    get c() {
        return (this.a + this.b) * (this.a - this.b);
    }

    // TODO: Return these values at ellipse's own coordinate system

    get foci() {
        return [ Point.Point2(this.c, 0), Point.Point2(-this.c, 0) ]
    }

    get center() {
        return Point.Point2(0, 0);
    }

    get vertices() {
        return [ Point.Point2(this.a, 0), Point.Point2(-this.a, 0), Point.Point2(0, this.b), Point.Point2(0, -this.b) ];
    }
}