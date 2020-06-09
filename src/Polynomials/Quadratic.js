export default class Quadratic {
    constructor(a, b, c) {
        this.a = a;
        this.b = b;
        this.c = c;
    }
    
    roots() {
        const delta = b**2 - 4*a*c;

        if (delta < 0) {
            console.warn("Imaginary roots are currently not supported.");
            return [ 0, 0 ];
        }

        const deltaRoot = Math.sqrt(delta);
        
        var x1 = (-b + deltaRoot) / (2*a);
        var x2 = (-b - deltaRoot) / (2*a);

        return [ x1, x2 ];
    }
}