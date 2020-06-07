export default class Matrix {
    /**
     * Initializes a NxM matrix.
     * @param {number} rowCount
     * @param {number} colCount 
     */
    constructor(rowCount, colCount) {
        this.rowCount = rowCount;
        this.colCount = colCount;
        this.members = new Float64Array(rowCount * colCount);
    }


    // MARK: Cloning

    /**
     * Copies the given matrix.
     * @param {Matrix} other 
     */
    constructor(other) {
        this.rowCount = other.rowCount;
        this.colCount = other.colCount;
        this.members = other.members.slice(0);
    }
    
    /**
     * Clones this.
     */
    clone() {
        return new Matrix(this);
    }
}