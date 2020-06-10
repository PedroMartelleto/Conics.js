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
     * Clones this.
     */
    clone() {
        return new Basis(this.vectors.slice(0));
    }
}