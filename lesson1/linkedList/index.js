function createNode(data) {
    return {
        value: data,
        next: null,
    }
}

function createLinkedList() {
    let first = null, tail = null;
    return {
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
            }else{
                let tamp  = first;
                first = first.next;
                return tamp;
            }
        }
    }
}

let linkedList = createLinkedList();
linkedList.add(12);
linkedList.add(21);
console.log(linkedList.remove().value);

linkedList.add(23);
linkedList.add(34);
console.log(linkedList.remove().value);
console.log(linkedList.remove().value);
console.log(linkedList.remove().value);
