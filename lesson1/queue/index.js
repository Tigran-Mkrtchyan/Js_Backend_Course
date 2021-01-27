function createStack() {
    let arr = [];

    return {
        push: (val) => {
            arr.push(val);
        },
        pop: () => {
            if (arr.length === 0) {
                throw new Error("Stack is empty");
            }
            return arr.pop();
        },
        size: () => {
            return arr.length;
        }
    }
}

function createQueue() {
    let firstStack = createStack();
    let secondStack = createStack();
    return {
        push: (value) => {
            firstStack.push(value);
        },
        pop: () => {
            if (secondStack.size() !== 0) {
                return secondStack.pop();
            }
            while (firstStack.size() !== 0) {
                secondStack.push(firstStack.pop());
            }
            try {
                return secondStack.pop()
            } catch (e) {
                throw new Error("queue is empty")
            }
        },
        size: () => {
            return firstStack.size() + secondStack.size();
        }
    }
}

let queue = createQueue();
queue.push(2);
queue.push(3);
queue.push(4);
console.log(queue.pop());
queue.push(5);
console.log("size is: " + queue.size());
console.log(queue.pop());
console.log(queue.pop());
console.log(queue.pop());


