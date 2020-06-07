import CoordinateSystem from "./CoordinateSystem";
import Vector from "./Vector";

export default class Point {
    /**
     * A point is a vector with an origin.
     * For points that are the origin of some coordinate system, coordinateSystem is undefined.
     * Origin points are stored in memory as a vector at the orthonormal basis. 
     * @param {Vector} vector 
     * @param {CoordinateSystem} coordinateSystem 
     */
    constructor(vector, coordinateSystem) {
        this.vector = vector;
        this.coordinateSystem = coordinateSystem;
    }


    // MARK: Cloning

    /**
     * Copies the given point.
     * @param {Point} other 
     */
    constructor(other) {
        this.vector = other.vector.clone();
        this.coordinateSystem = other.coordinateSystem;
    }
    
    /**
     * Clones this.
     */
    clone() {
        return new Point(this);
    }
}