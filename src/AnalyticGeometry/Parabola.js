import Point from "../LinearAlgebra/Point";
import Quadratic from "../Polynomial/Quadratic";

export default class Parabola {
    static fromConicSection(conicSection) {
        const conic = conicSection.clone();

        // If x is the term that is squared, switch x and y.
        if (conic.a !== 0) {
            // TODO: I have no idea if this is correct
            // Swaps c and a
            const c = conic.c;
            conic.c = conic.a;
            conic.a = c;

            // Swaps d and e
            const e = conic.e;
            conic.e = conic.d;
            conic.d = e;
        }

        // Now we can be sure that we have an equation of type
        // g(x,y) = cy^2 + dx + ey + f = 0

        const s = Quadratic.completeTheSquare(conic.c, conic.e, conic.f);

        // Now we have
        // g(x,y) = (y - y0)^2 + d/c*x + k/c = 0

        // At the end we need
        // d/c*x + k/c = 4p(x - x0)

        // Solving that equation we get the result below

        const p = -conic.d / (4 * conic.c);
        const x0 = -s.k / (4 * p * conic.c);
        const y0 = s.x0;

        return new Parabola(p, x0, y0);
    }

    /**
     * Represents a parabola with form
     * 4px = (y - y0)^2.
     * @param {number} p
     * @param {number} x0
     * @param {x0} y0 
     */
    constructor(p, x0, y0) {
        this.p = p;
        this.x0 = x0;
        this.y0 = y0;
    }

    // TODO: Return these values at parabola's own coordinate system

    get focus() {
        return Point.Point2(this.p, 0);
    }

    get vertex() {
        return Point.Point2(0, 0);
    }

    get axisEquation() {
        return 'y = 0';
    }
}