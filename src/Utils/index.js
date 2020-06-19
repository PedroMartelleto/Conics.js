export default class Utils {
    /**
     * Returns true if abs(x-y)<episilon.
     * @param {Number} x 
     * @param {Number} y 
     */
    static doubleEquals(x, y) {
        return Math.abs(x-y) < 0.0000001;
    }
}