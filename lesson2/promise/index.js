createPromise((res, rej) => {
    res(8)
})
    .than((val) => {
        console.log(val)
        return createPromise(res => res(val + 5));
    }, err => console.log(err))
    .than((val) => {
        console.log(val)
    }, err => console.log(err))


function createPromise(executor) {
    if (!isFunction(executor)) {
        throw new Error("Promise executor undefined is not a function");
    }

    let state = "pending";
    let value = null;

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
                if (done) return
                done = true
                res(value)
            }, (reason) => {
                if (done) return
                done = true
                rej(reason)
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
        if (typeof value.than === 'function') {
            value.than(result => value = result);
        }
        return value;
    }

    doResolve(executor, res, rej);
    return {
        than: (onFulfilled, onReject) => {
            if (state === "fulfilled") {
                if (!isFunction(onFulfilled)) {
                    return;
                }
                value = getValue(value)
                return resolve(onFulfilled(value));
            } else {
                if (!isFunction(onReject)) {
                    return;
                }
                return resolve(onReject(value));
            }
        }
    };
}

function isFunction(x) {
    return x instanceof Function;
}
