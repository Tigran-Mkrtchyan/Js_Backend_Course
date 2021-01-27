function createNode(data) {
    return {
        value: data,
        next: null,
    }
}

function createLinkedList() {
    let first = null, tail = null;
    return {
        getHead: ()=>{
            return first;
        },
        getTail:()=>{
            return tail;
        },
        add: (value) => {
            let newNode = createNode(value);
            if (first == null) {
                first = newNode;
                tail = newNode;
            } else {
                tail.next = newNode;
                tail = newNode;
            }
        },
        remove: () => {
            if (first == null) {
                throw new Error("there is no element")
            } else {
                let tamp = first;
                first = first.next;
                return tamp;
            }
        },
        find: (val) => {
            if (first == null) {
                return null;
            }
            let current = first;
            while (current != null) {
                if (current.value === val) {
                    return current;
                }
                current = current.next;
            }
        }
    }
}

function isCyclic(node) {
    if (node == null) {
        return false;
    }
    let first = node;
    let second = node;
    while (second.next != null) {
        first = first.next;
        second = second.next.next;
        if (first === second) {
            return true
        }
    }
    return false;
}

let linkedList = createLinkedList();
linkedList.add(12);
linkedList.add(21);
linkedList.add(23);
console.log(linkedList.remove().value);
linkedList.add(34);
linkedList.add(42);
linkedList.add(53);

let node = linkedList.find(21);
let tail = linkedList.getTail();
tail.next = node;

 console.log(isCyclic(linkedList.getHead()));

