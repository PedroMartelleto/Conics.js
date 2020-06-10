export default class Quadratic {
    constructor(a, b, c) {
        this.a = a;
        this.b = b;
        this.c = c;
    }
    
    roots() {
        const delta = this.b**2 - 4*this.a*this.c;

        if (delta < 0) {
            console.warn("Imaginary roots are currently not supported.");
            return [ 0, 0 ];
        }

        const deltaRoot = Math.sqrt(delta);
        
        var x1 = (-this.b + deltaRoot) / (2*this.a);
        var x2 = (-this.b - deltaRoot) / (2*this.a);

        return [ x1, x2 ];
    }
}