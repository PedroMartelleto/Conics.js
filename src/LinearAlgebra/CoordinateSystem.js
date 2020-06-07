import Basis from "./Basis";
import Point from "./Point";

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
     * Copies the given basis.
     * @param {CoordinateSystem} other 
     */
    constructor(other) {
        this.origin = other.origin.clone();
        this.basis = other.basis.clone();
    }
    
    /**
     * Clones this.
     */
    clone() {
        return new CoordinateSystem(this);
    }
}