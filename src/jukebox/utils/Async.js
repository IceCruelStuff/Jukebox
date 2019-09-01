"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function Async(cb) {
    return new Promise((resolve, reject) => {
        setImmediate(() => {
            try {
                resolve(cb());
            }
            catch (e) {
                reject(e);
            }
        });
    });
}
exports.Async = Async;
//# sourceMappingURL=Async.js.map