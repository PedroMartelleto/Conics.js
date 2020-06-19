export default class Quadratic {
    // Finds x0 and k such that ax^2 + bx + c = a(x - x0)^2 + k

    static completeTheSquare(a, b, c) {
        const x0 = - b / (2 * a);
        const k = c - a * (x0**2);

        return { x0, k };
    }

    constructor(a, b, c) {
        this.a = a;
        this.b = b;
        this.c = c;
    }

    discriminant() {
        return this.b**2 - 4*this.a*this.c;
    }

    roots() {
        const delta = this.discriminant();

        if (delta < 0) {
            return [ 'imaginary', 'imaginary' ];
        }

        const deltaRoot = Math.sqrt(delta);
        
        var x1 = (-this.b + deltaRoot) / (2*this.a);
        var x2 = (-this.b - deltaRoot) / (2*this.a);

        return [ x1, x2 ];
    }
}