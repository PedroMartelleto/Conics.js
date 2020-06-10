import Matrix from "./Matrix";

export default class Vector {
    // MARK: Constructors

    /**
     * x, y are the components of the vector at the given basis.
     * Basis = undefined is conventioned to be the orthonormal basis.
     * @param {number} x
     * @param {number} y 
     * @param {Basis | undefined} basis 
     */
    static Vec2(x, y, basis = undefined) {
        const mat = new Matrix(2, 1);
        mat.members[0] = x;
        mat.members[1] = y;
        return new Vector(mat, basis);
    }

    /**
     * Basis = undefined is conventioned to be the orthonormal basis.
     * @param {Matrix} matrix 
     * @param {Basis | undefined} basis 
     */
    constructor(matrix, basis = undefined) {
        this.matrix = matrix;
        this.basis = basis;
    }

    /**
     * Returns this + other
     * @param {Vector} other 
     */
    add(other) {
        return new Vector(this.matrix.add(other.matrix), this.basis);
    }


    // MARK: Cloning
    
    /**
     * Clones this.
     */
    clone() {
        return new Vector(this.matrix.clone(), this.basis);
    }


    // MARK: Getters and Setters

    get x() { return this.matrix.members[0]; }
    set x(newValue) { this.matrix.members[0] = newValue; }

    get y() { return this.matrix.members[1]; }
    set y(newValue) { this.matrix.members[1] = newValue; }

    get z() { return this.matrix.members[2]; }
    set z(newValue) { this.matrix.members[2] = newValue; }

    get w() { return this.matrix.members[3]; }
    set w(newValue) { this.matrix.members[3] = newValue; }


    // MARK: toString

    toString() {
        let str = "(";

        for (let i = 0; i < this.components.length; ++i) {
            str += this.components[i];
            
            if (i !== this.components.length - 1) {
                str += ",";
            }
        }

        str += ")";

        return str;
    }
}