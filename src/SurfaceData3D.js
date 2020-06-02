export default class SurfaceData3D {   
    constructor(fn) {
        this.fn = fn;
        this.resolutionX = 30;
        this.resolutionY = 30;
        
        this.xData = undefined;
        this.yData = undefined;
        this.zData = undefined;
    }

    generateXY() {
        this.xData = new Array(this.resolutionX);
        this.yData = new Array(this.resolutionY);

        for (let x = 0; x < this.resolutionX; ++x) {
            this.xData[x] = x - this.resolutionX/2;
        }

        for (let y = 0; y < this.resolutionY; ++y) {
            this.yData[y] = y - this.resolutionY/2;
        }
    }

    generateZ() {
        if (!this.zData) {
            this.zData = new Array(this.resolutionY);
        }

        for (let y = 0; y < this.resolutionY; ++y) {
            if (!this.zData[y]) {
                this.zData[y] = new Array(this.resolutionX);
            }

            for (let x = 0; x < this.resolutionX; ++x) {
                this.zData[y][x] = this.fn(this.xData[x], this.yData[y]) ?? 0;
            }
        }
    }
}