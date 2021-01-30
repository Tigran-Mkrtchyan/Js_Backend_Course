createPromise((res, rej) => {
    rej(8)
})
    .then((val) => {
        console.log(val)
        return createPromise(res => res(val + 5));
    }, err => {
        console.log(err)
        return createPromise(res => res(err + 5));})
    .then((val) => {
        console.log(val)
    }, err => console.log(err))

// let iter = [
//     createPromise((res) => setTimeout(() => res(7), 0)),
//     createPromise((res, rej) => setTimeout(() => rej("err"), 0)),
//     createPromise((res) => setTimeout(() => res(30), 0)),
// ];

// Promise.all(iter).then((result) => {
//         result.forEach(current => console.log(current));
//     },
//     (err) => {
//         console.log(err);
//     });
function createPromise(executor) {
    if (!isFunction(executor)) {
        throw new Error("Promise executor undefined is not a function");
    }

    let state = "pending";
    let value = null;
    let arr = [];

    function res(val) {
        state = "fulfilled";
        value = val;
    }

    function rej(err) {
        state = "reject";
        value = err;
    }

    function doResolve(fn, res, rej) {
        let done = false;
        try {
            fn((value) => {
                if (done) return;
                done = true;
                res(value);
            }, (reason) => {
                if (done) return;
                done = true;
                rej(reason);
            });
        } catch (ex) {
            if (done) return
            done = true
            rej(ex)
        }

    }

    function resolve(value) {
        return createPromise((res) => {
            res(value);
        })
    }

    function getValue(value) {
        if (typeof value.then === 'function') {
            value.then(result => value = result);
        }
        return value;
    }

    doResolve(executor, res, rej);
    function check(){
        if (state === "pending") {
            setTimeout(check,0);
        }else if(state === "fulfilled"){
            let onFulfilled = arr[0];
            if (!isFunction(onFulfilled)) {
                return;
            }
            value = getValue(value)
            return resolve(onFulfilled(value));
        }else{
            let onReject = arr[1];
            if (!isFunction(onReject)) {
                return;
            }
            return resolve(onReject(value));
        }
    }
    return  {
        then: (onFulfilled, onReject) => {
            arr.push(onFulfilled,onReject)
            if (state === "pending") {
               setTimeout(check,0);
            }else {
                return check();
            }
        }
    };
}

function isFunction(x) {
    return x instanceof Function;
}

createPromise.resolve = (value) => {
    return createPromise(res => {
        setTimeout(()=>res(value),0);
    });
}
createPromise.reject = (value) => {
    return createPromise((res, rej) => {
        setTimeout(()=>rej(value),0);
    })
}

createPromise.all = (iter) => {
    let isRejected = false;
    let completed = 0;
    let result = [];
    return createPromise((res, rej) => {
        iter.forEach((current, index) => {
            createPromise.resolve(current)
                .then(val => {
                    result[index] = val;
                    completed++;
                    if (completed === iter.length) {
                        res(result);
                    }
                }, err => {
                    if (!isRejected) {
                        rej(err)
                    }
                });
        })
    })
}
