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

    /**
     * Returns this + other.
     * @param {Matrix} other 
     */
    add(other) {
        const newMatrix = new Matrix(this.rowCount, this.colCount);

        for (let i = 0; i < this.colCount; ++i) {
            for (let j = 0; j < this.rowCount; ++j) {
                const index = i + j * this.rowCount;
                newMatrix.members[index] = this.members[index] + other.members[index];
            }
        }

        return newMatrix;
    }

    // MARK: Cloning
    
    /**
     * Clones this.
     */
    clone() {
        return new Matrix(this.rowCount, this.colCount, this.members.slice(0));
    }
}