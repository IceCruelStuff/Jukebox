export function Async(cb){
    return new Promise((resolve, reject) => {
        setImmediate(() => {
            try {
                resolve(cb());
            } catch(e) {
                reject(e);
            }
        });
    });
}