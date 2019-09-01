"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// @ts-ignore
exports.TRAVIS_BUILD = process.argv.indexOf("--travis-build") !== -1;
// @ts-ignore
exports.RUNNING_LOCALLY = (process.argv.indexOf("--local") !== -1 || process.argv.indexOf("-l") !== -1);
// @ts-ignore
global.createInterval = function (fn, interval) {
    return new (function () {
        this.baseline = undefined;
        this.run = function () {
            if (this.baseline === undefined) {
                this.baseline = Date.now();
            }
            fn();
            let end = Date.now();
            this.baseline += interval;
            let nextTick = interval - (end - this.baseline);
            if (nextTick < 0)
                nextTick = 0;
            this.timer = setTimeout(() => this.run(end), nextTick);
        };
        this.stop = () => clearTimeout(this.timer);
    });
};
// @ts-ignore
global.isset = function (v) {
    return typeof v !== "undefined";
};
Math.round_php = function (value, precision = 0, mode = "ROUND_HALF_UP") {
    let m, f, isHalf, sgn;
    m = Math.pow(10, precision);
    value *= m;
    // sign of the number
    sgn = (value > 0) | -(value < 0);
    isHalf = value % 1 === 0.5 * sgn;
    f = Math.floor(value);
    if (isHalf) {
        switch (mode) {
            case "ROUND_HALF_DOWN":
                // rounds .5 toward zero
                value = f + (sgn < 0);
                break;
            case "ROUND_HALF_EVEN":
                // rounds .5 towards the next even integer
                value = f + (f % 2 * sgn);
                break;
            case "ROUND_HALF_ODD":
                // rounds .5 towards the next odd integer
                value = f + !(f % 2);
                break;
            default:
                // rounds .5 away from zero
                value = f + (sgn > 0);
        }
    }
    return ((isHalf ? value : Math.round(value)) / m);
};
//# sourceMappingURL=Globals.js.map