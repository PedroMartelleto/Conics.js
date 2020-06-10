export default class Matrix {
    /**
     * Initializes a NxM matrix.
     * @param {number} rowCount
     * @param {number} colCount 
     * @param {Float64Array} members
     */
    constructor(rowCount, colCount, members = undefined) {
        this.rowCount = rowCount;
        this.colCount = colCount;
        this.members = members ?? new Float64Array(rowCount * colCount);
    }


    // MARK: Cloning
    
    /**
     * Clones this.
     */
    clone() {
        return new Matrix(this.rowCount, this.colCount, this.members.slice(0));
    }
}