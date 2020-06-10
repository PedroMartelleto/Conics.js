import Vector from "./Vector";

export default class Point {
    /**
     * Returns a 2D point (x, y) at the given coordinate sytem.
     * @param {number} x 
     * @param {number} y 
     * @param {CoordinateSystem | undefined} coordinateSystem 
     */
    static Point2(x, y, coordinateSystem = undefined) {
        if (!!coordinateSystem) {
            return new Point(Vector.Vec2(x, y), coordinateSystem.basis).add(coordinateSystem.origin);
        } else {
            return new Point(Vector.Vec2(x, y));
        }
    }

    /**
     * A point is a vector with an origin.
     * For points that are the origin of some coordinate system, coordinateSystem is undefined.
     * Origin points are stored in memory as a vector at the orthonormal basis. 
     * @param {Vector} vector 
     * @param {CoordinateSystem | undefined} coordinateSystem 
     */
    constructor(vector, coordinateSystem = undefined) {
        this.vector = vector;
        this.coordinateSystem = coordinateSystem;
    }

    /**
     * Returns this + other
     */
    add(other) {
        return new Point(this.vector.add(other.vector), this.coordinateSystem);
    }

    // MARK: Cloning

    /**
     * Clones this.
     */
    clone() {
        return new Point(this.vector.clone(), this.coordinateSystem);
    }

    toString() {
        return '(' + Math.round(this.vector.x * 100)/100 + ',' + Math.round(this.vector.y * 100)/100 + ')';
    }
}