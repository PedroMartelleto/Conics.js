export default class CoordinateSystem {
    /**
     * A coordinate system is given by a point and a basis.
     * @param {Point} origin 
     * @param {Basis} basis 
     */
    constructor(origin, basis) {
        this.origin = origin;
        this.basis = basis;
    }


    // MARK: Cloning

    /**
     * Clones this.
     */
    clone() {
        return new CoordinateSystem(this.origin.clone(), this.basis.clone());
    }
}