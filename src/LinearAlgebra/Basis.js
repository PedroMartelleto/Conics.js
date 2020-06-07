import Vector from "./Vector";

export default class Basis {
    /**
     * Initializes a basis using the given vectors.
     * @param {Vector[]} vectors 
     */
    constructor(vectors) {
        this.vectors = vectors;
    }


    // MARK: Cloning

    /**
     * Copies the given basis.
     * @param {Matrix} other 
     */
    constructor(other) {
        this.vectors = other.vectors.slice(0);
    }
    
    /**
     * Clones this.
     */
    clone() {
        return new Basis(this);
    }
}