Promise.all = (iter) => {
    let isRejected = false;
    let completed = 0;
    let result = [];
    return new Promise((res, rej) => {
        iter.forEach((current, index) => {
            Promise.resolve(current)
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
let iter = [
    new Promise((res) => setTimeout(() => res(7), 1000)),
    new Promise((res,rej) => setTimeout(() => rej("xoxox"), 2000)),
    new Promise((res) => setTimeout(() => res(15), 2000)),
];
Promise.all(iter).then((result) => {
        result.forEach(current => console.log(current));
    },
    (err) => {
        console.log(err);
    });