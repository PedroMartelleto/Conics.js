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
     * Clones this.
     */
    clone() {
        return new Point(this.vector.clone(), this.coordinateSystem);
    }
}